import * as PIXI from 'pixi.js';

import { createStore, StoreCreator, Store } from 'redux';
import reducer, { customstore } from './stateManagement/reducers/Reducer';
const store: customstore = createStore(
	reducer
	// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
);

import Player from './actors/Player';
import Enemy from './actors/Enemy';
import Grid from './physics/Grid';
// import Menu from './interface/Menu.js';
import HealthBar from './interface/HealthBar';
import Actor from './actors/Actor';

//Create a Pixi Application
const app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
	resolution: window.devicePixelRatio,
	resizeTo: window
});

function gameLoop(delta: unknown, player: Player, enemy: Enemy, healthBar: HealthBar): void{
	if (!store.getState().pause) {
		player.control();
		enemy.followPlayer(store);
		healthBar.monitor();
	}
	else {
		// menu.manage();
	}
}

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.loader.add('player', 'assets/player.png');
app.loader.add('enemy', 'assets/enemy.png');
app.loader.add('ground', 'assets/ground.png');

app.loader.load((loader: unknown, resources: unknown) => {

	const camera = new PIXI.Container();
	camera.interactive = true;
	const ground = new PIXI.Container();
	ground.interactive = true;
	const groundSprite = PIXI.Sprite.from('ground');
	groundSprite.zIndex = 0;
	ground.addChild(groundSprite);
	camera.addChild(ground);
	app.stage.addChild(camera);

	const grid = new Grid(ground, store);
	const player = new Player(app.screen, camera, ground, PIXI.Sprite.from('player'), store, 23);
	const enemy = new Enemy(ground, PIXI.Sprite.from('enemy'), store, 57);
	
	const graphics = new PIXI.Graphics();
	const healthBar = new HealthBar(camera, graphics, store);
	// const menu = new Menu();
	app.ticker.add(delta => gameLoop(delta, player, enemy, healthBar));
});

