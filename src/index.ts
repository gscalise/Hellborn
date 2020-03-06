import * as PIXI from 'pixi.js';

import Player from './actors/Player';
// import Enemy from './actors/Enemy';
// eslint-disable-next-line no-unused-vars
import Grid, { Quadrant } from './physics/Grid';
// import Menu from './interface/Menu.js';
import HealthBar from './interface/HUD';
import GameState from './stateManagement/GameState';
import Spawner from './actors/Spawner';
import Ground from './helpers/Ground';

// initialize application
const app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
	resolution: window.devicePixelRatio,
	resizeTo: window
});

const state = new GameState();

// let tick = 0;
function gameLoop(delta: unknown, player: Player, /*spawner: Spawner,*/ healthBar: HealthBar): void{
	if (!state.pause) {
		// console.log(delta);
		state.play();
		healthBar.monitor();
		// tick++;
	}
	else {
		// menu.manage();
	}
}

document.body.appendChild(app.view);

// load sprites
app.loader.add('player', 'assets/sprites/player.png');
app.loader.add('enemy', 'assets/sprites/enemy.png');
app.loader.add('ground', 'assets/sprites/ground.png');
app.loader.add('wall', 'assets/sprites/wall.png');
app.loader.add('bullet', 'assets/sprites/bullet.png');
app.loader.add('spawner', 'assets/sprites/spawner.png');

app.loader.load((/*loader: unknown, resources: unknown*/) => {
	// initialize camera and ground
	const groundSprite = PIXI.Sprite.from('ground');
	groundSprite.zIndex = 0;
	const ground = new Ground();
	
	ground.addChild(groundSprite);
	
	const camera = new PIXI.Container();
	camera.interactive = true;
	camera.addChild(ground);

	app.stage.addChild(camera);

	// initialize grid for collisions
	new Grid(ground, state);

	// initialize player and enemy
	const playerQuadrant: Quadrant = state.grid.quadrants[4][5];
	const player = new Player(app.screen, camera, ground, PIXI.Texture.from('player'), state, playerQuadrant, PIXI.Texture.from('bullet'));
	ground.addChild(player);

	const spawnerQuadrant1: Quadrant = state.grid.quadrants[4][2];
	new Spawner(ground, PIXI.Texture.from('enemy'), state, spawnerQuadrant1);
	const spawnerQuadrant2: Quadrant = state.grid.quadrants[7][2];
	new Spawner(ground, PIXI.Texture.from('enemy'), state, spawnerQuadrant2);
	const spawnerQuadrant3: Quadrant = state.grid.quadrants[7][8];
	new Spawner(ground, PIXI.Texture.from('enemy'), state, spawnerQuadrant3);
	// const enemy = new Enemy(ground, PIXI.Texture.from('enemy'), state, enemyQuadrant);
	// ground.addChild(enemy);

	// const wall = new Actor(PIXI.Texture.from('wall'), state, 'wall', {xIndex: 4, yIndex: 4});
	// ground.addChild(wall);
	
	// initialize interface
	const graphics = new PIXI.Graphics();
	const healthBar = new HealthBar(camera, graphics, state);
	// const menu = new Menu();
	state.ticker = app.ticker;
	app.ticker.add(delta => gameLoop(delta, player, /*spawner,*/ healthBar));
});

