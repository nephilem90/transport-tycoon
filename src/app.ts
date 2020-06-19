export class Road {
    get to(): Location {
        return this._to;
    }

    set to(value: Location) {
        this._to = value;
    }

    constructor(private _to: Location) {
    }
}

export class Location {
    private _roads: Road[];

    constructor(private _name: string) {
    }

    get name(): string {
        return this._name;
    }

    get roads(): Road[] {
        return this._roads;
    }

    set roads(value: Road[]) {
        this._roads = value;
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

        port.roads = [new Road(warehouseA), new Road(factory)];
        warehouseA.roads = [new Road(port)];
        warehouseB.roads = [new Road(factory)];
        factory.roads = [new Road(warehouseB), new Road(port)];
        return new Map(factory, warehouseA, warehouseB, port);
    }
}

export class Transport {
    private actual: Location;
    private trip: Location[];

    constructor(
        private source: Location
    ) {
    }

    createTrip(goal: Location): Road[] {
        return this.calculateTrip(this.source, goal, [], []);
    }

    private calculateTrip(actual: Location, goal: Location, visitedRoads: Road[], visitLocations: Location[]): Road[] {
        if (actual == goal) {
            return visitedRoads;
        }
        const notVisited: Road[] = actual.roads.filter((road: Road) => visitLocations.indexOf(road.to) === -1);
        //caso di errore
        if (notVisited.length === 0) {
            return [];
        }
        let tmp: Road[] = [];
        notVisited.forEach((road: Road) => {
            if (tmp.length === 0) {
                tmp = this.calculateTrip(road.to, goal, visitedRoads.concat([road]), visitLocations.concat(actual));
            }
        });
        return tmp;
    }
}
