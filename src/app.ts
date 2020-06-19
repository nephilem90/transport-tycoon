export class Road {
    get to(): App {
        return this._to;
    }

    set to(value: App) {
        this._to = value;
    }

    constructor(private _to: App) {
    }
}

export class App {
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
    get factory(): App {
        return this._factory;
    }

    get warehouseA(): App {
        return this._warehouseA;
    }

    get warehouseB(): App {
        return this._warehouseB;
    }

    get port(): App {
        return this._port;
    }

    private constructor(
        private _factory: App,
        private _warehouseA: App,
        private _warehouseB: App,
        private _port: App,
    ) {
    }

    static initialize() {
        const port = new App('port');
        const warehouseA = new App('a');
        const warehouseB = new App('b');
        const factory = new App('factory');

        port.roads = [new Road(warehouseA), new Road(factory)];
        warehouseA.roads = [new Road(port)];
        warehouseB.roads = [new Road(factory)];
        factory.roads = [new Road(warehouseB), new Road(port)];
        return new Map(factory, warehouseA, warehouseB, port);
    }
}

export class Transport {
    private actual: App;
    private trip: App[];

    constructor(
        private source: App
    ) {
    }

    createTrip(goal: App): Road[] {
        return this.calculateTripe(this.source, goal, [], []);
    }

    private calculateTripe(actual: App, goal: App, visits: Road[], visitsLocation: App[]): Road[] {
        if (actual == goal) {
            return visits;
        }
        const notVisited: Road[] = actual.roads.filter((road: Road) => visitsLocation.indexOf(road.to) === -1);
        //caso di errore
        if (notVisited.length === 0) {
            return [];
        }
        let tmp: Road[] = [];
        notVisited.forEach((road: Road) => {
            if (tmp.length === 0) {
                tmp = this.calculateTripe(road.to, goal, visits.concat([road]), visitsLocation.concat(actual));
            }
        });
        return tmp;
    }
}
