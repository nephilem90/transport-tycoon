import {Map} from "../map";
import {Truck} from "./truck.vehicle";
import {Land} from "../route/land.route";

let map: Map;
beforeEach(() => {
    map = Map.initialize();
});

it('should return array of route towards B', () => {
    const truck = new Truck(map.factory);
    expect(truck.createTrip(map.warehouseB)).toStrictEqual([new Land(map.warehouseB, 5)]);
});
it('should return array of route towards A', () => {
    const truck = new Truck(map.factory);
    expect(truck.createTrip(map.warehouseA)).toStrictEqual([new Land(map.port, 1)]);
});
