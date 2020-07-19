import {Location} from "./location";
import {Vehicle} from "./vehicle/vehicle";
import {asyncOn, emit, on, removeAllListeners} from "./event/service.event";
import {AppEvent} from "./event/app.event";

export class App {
    private containerNumber: number = 0;
    private actualRound: number = 0;
    private endRound: number = 0;

    constructor(readonly root: Location, readonly vehicles: Vehicle[]) {
        this.containerNumber = root.getContainerNumber();
    }

    async move(): Promise<number> {
        on(AppEvent.END_TICK, () => this.round());

        process.nextTick(() => this.round());
        for await (const rounds of asyncOn(AppEvent.ARRIVED)) {
            this.containerNumber--;
            this.endRound = Math.max(this.endRound, rounds);
            if (this.containerNumber === 0) break;
        }
        removeAllListeners();
        return this.endRound;
    }

    private async round(): Promise<void> {
        const arrivedVehicle: Vehicle[] = [];
        this.actualRound++;
        process.nextTick(() => emit(AppEvent.TICK, this.actualRound));
        for await (const vehicle of asyncOn(AppEvent.END_RUN)) {
            arrivedVehicle.indexOf(vehicle) === -1 && arrivedVehicle.push(vehicle);
            if (arrivedVehicle.length >= this.vehicles.length) break;
        }
        removeAllListeners(AppEvent.END_RUN);
        emit(AppEvent.END_TICK);
    }
}
