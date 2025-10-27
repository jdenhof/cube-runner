import { add } from "calc";
import RenderEngine from 'renderEngine';
import GameState from "gameState";
import { doPolyhedraIntersect } from "collision";
import { GameObject } from "gameObject";

function removeObject(obj: GameObject, idx?: number) {
    RenderEngine.unregister(RenderEngine.get(obj.uuid));
    idx ??= GameState.objects.findIndex(x => x.uuid === obj.uuid);
    if (idx < 0) {
        throw new Error("Could not find object to remove!");
    }
    GameState.objects.splice(idx, 1);
}

export default function update() {
    if (GameState.player) {
        GameState.player.position = add(GameState.player.position, GameState.player.velocity);
    }
    for (let i=GameState.objects.length-1; i >= 0; i--) {
        const obj = GameState.objects[i];
        if (!obj?.position) throw new Error("Object found with no position");
        obj.position[2] -= 1;
        RenderEngine.get(obj.uuid).vertices = RenderEngine.getPolyhedronVertices(obj);
        if (GameState.player && doPolyhedraIntersect(GameState.player, obj)) {
            console.log("Game Over!!!");
            GameState.state.gameOver = true;
        }
        if (obj.position[2] < -69) {
            removeObject(obj, i);
        }
    };
}