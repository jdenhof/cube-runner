import { add } from "./calc.mjs";
import GameState from "./gameState.mjs";
import PolyRegistryImpl from "./polyRegistry.mjs";

export function createEntryWay(width: number, gap: number) {
    const positions = Array.from({length: width}).map((_, idx) => {
        let x = idx / (width / 2) > 1 ? -(idx % (width / 2)) : idx;
        x *= gap;
        const z = -1*Math.log(Math.pow(x, 2))*20;
        return [x, 10, z]
    });

    GameState.objects.push(...positions.map(([x, y, z]) => {
        const cube = PolyRegistryImpl.get('cube').create();
        cube.position = add([x!, y!, z!], [0, 0, 500]);
        return cube;
    }));
}

export default function init_world() {
    createEntryWay(100, 15);
}
