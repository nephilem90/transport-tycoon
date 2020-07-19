import {EventEmitter, on as eventOn} from 'events';
import {AppEvent} from "./app.event";

class ServiceEvent {
    private static self: ServiceEvent;

    private constructor(readonly eventEmitter: EventEmitter) {
    }

    static get(): EventEmitter {
        ServiceEvent.self = ServiceEvent.self ?? new ServiceEvent(new EventEmitter());
        return ServiceEvent.self.eventEmitter;
    }
}

export function emit(event: AppEvent, ...args: any) {
    ServiceEvent.get().emit(event, ...args);
}

export function on(event: AppEvent, callback: (...args: any) => any) {
    ServiceEvent.get().on(event, (...args: any) => callback(...args));
}

export function removeAllListeners(event?: AppEvent) {
    !!event ? ServiceEvent.get().removeAllListeners(event) : ServiceEvent.get().removeAllListeners();
}

export function asyncOn(event: AppEvent): AsyncIterableIterator<any> {
    return eventOn(ServiceEvent.get(), event)[Symbol.asyncIterator]();
}
