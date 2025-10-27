import { type Vector3 } from "calc"

export type GameObject = {
    typeId: string;
    uuid: string;
    position: Vector3;
    velocity: Vector3;
    thetaX: number;
    thetaY: number;
}
