import draw from 'draw';
import GameState from 'gameState'
import PolyRegistryImpl from 'polyRegistry';
import RenderEngine from 'renderEngine';
import update from 'update';

document.addEventListener('keydown', function(event) {
    if (!GameState.player) return;
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
    if (!GameState.player) return;
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
    const obj = PolyRegistryImpl.get('cube').create();
    obj.position[0] = Math.random()*(canvas.width*2+1) - canvas.width;
    GameState.objects.push(obj);
};

function gameLoop() {
    RenderEngine.render();
    update();
    if (GameState.state.gameOver) {
        console.log("Game Over!!!");
        return;
    }
    draw();
    window.requestAnimationFrame(gameLoop);
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


setInterval(spawnObject, canvas.width / 10)

window.requestAnimationFrame(gameLoop);