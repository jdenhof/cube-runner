import { Polyhedron } from "polys/poly";
import Registry from "registry";

export class PolyRegistry extends Registry<Polyhedron> {}
const PolyRegistryImpl: PolyRegistry = new PolyRegistry();
export default PolyRegistryImpl;


// const ShapeRegistryS: ShapPolyRegistryeRegistry = {
//     'cube': {
//         id: 'cube',
//         verticesFn: obj => getCubeRelativeVertices(obj as Cube),
//         edges: [
//             [0, 1], [1, 3], [3, 2], [2, 0], // Front face
//             [4, 5], [5, 7], [7, 6], [6, 4], // Back face
//             [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
//         ],
//         faces: [
//             [0, 1, 3, 2], // Front
//             [4, 5, 7, 6], // Back
//             [0, 1, 5, 4], // Top
//             [2, 3, 7, 6], // Bottom
//             [0, 2, 6, 4], // Left
//             [1, 3, 7, 5]  // Right
//         ],
//         create: (
//             position = [0, yplane, 300] as Vector3,
//             velocity = [0, 0, 0] as Vector3,
//             length = 10,
//             thetaX = 0,
//             thetaY = 0
//         ) => ({
//             type: 'cube',
//             position, thetaX, thetaY,
//             velocity, length, uuid: crypto.randomUUID()
//         }),
//         fillStyles: [
//             'red',
//             'blue',
//             'orange',
//             'orange',
//             'orange',
//             'orange',
//         ]
//     },
//     'pyramid': {
//         id: 'pyramid',
//         verticesFn: _ => getPlayerRelativeVertices(),
//         edges: [
//             [0, 1], [0, 2], [0, 3],
//             [1, 2], [2, 3], [3, 1]
//         ],
//         faces: [
//             [1, 2, 3],
//             [0, 1, 2],
//             [0, 2, 3],
//             [0, 1, 3],
//         ],
//         fillStyles: [
//             'rgba(148, 148, 148, 1)',
//             'rgba(107, 107, 107, 1)',
//             'rgba(110, 110, 110, 1)',
//             'rgba(70, 70, 70, 1)',
//         ]
//     }
// }
