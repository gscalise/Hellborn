import * as PIXI from 'pixi.js';


// initialize store for state management
import { createStore, StoreEnhancer } from 'redux';
import reducer, { customstore } from './stateManagement/reducers/Reducer';
interface WindowWithReduxTools {
	__REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer<customstore, unknown>;
}
const store: customstore = createStore(
	reducer,
	// (window as unknown as WindowWithReduxTools).__REDUX_DEVTOOLS_EXTENSION__ && 
	(window as unknown as WindowWithReduxTools).__REDUX_DEVTOOLS_EXTENSION__()
);

import Player from './actors/Player';
import Enemy from './actors/Enemy';
import Grid from './physics/Grid';
// import Menu from './interface/Menu.js';
import HealthBar from './interface/HealthBar';

// initialize application
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

document.body.appendChild(app.view);

// load sprites
app.loader.add('player', 'assets/player.png');
app.loader.add('enemy', 'assets/enemy.png');
app.loader.add('ground', 'assets/ground.png');

app.loader.load((loader: unknown, resources: unknown) => {
	// initialize camera and ground
	const groundSprite = PIXI.Sprite.from('ground');
	groundSprite.zIndex = 0;
	const ground = new PIXI.Container();
	ground.interactive = true;
	ground.addChild(groundSprite);
	
	const camera = new PIXI.Container();
	camera.interactive = true;
	camera.addChild(ground);

	app.stage.addChild(camera);

	// initialize grid for collisions
	const grid = new Grid(ground, store);

	// initialize player and enemy
	const player = new Player(app.screen, camera, ground, PIXI.Texture.from('player'), store, '45');
	ground.addChild(player);
	const enemy = new Enemy(ground, PIXI.Texture.from('enemy'), store, '42');
	ground.addChild(enemy);
	
	// initialize interface
	const graphics = new PIXI.Graphics();
	const healthBar = new HealthBar(camera, graphics, store);
	// const menu = new Menu();

	app.ticker.add(delta => gameLoop(delta, player, enemy, healthBar));
});

