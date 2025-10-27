import { Vector2, Vector3 } from "../calc.mjs";
import { GameObject } from "../gameObject.mjs";

export interface PolyhedronImpl extends Polyhedron {
    vertices: Vector3[];
}

export abstract class Polyhedron {
    abstract uuid: string;
    abstract edges: Vector2[];
    abstract faces: number[][];
    fillStyles?: string[];
    public abstract getRelativeVertices(obj: GameObject): Vector3[];
    public abstract create(): GameObject;
}