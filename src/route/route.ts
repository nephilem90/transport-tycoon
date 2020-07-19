import {Location} from "../location";

export abstract class Route {
    constructor(readonly to: Location, readonly time: number) {
    }
}
