import {Container} from "./container";
import {Route} from "./route/route";
import {emit, on} from "./event/service.event";
import {AppEvent} from "./event/app.event";

export class Location {
    readonly containers: Container[] = [];

    readonly roads: Route[] = [];

    constructor(readonly name: string) {
        this.setTickEvent();
    }

    addContainer(container: Container): void {
        container.addLocation(this);
        this.containers.push(container);
    }

    getUnvisitedRoute(locations: Location[]): Route[] {
        return this.roads.filter(road => locations.indexOf(road.to) === -1);
    }

    hasUndeliveredContainers(): boolean {
        return !!this.containers.find(container => container.destination !== this);
    }

    markReady() {
        this.containers.forEach(container => container.setReady(true));
    }

    getContainerNumber() {
        return this.containers.length;
    }

    shiftUndeliveredContainer(): Container | undefined {
        const undelivered = this.containers
            .filter(container => container.destination !== this)
            .find(container => container.isReady());
        if (!!undelivered) this.containers.splice(this.containers.indexOf(undelivered), 1);
        return undelivered;
    }

    private setTickEvent() {
        on(AppEvent.TICK, (tick: number) => {
            this.markReady();
            emit(AppEvent.GO, this, tick);
        });
    }
}
