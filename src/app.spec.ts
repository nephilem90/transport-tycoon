import {Container, Land, Map, Sea, Transport} from "./app";

const map = Map.initialize();
it('dovrebbe tornare un array di strade per B', () => {
    const truck = new Transport(map.factory);
    expect(truck.createTrip(map.warehouseB)).toStrictEqual([new Land(map.warehouseB, 5)]);
});
it('dovrebbe tornare un array di strade per A', () => {
    const truck = new Transport(map.factory);
    expect(truck.createTrip(map.warehouseA)).toStrictEqual([new Land(map.port, 1), new Sea(map.warehouseA, 4)]);
});

it('calcolo tempo', () => {
    map.factory.addContainer(new Container(map.warehouseB));
    const truck = new Transport(map.factory);
    expect(map.warehouseB.containers.length).toBe(0);
    truck.run();
    expect(map.warehouseB.containers.length).toBe(0);
    truck.run();
    expect(map.warehouseB.containers.length).toBe(0);
    truck.run();
    expect(map.warehouseB.containers.length).toBe(0);
    truck.run();
    expect(map.warehouseB.containers.length).toBe(0);
    truck.run();
    expect(map.warehouseB.containers.length).toBe(1);
});

