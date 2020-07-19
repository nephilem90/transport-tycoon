import {Land} from "../route/land.route";
import {Vehicle} from "./vehicle";

export class Truck extends Vehicle {
    acceptedRoute: typeof Land = Land;
}
