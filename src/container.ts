import {Location} from "./location";

export class Container {
    private ready: boolean = true;

    constructor(readonly destination: Location, readonly logs: Location[] = []) {
    }

    isReady(): boolean {
        return this.ready;
    }

    setReady(value: boolean) {
        this.ready = value;
    }

    addLocation(location: Location) {
        this.logs.push(location);
    }
}
