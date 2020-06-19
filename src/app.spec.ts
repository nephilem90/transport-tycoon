import {Land, Map, Sea, Transport} from "./app";

const map = Map.initialize();
it('dovrebbe tornare un array di strade per B', () => {
    const track = new Transport(map.factory);
    expect(track.createTrip(map.warehouseB)).toStrictEqual([new Land(map.warehouseB)]);
});
it('dovrebbe tornare un array di strade per A', () => {
    const track = new Transport(map.factory);
    expect(track.createTrip(map.warehouseA)).toStrictEqual([new Land(map.port), new Sea(map.warehouseA)]);
});
