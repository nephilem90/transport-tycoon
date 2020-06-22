export abstract class Route {
    constructor(readonly to: Location, readonly time: number) {
    }
}

export class Land extends Route {
}

export class Sea extends Route {
}

export class Container {
    constructor(readonly destination: Location) {
    }
}

export class Location {
    private readonly containers: Container[] = [];
    private _roads: Route[];

    constructor(private name: string) {
    }

    addContainer(container: Container): void {
        this.containers.push(container);
    }


    get roads(): Route[] {
        return this._roads;
    }

    set roads(value: Route[]) {
        this._roads = value;
    }

    getUnusedRoadsFromVisitedLocations(locations: Location[]) {
        return this.roads.filter(road => locations.indexOf(road.to) === -1);
    }

    getNextContainerIfPresent(): Container | undefined {
        return this.containers.shift();
    }

    isPresent(container: Container): boolean {
        return this.containers.includes(container)
    }
}

export class Map {
    private constructor(
        readonly factory: Location,
        readonly warehouseA: Location,
        readonly warehouseB: Location,
        readonly port: Location,
    ) {
    }

    static initialize() {
        const port = new Location('port');
        const warehouseA = new Location('a');
        const warehouseB = new Location('b');
        const factory = new Location('factory');

        port.roads = [new Sea(warehouseA, 4), new Land(factory, 1)];
        warehouseA.roads = [new Sea(port, 4)];
        warehouseB.roads = [new Land(factory, 5)];
        factory.roads = [new Land(warehouseB, 5), new Land(port, 1)];
        return new Map(factory, warehouseA, warehouseB, port);
    }
}

export abstract class Transport {
    //todo gestire i tipi di route
    run(): void {
        if (this.waitFor > 0) {
            this.waitFor--;
            if (this.waitFor !== 0) {
                return;
            }
        }
        if (this.source === this.actual && this.container === undefined) {
            this.trip = this.createTrip(
                this.setContainerFromActual()?.destination ?? this.source,
            );
        }

        const road = this.trip.shift();
        if (this.canAdvance(road)) {
            this.actual = road.to;
            this.waitFor = road.time;
            this.waitFor--;
        } else {
            this.waitFor = 0;
        }

        if (this.container && this.waitFor === 0) {
            this.actual.addContainer(this.container);
            this.container = undefined;
        }
    }

    private setContainerFromActual() {
        this.container = this.source.getNextContainerIfPresent()
        return this.container;
    }

    private trip: Route[];
    private actual: Location;
    private container?: Container;
    private waitFor = 0;

    constructor(
        private source: Location,
    ) {
        this.actual = source;
    }

    createTrip(goal: Location): Route[] {
        return this.calculateTrip(this.source, goal, [], []);
    }

    private calculateTrip(actual: Location, goal: Location, visitedRoads: Route[], visitedLocations: Location[]): Route[] {
        if (actual == goal) {
            return visitedRoads;
        }
        return actual.getUnusedRoadsFromVisitedLocations(visitedLocations)
            .map(road => this.calculateTrip(road.to, goal, visitedRoads.concat([road]), visitedLocations.concat(actual)))
            .find(roads => roads.length !== 0) ?? [];
    }

    abstract canAdvance(next: Route | undefined): next is Route
}

export class Truck extends Transport {

    canAdvance(next: Route | undefined): next is Route {
        return next instanceof Land
    }
}

