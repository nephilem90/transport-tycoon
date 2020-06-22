import { Container, Land, Map, Sea, Transport, Truck } from "./app";

const map = Map.initialize();
it('dovrebbe tornare un array di strade per B', () => {
    const truck = new Truck(map.factory);
    expect(truck.createTrip(map.warehouseB)).toStrictEqual([new Land(map.warehouseB, 5)]);
});
it('dovrebbe tornare un array di strade per A', () => {
    const truck = new Truck(map.factory);
    expect(truck.createTrip(map.warehouseA)).toStrictEqual([new Land(map.port, 1), new Sea(map.warehouseA, 4)]);
});

it('calcolo tempo', () => {
    const container = new Container(map.warehouseB);

    map.factory.addContainer(container);
    const truck = new Truck(map.factory);
    expect(map.warehouseB.isPresent(container)).toBeFalsy();
    truck.run();
    expect(map.warehouseB.isPresent(container)).toBeFalsy();
    truck.run();
    expect(map.warehouseB.isPresent(container)).toBeFalsy();
    truck.run();
    expect(map.warehouseB.isPresent(container)).toBeFalsy();
    truck.run();
    expect(map.warehouseB.isPresent(container)).toBeFalsy();
    truck.run();
    expect(map.warehouseB.isPresent(container)).toBe(true);
});

it('truck should stop at at sea location', () => {
    const container = new Container(map.warehouseA);

    map.factory.addContainer(container);
    const truck = new Truck(map.factory);

    expect(map.port.isPresent(container)).toBeFalsy();
    expect(map.warehouseA.isPresent(container)).toBeFalsy();

    truck.run();

    expect(map.port.isPresent(container)).toBe(true);
});
