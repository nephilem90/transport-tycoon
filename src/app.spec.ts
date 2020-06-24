import {Land} from "./route/land.route";
import {Container} from "./container";
import {Map} from "./map";
import {Truck} from "./vehicle/truck.vehicle";
import {App} from "./app";
import {Boat} from "./vehicle/boat.vehicle";
import {removeAllListeners} from "./event/service.event";

let map: Map;
beforeEach(() => {
    removeAllListeners();
    map = Map.initialize();
});

it('should return 5', async () => {
    map.factory.addContainer(new Container(map.warehouseA));
    const truck = new Truck(map.factory);
    const boat = new Boat(map.port);
    const app = new App(map.factory, [truck, boat]);
    expect(await app.move()).toBe(5);
});

it('should return 7', async () => {
    map.factory.addContainer(new Container(map.warehouseA));
    map.factory.addContainer(new Container(map.warehouseB));
    const truck = new Truck(map.factory);
    const boat = new Boat(map.port);
    const app = new App(map.factory, [truck, boat]);
    expect(await app.move()).toBe(7);
});
it('should return 5', async () => {
    map.factory.addContainer(new Container(map.warehouseA));
    map.factory.addContainer(new Container(map.warehouseB));
    const truck1 = new Truck(map.factory);
    const truck2 = new Truck(map.factory);
    const boat = new Boat(map.port);
    const app = new App(map.factory, [truck1, truck2, boat]);
    expect(await app.move()).toBe(5);
});
it('should pass the exercise 1', async () => {
    const truck1 = new Truck(map.factory);
    const truck2 = new Truck(map.factory);
    const boat = new Boat(map.port);
    map.factory.addContainer(new Container(map.warehouseA));
    map.factory.addContainer(new Container(map.warehouseA));
    map.factory.addContainer(new Container(map.warehouseB));
    map.factory.addContainer(new Container(map.warehouseA));
    map.factory.addContainer(new Container(map.warehouseB));
    map.factory.addContainer(new Container(map.warehouseB));
    map.factory.addContainer(new Container(map.warehouseA));
    map.factory.addContainer(new Container(map.warehouseB));
    const app = new App(map.factory, [truck1, truck2, boat]);
    expect(await app.move()).toBe(29);
});
