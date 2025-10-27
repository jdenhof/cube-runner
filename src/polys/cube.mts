import { Vector2, Vector3 } from "../calc.mjs";
import { Polyhedron } from "./poly.mjs";
import { GameObject } from "../gameObject.mjs";

export interface CubeImpl extends GameObject {
    length: number
}

export class Cube extends Polyhedron {
    uuid = 'cube';

    edges = [
        [0, 1], [1, 3], [3, 2], [2, 0], // Front face
        [4, 5], [5, 7], [7, 6], [6, 4], // Back face
        [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
    ] as Vector2[];

    faces = [
        [0, 1, 3, 2], // Front
        [4, 5, 7, 6], // Back
        [0, 1, 5, 4], // Top
        [2, 3, 7, 6], // Bottom
        [0, 2, 6, 4], // Left
        [1, 3, 7, 5]  // Right
    ];

    fillStyles = [
        'red',
        'blue',
        'orange',
        'orange',
        'orange',
        'orange',
    ]

    public create(
        position = [0, 15, 300] as Vector3,
        velocity = [0, 0, 0] as Vector3,
        length = 10,
        thetaX = 0,
        thetaY = 0
    ): CubeImpl {
        return {
            typeId: 'cube',
            position, thetaX, thetaY,
            velocity, length, uuid: crypto.randomUUID()
        };
    }

    public getRelativeVertices(cube: CubeImpl): Vector3[] {
        const l = cube.length / 2;
        return [
            [l, l, l],
            [-l, l, l],
            [l, -l, l],
            [-l, -l, l],
            [l, l, -l],
            [-l, l, -l],
            [l, -l, -l],
            [-l, -l, -l],
        ];
    }
}