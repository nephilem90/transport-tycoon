import {Map} from "./map";
import {Container} from "./container";

let map: Map;
beforeEach(() => {
    map = Map.initialize();
});

it('should return true if location has un-delivery container', () => {
    expect(map.factory.hasUndeliveredContainers()).toBeFalsy();

    map.factory.addContainer(new Container(map.factory));
    expect(map.factory.hasUndeliveredContainers()).toBeFalsy();

    map.factory.addContainer(new Container(map.warehouseA));
    expect(map.factory.hasUndeliveredContainers()).toBeTruthy();
});

it('should return array with unvisited route', () => {
    expect(map.factory.getUnvisitedRoute([map.port]).length).toBe(1);
    expect(map.factory.getUnvisitedRoute([map.warehouseB, map.port])).toStrictEqual([]);
});
