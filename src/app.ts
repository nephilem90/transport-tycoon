export abstract class Route {
    constructor(readonly to: Location) {
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
    readonly containers: Container[] = [];

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

        port.roads = [new Sea(warehouseA), new Land(factory)];
        warehouseA.roads = [new Sea(port)];
        warehouseB.roads = [new Land(factory)];
        factory.roads = [new Land(warehouseB), new Land(port)];
        return new Map(factory, warehouseA, warehouseB, port);
    }
}

export class Transport {
    //todo aggiungere pesi
    run(): void {
        if (this.source === this.actual && this.container === undefined) {
            this.trip = this.createTrip(
                this.setContainerFromActual()?.destination ?? this.source,
            );
        }
        this.actual = this.trip.shift()?.to ?? this.actual;
        if (this.actual === this.container?.destination) {
            this.actual.addContainer(this.container);
            this.container = undefined;
        }
    }

    private setContainerFromActual() {
        this.container = this.source.containers?.shift();
        return this.container;
    }

    private trip: Route[];
    private actual: Location;
    private container?: Container;

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
}
