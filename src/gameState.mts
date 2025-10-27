import type { GameObject } from "./gameObject.mjs";
import { PyramidImpl } from "./polys/pyramid.mjs";

interface State {
    gameOver: boolean
}

interface GameState {
    state: State;
    objects: GameObject[];
    player: PyramidImpl | null;
}

const GameState: GameState = {
    objects: [],
    player: null,
    state: {
        gameOver: false
    }
}

export default GameState;

// {
//         type: 'pyramid',
//         uuid: crypto.randomUUID(),
//         position: [0, yplane,-40],
//         thetaX: 0,
//         thetaY: 0,
//         velocity: [0, 0, 0],
//         length: 20,
//         height: 10,
//     }