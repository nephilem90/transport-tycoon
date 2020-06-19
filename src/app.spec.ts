import {Map, Road, Transport} from "./app";

const map = Map.initialize();
it('dovrebbe tornare un array di strade per B', () => {
    const track = new Transport(map.factory);
    expect(track.createTrip(map.warehouseB)).toStrictEqual([new Road(map.warehouseB)]);
});
it('dovrebbe tornare un array di strade per A', () => {
    const track = new Transport(map.factory);
    expect(track.createTrip(map.warehouseA)).toStrictEqual([new Road(map.port), new Road(map.warehouseA)]);
});
