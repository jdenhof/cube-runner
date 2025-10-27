import { project3D } from "calc";
import { GameObject } from "gameObject";
import GameState from "gameState";
import RenderEngine from "renderEngine";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

function drawObject(obj: GameObject) {
    const poly = RenderEngine.polyRegistry.get(obj.typeId);
    const rendered = RenderEngine.get(obj.uuid);
    const vertices2d = rendered.vertices.map(project3D);
    const fillStyles = poly.fillStyles ?? [];
    poly.faces.forEach((face, faceIdx) => {
        ctx.beginPath();
        ctx.moveTo(vertices2d[face[0]!]![0], vertices2d[face[0]!]![1]);
        face.slice(1).forEach(e => ctx.lineTo(vertices2d[e]![0], vertices2d[e]![1]));
        ctx.closePath();
        ctx.fillStyle = fillStyles[faceIdx] ?? 'rgba(0, 0, 0, 0)';
        ctx.fill()
        ctx.stroke();
    });
}

export default function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    GameState.objects.forEach(drawObject);
    if (GameState.player) {
        drawObject(GameState.player);
    }
}
