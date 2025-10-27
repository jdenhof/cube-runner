import { cross, dot, elementWiseMinMax, normalize, rowWiseMinMax, sub, Vector2, Vector3 } from "calc";
import { GameObject } from "gameObject";
import RenderEngine from "renderEngine";

export function doPolyhedraIntersect(obj1: GameObject, obj2: GameObject) {
    const obj1Vertices = RenderEngine.get(obj1.uuid).vertices;
    const obj2Vertices = RenderEngine.get(obj1.uuid).vertices;
    if (!aabbIntersect(obj1Vertices, obj2Vertices)) {
        return false;
    }

    const axes: Vector3[] = [];
    const polyRegistry1 = RenderEngine.polyRegistry.get(obj1.typeId);
    const polyRegistry2 = RenderEngine.polyRegistry.get(obj1.typeId);
    polyRegistry1.faces.forEach(
        face => axes.push(faceNormal(face, obj1Vertices)));
    polyRegistry2.faces.forEach(
        face => axes.push(faceNormal(face, obj2Vertices)));

    polyRegistry1.edges.forEach(edge1 => {
        polyRegistry2.edges.forEach(edge2 => {
            axes.push(cross(edgeDirection(edge1, obj1Vertices), edgeDirection(edge2, obj2Vertices)))
        })
    })

    axes.forEach(axis => {
        const proj1 = projectVertices(obj1Vertices, axis)
        const proj2 = projectVertices(obj2Vertices, axis)
        if (!intervalsOverlap(proj1.min, proj1.max, proj2.min, proj2.max))
            return false;
    });
    return true;
}

function aabbIntersect(vertices1: Vector3[], vertices2: Vector3[]) {
    const mm1 = rowWiseMinMax(vertices1);
    const mm2 = rowWiseMinMax(vertices2);
    return (
        mm1[0]!.min <= mm2[0]!.max && mm1[0]!.max >= mm2[0]!.min
        && mm1[1]!.min <= mm2[1]!.max && mm1[1]!.max >= mm2[1]!.min
        && mm1[2]!.min <= mm2[2]!.max && mm1[2]!.max >= mm2[2]!.min
    )
}

function faceNormal(face: number[], vertices: Vector3[]) {
    const normal: Vector3 = [0, 0, 0]
    for (let i=0; i < face.length; i++) {
        const curr = vertices[face[i]!]!;
        const next = vertices[face[(i+1) % face.length]!]!;
        normal[0] += (curr[1] - next[1]) * (curr[2] + next[2]);
        normal[1] += (curr[2] - next[2]) * (curr[0] + next[0]);
        normal[2] += (curr[0] - next[0]) * (curr[1] + next[1]);
    }
    return normalize(normal);
}

function projectVertices(vertices: Vector3[], axis: Vector3) {
    axis = normalize(axis)
    return elementWiseMinMax(vertices.map(vertex => dot(vertex, axis)));
}

function intervalsOverlap(min1: number, max1: number, min2: number, max2: number) {
    const epsilon = 1e-6;
    return min1 <= max2 + epsilon && min2 <= max1 + epsilon;
}

function edgeDirection(edge: Vector2, vertices: Vector3[]) {
    const [v1, v2] = edge.map(v => vertices[v]);
    if (!v1 || !v2) throw new Error("Edge node isn't in vertices index.")
    return sub(v2, v1);
}