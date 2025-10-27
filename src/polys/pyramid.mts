import { Vector2, Vector3 } from "calc.mjs";
import { Polyhedron } from "./poly.mjs";
import { GameObject } from "../gameObject.mjs";

export interface PyramidImpl extends GameObject {
    length: number;
    height: number;
}

export class Pyramid extends Polyhedron {
    uuid = 'pyramid';

    edges = [
        [0, 1], [0, 2], [0, 3],
        [1, 2], [2, 3], [3, 1]
    ] as Vector2[];

    faces = [
        [1, 2, 3],
        [0, 1, 2],
        [0, 2, 3],
        [0, 1, 3],
    ]

    fillStyles = [
        'rgba(148, 148, 148, 1)',
        'rgba(107, 107, 107, 1)',
        'rgba(110, 110, 110, 1)',
        'rgba(70, 70, 70, 1)',
    ]

    public create(
        position = [0, 15, 0] as Vector3,
        velocity = [0, 0, 0] as Vector3,
        length = 10,
        height = 8,
        thetaX = 0,
        thetaY = 0
    ): PyramidImpl {
        return {
            typeId: 'pyramid',
            position, thetaX, thetaY,
            velocity, length, height, uuid: crypto.randomUUID()
        };
    }

    public getRelativeVertices(pyramid: PyramidImpl): Vector3[] {
        const h = pyramid.height / 2;
        const d = pyramid.length / 2;
        return [
            [0, -h, 0],
            [0, 0, d],
            [-d, 0, 0],
            [d, 0, 0],
        ]
    }
}