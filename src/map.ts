import {Sea} from "./route/sea.route";
import {Land} from "./route/land.route";
import {Location} from "./location";

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

        port.roads.push(...[new Sea(warehouseA, 4), new Land(factory, 1)]);
        warehouseA.roads.push(...[new Sea(port, 4)]);
        warehouseB.roads.push(...[new Land(factory, 5)]);
        factory.roads.push(...[new Land(warehouseB, 5), new Land(port, 1)]);
        return new Map(factory, warehouseA, warehouseB, port);
    }
}
