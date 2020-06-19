export abstract class Route {
    constructor(private _to: Location) {
    }

    get to(): Location {
        return this._to;
    }

    set to(value: Location) {
        this._to = value;
    }
}

export class Land extends Route {
}
export class Sea extends Route {
}

export class Container {
    constructor(private _destination: Location) {
    }
    get destination(): Location {
        return this._destination;
    }
}
export class Location {
    private _roads: Route[];

    constructor(private _name: string) {
    }

    get name(): string {
        return this._name;
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
    get factory(): Location {
        return this._factory;
    }

    get warehouseA(): Location {
        return this._warehouseA;
    }

    get warehouseB(): Location {
        return this._warehouseB;
    }

    get port(): Location {
        return this._port;
    }

    private constructor(
        private _factory: Location,
        private _warehouseA: Location,
        private _warehouseB: Location,
        private _port: Location,
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
    private trip: Location[];

    constructor(
        private source: Location,
    ) {
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
