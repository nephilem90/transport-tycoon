import {Route} from "../route/route";
import {Container} from "../container";
import {Location} from "../location";
import {emit, on} from "../event/service.event";
import {AppEvent} from "../event/app.event";

export abstract class Vehicle {
    abstract acceptedRoute: typeof Route;
    private tic: number = 0;
    private trip: Route[] = [];
    private next: undefined | Location;
    private actual: Location;
    private container?: Container;
    private waitFor = 0;

    constructor(private source: Location) {
        this.actual = source;
        this.setStartEvent();
    }

    filterRoute(route: Route[]): Route[] {
        const next = route.shift();
        return next instanceof this.acceptedRoute ? [next].concat(this.filterRoute(route)) : [];
    }

    setStartEvent() {
        on(AppEvent.GO, (location: Location, tic: number) => {
            if (location === this.actual && tic > this.tic) {
                this.tic = tic;
                this.run();
            }
        });
    }

    createTrip(goal: Location): Route[] {
        return this.filterRoute(this.calculateTrip(this.actual, goal, [], []));
    }

    run() {
        if (this.isStopped()) this.load();
        if (this.isInMovement()) this.waitFor--;
        if (this.isStopped()) this.arrived();
        if (this.isInDestination()) this.upload();
        emit(AppEvent.END_RUN, this);
    }

    private setNext(): void {
        const road = this.trip.shift();
        if (road instanceof Route) {
            this.next = road.to;
            this.waitFor = road.time;
        }
    }

    private setContainerFromActual(): void {
        this.container = this.actual.shiftUndeliveredContainer();
    }

    private calculateTrip(actual: Location, goal: Location, visitedRoads: Route[], visitedLocations: Location[]): Route[] {
        if (actual == goal) {
            return visitedRoads;
        }
        return actual.getUnvisitedRoute(visitedLocations)
            .map(road => this.calculateTrip(road.to, goal, visitedRoads.concat([road]), visitedLocations.concat(actual)))
            .find(roads => roads.length !== 0) ?? [];
    }

    private load() {
        this.source === this.actual && !this.container && this.setContainerFromActual();
        this.trip = this.createTrip(this.container?.destination ?? this.source);
        this.setNext();
    }

    private upload() {
        if (this.container?.destination === this.actual) emit(AppEvent.ARRIVED, this.tic);
        if (!!this.container) this.actual.addContainer(this.container);
        this.container = undefined;
    }

    private isInDestination(): boolean {
        return this.waitFor === 0 && this.trip.length === 0;
    }

    private isInMovement() {
        return this.waitFor !== 0;
    }

    private isStopped() {
        return this.waitFor === 0;
    }

    private arrived() {
        this.actual = this.next ?? this.actual;
        this.next = undefined;
    }
}

