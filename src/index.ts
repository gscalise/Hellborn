import * as PIXI from 'pixi.js';

import Player from './actors/Player';
import Enemy from './actors/Enemy';
import Grid from './physics/Grid';
// import Menu from './interface/Menu.js';
import HealthBar from './interface/HealthBar';
import GameState from './stateManagement/GameState';

// initialize application
const app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
	resolution: window.devicePixelRatio,
	resizeTo: window
});

const state = new GameState();

let tick = 0;
function gameLoop(delta: unknown, player: Player, enemy: Enemy, healthBar: HealthBar): void{
	if (!state.pause) {
		healthBar.monitor();
		state.play();
		tick++;
	}
	else {
		// menu.manage();
	}
}

document.body.appendChild(app.view);

// load sprites
app.loader.add('player', 'assets/player.png');
app.loader.add('enemy', 'assets/enemy.png');
app.loader.add('ground', 'assets/ground.png');
app.loader.add('wall', 'assets/wall.png');
app.loader.add('bullet', 'assets/bullet.png');

app.loader.load((loader: unknown, resources: unknown) => {
	// initialize camera and ground
	const groundSprite = PIXI.Sprite.from('ground');
	groundSprite.zIndex = 0;
	const ground = new PIXI.Container();
	ground.addChild(groundSprite);
	
	const camera = new PIXI.Container();
	camera.interactive = true;
	camera.addChild(ground);

	app.stage.addChild(camera);

	// initialize grid for collisions
	const grid = new Grid(ground, state);

	// initialize player and enemy
	const player = new Player(app.screen, camera, ground, PIXI.Texture.from('player'), state, {xIndex: 4, yIndex: 5}, PIXI.Texture.from('bullet'));
	ground.addChild(player);
	const enemy = new Enemy(ground, PIXI.Texture.from('enemy'), state, {xIndex: 4, yIndex: 2});
	ground.addChild(enemy);
	// const anotherEnemy = new Enemy(ground, PIXI.Texture.from('enemy'), state, {xIndex: 5, yIndex: 7});
	// ground.addChild(anotherEnemy);
	// const wall = new Actor(PIXI.Texture.from('wall'), state, 'wall', {xIndex: 4, yIndex: 4});
	// ground.addChild(wall);
	
	// initialize interface
	const graphics = new PIXI.Graphics();
	const healthBar = new HealthBar(camera, graphics, state);
	// const menu = new Menu();

	app.ticker.add(delta => gameLoop(delta, player, enemy, healthBar));
});

