import {Vehicle} from "./vehicle";
import {Sea} from "../route/sea.route";

export class Boat extends Vehicle {
    acceptedRoute: typeof Sea = Sea;
}
