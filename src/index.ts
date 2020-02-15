import * as PIXI from 'pixi.js';

import { createStore, StoreCreator, Store } from 'redux';
import reducer from './reducers/Reducer';
const store: customstore = createStore(
	reducer
	// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
);

import Player from './actors/Player';
import Enemy from './actors/Enemy';
// import Grid from './physics/Grid.js';
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

interface Actors {
	[id: string]: Actor;
}

interface State {
	pause: boolean;
	enemiesCount: number;
	playersCount: number;
	actors: Actors;
}

interface customstore extends Store {
	getState: () => State;
}

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

app.loader.load((loader: unknown, resources: unknown) => {
	const graphics = new PIXI.Graphics();
	app.stage.interactive = true;
	// const grid = new Grid(store);
	const player = new Player(app.stage, PIXI.Sprite.from('player'), store);
	const enemy = new Enemy(app.stage, PIXI.Sprite.from('enemy'), store);
	const healthBar = new HealthBar(app.stage, graphics, store);
	// const menu = new Menu();
	app.ticker.add(delta => gameLoop(delta, player, enemy, healthBar));
});

