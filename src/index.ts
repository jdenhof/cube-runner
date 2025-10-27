import type { Vector2, Vector3 } from './calc.ts'
import * as Alg from './calc.js'

function doPolyhedraIntersect(obj1: GameObject, obj2: GameObject) {
    const obj1Vertices = RenderEngine[obj1.uuid]!.vertices;
    const obj2Vertices = RenderEngine[obj2.uuid]!.vertices;
    if (!aabbIntersect(obj1Vertices, obj2Vertices)) {
        return false;
    }

    const axes: Vector3[] = [];

    ShapeRegistry[obj1.type]!.faces.forEach(face => axes.push(faceNormal(face, obj1Vertices)));
    ShapeRegistry[obj2.type]!.faces.forEach(face => axes.push(faceNormal(face, obj2Vertices)));

    ShapeRegistry[obj1.type]!.edges.forEach(edge1 => {
        ShapeRegistry[obj2.type]!.edges.forEach(edge2 => {
            axes.push(Alg.cross(edgeDirection(edge1, obj1Vertices), edgeDirection(edge2, obj2Vertices)))
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
    const mm1 = Alg.rowWiseMinMax(vertices1);
    const mm2 = Alg.rowWiseMinMax(vertices2);
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
    return Alg.normalize(normal);
}

function projectVertices(vertices: Vector3[], axis: Vector3) {
    axis = Alg.normalize(axis)
    return Alg.elementWiseMinMax(vertices.map(vertex => Alg.dot(vertex, axis)));
}

function intervalsOverlap(min1: number, max1: number, min2: number, max2: number) {
    const epsilon = 1e-6;
    return min1 <= max2 + epsilon && min2 <= max1 + epsilon;
}

function edgeDirection(edge: Vector2, vertices: Vector3[]) {
    const [v1, v2] = edge.map(v => vertices[v]);
    if (!v1 || !v2) throw new Error("Edge node isn't in vertices index.")
    return Alg.sub(v2, v1);
}

type RegisteredShape = {
    id: string;
    verticesFn: (obj: GameObject) => Vector3[];
    edges: Vector2[];
    faces: number[][];
    fillStyles?: string[];
    create?: () => GameObject;
}

type ShapeRegistry = {
    [key: string]: RegisteredShape
}

type GameObject = {
    type: string;
    uuid: string;
    position: Vector3;
    velocity: Vector3;
    thetaX: number;
    thetaY: number;
}

interface Cube extends GameObject {
    length: number;
}

interface Pyramid extends GameObject {
    length: number;
    height: number;
}

interface GameState {
    isGameOver: boolean;
    objects: GameObject[];
    player: Pyramid;
}

interface RenderObject {
    type: string;
    uuid: string;
    vertices: Vector3[];
}

interface RenderEngine {[key: string]: RenderObject | undefined}

const RenderEngine: RenderEngine = {}

const yplane = 15;

const GameState: GameState = {
    objects: [],
    player: {
        type: 'pyramid',
        uuid: crypto.randomUUID(),
        position: [0, yplane,-40],
        thetaX: 0,
        thetaY: 0,
        velocity: [0, 0, 0],
        length: 20,
        height: 10,
    },
    isGameOver: false
}

const ShapeRegistry: ShapeRegistry = {
    'cube': {
        id: 'cube',
        verticesFn: obj => getCubeRelativeVertices(obj as Cube),
        edges: [
            [0, 1], [1, 3], [3, 2], [2, 0], // Front face
            [4, 5], [5, 7], [7, 6], [6, 4], // Back face
            [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
        ],
        faces: [
            [0, 1, 3, 2], // Front
            [4, 5, 7, 6], // Back
            [0, 1, 5, 4], // Top
            [2, 3, 7, 6], // Bottom
            [0, 2, 6, 4], // Left
            [1, 3, 7, 5]  // Right
        ],
        create: (
            position = [0, yplane, 300] as Vector3,
            velocity = [0, 0, 0] as Vector3,
            length = 10,
            thetaX = 0,
            thetaY = 0
        ) => ({
            type: 'cube',
            position, thetaX, thetaY,
            velocity, length, uuid: crypto.randomUUID()
        }),
        fillStyles: [
            'red',
            'blue',
            'orange',
            'orange',
            'orange',
            'orange',
        ]
    },
    'pyramid': {
        id: 'pyramid',
        verticesFn: _ => getPlayerRelativeVertices(),
        edges: [
            [0, 1], [0, 2], [0, 3],
            [1, 2], [2, 3], [3, 1]
        ],
        faces: [
            [1, 2, 3],
            [0, 1, 2],
            [0, 2, 3],
            [0, 1, 3],
        ],
        fillStyles: [
            'rgba(148, 148, 148, 1)',
            'rgba(107, 107, 107, 1)',
            'rgba(110, 110, 110, 1)',
            'rgba(70, 70, 70, 1)',
        ]
    }
}

function getCubeRelativeVertices(cube: Cube): Vector3[] {
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

function getPlayerRelativeVertices(): Vector3[] {
    const h = GameState.player.height / 2;
    const d = GameState.player.length / 2;
    return [
        [0, -h, 0],
        [0, 0, d],
        [-d, 0, 0],
        [d, 0, 0],
    ]
}

document.addEventListener('keydown', function(event) {
    let direction = 0;
    switch (event.key) {
        case('a'):
            direction -= 2;
        case('d'):
            direction += 1;
            event.preventDefault();
            GameState.player.velocity[0] = direction;
            break;
        case('w'):
            direction -= 2;
        case('s'):
            direction += 1;
            GameState.player.velocity[1] = direction;
            break;
        default:
            return;
    }

});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case('a'):
        case('d'):
            event.preventDefault();
            GameState.player.velocity[0] = 0;
            break;
        case('w'):
        case('s'):
            GameState.player.velocity[1] = 0;
            break;
        default:
            return;
    }
});

function spawnObject() {
    const obj = ShapeRegistry['cube']!.create!();
    obj.position[0] = Math.random()*(canvas.width*2+1) - canvas.width;
    GameState.objects.push(obj);
};

(document.getElementById('spawn-object') as HTMLButtonElement).addEventListener('click', e => spawnObject());

function getPolyhedronVertices(obj: GameObject, poly: RegisteredShape): Vector3[] {
    return poly.verticesFn(obj).map(vertex => {
        const rotated = Alg.rotatePoint(vertex, obj.thetaX, obj.thetaY);
        return Alg.add(obj.position, rotated);
    });
}

function drawPolygon(faces: number[][], vertices: Vector3[], fillStyles?: string[]) {
    const vertices2d = vertices.map(Alg.project3D)
    faces.forEach((face, faceIdx) => {
        ctx.beginPath();
        ctx.moveTo(vertices2d[face[0]!]![0], vertices2d[face[0]!]![1]);
        face.slice(1).forEach(e => ctx.lineTo(vertices2d[e]![0], vertices2d[e]![1]));
        ctx.closePath();
        ctx.fillStyle = (fillStyles ?? [])[faceIdx] ?? 'rgba(0, 0, 0, 0)';
        ctx.fill()
        ctx.stroke();
    });

}

function removeObject(obj: GameObject, idx?: number) {
    RenderEngine[obj.uuid] = undefined;
    idx ??= GameState.objects.findIndex(x => x.uuid === obj.uuid);
    if (idx < 0) {
        throw new Error("Could not find object to remove!");
    }
    GameState.objects.splice(idx, 1);
}

function renderObject(obj: GameObject) {
    const poly = ShapeRegistry[obj.type];
    if (!poly) {
        throw new Error(`Type: ${obj.type} is not a registered type.`)
    }
    RenderEngine[obj.uuid] = {
        type: obj.type,
        uuid: obj.uuid,
        vertices: getPolyhedronVertices(obj, poly)
    }
}

function render() {
    [GameState.player, ...GameState.objects].map(renderObject);
}

function update() {
    // console.log(GameState.player.position)
    // console.log(GameState.objects[0]!.position)
    GameState.player.position = Alg.add(GameState.player.position, GameState.player.velocity);
    for (let i=GameState.objects.length-1; i >= 0; i--) {
        const obj = GameState.objects[i];
        if (!obj?.position) throw new Error("Object found with no position");
        obj.position[2] -= 1;
        RenderEngine[obj.uuid]!.vertices = getPolyhedronVertices(obj, ShapeRegistry[obj.type]!);
        if (doPolyhedraIntersect(GameState.player, obj)) {
            console.log("Game Over!!!");
            GameState.isGameOver = true;
        }
        if (obj.position[2] < -69) {
            removeObject(obj, i);
        }
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    GameState.objects.forEach(obj => {
        const poly = ShapeRegistry[obj.type]!;
        drawPolygon(poly.faces, RenderEngine[obj.uuid]!.vertices, poly.fillStyles);
    });
    const playerShape = ShapeRegistry[GameState.player.type]!;
    drawPolygon(playerShape.faces, RenderEngine[GameState.player.uuid]!.vertices, playerShape.fillStyles);
}

function gameSetup() {
    GameState.objects.push(ShapeRegistry['cube']!.create!());
}

function gameLoop() {
    render();
    update();
    if (GameState.isGameOver) {
        console.log("Game Over!!!");
        return;
    }
    draw();
    window.requestAnimationFrame(gameLoop);
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;
// const slider1 = (document.getElementById("player-height") as HTMLInputElement);
// slider1.addEventListener('change', function() {
//     GameState.player.height = parseInt(this.value);
// });
// const slider2 = (document.getElementById("player-width") as HTMLInputElement);
// slider2.addEventListener('change', function() {
//     GameState.player.length = parseInt(this.value);
// });

setInterval(spawnObject, canvas.width / 10)

gameSetup();
window.requestAnimationFrame(gameLoop);