import {Application} from '@pixi/app';
import {Renderer}  from '@pixi/core';
import {BatchRenderer} from '@pixi/core';
Renderer.registerPlugin('batch', BatchRenderer);
import {InteractionManager} from '@pixi/interaction';
Renderer.registerPlugin('interaction', InteractionManager);
import { AppLoaderPlugin } from '@pixi/loaders';
Application.registerPlugin(AppLoaderPlugin);
import {TickerPlugin} from '@pixi/ticker';
Application.registerPlugin(TickerPlugin);
import {Sprite} from '@pixi/sprite';

import { createStore } from 'redux';
import reducer from './reducers/reducer.js';
const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

import Player from './actors/Player.js';
import Enemy from './actors/Enemy.js';
let state = 'play';

//Create a Pixi Application
let app = new Application({
	width: window.innerWidth,
	height: window.innerHeight,
	resolution: window.devicePixelRatio
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.loader.add('player', 'assets/player.png');
app.loader.add('enemy', 'assets/enemy.png');

app.loader.load((loader, resources) => {
	app.stage.interactive = true;
	const player = new Player(app.stage, Sprite.from('player'), store);
	const enemy = new Enemy(app.stage, Sprite.from('enemy'), store);
	app.ticker.add(delta => gameLoop(delta, player, enemy));
});

function gameLoop(delta, player, enemy){
	if (state == 'play') {
		player.control(store);
		enemy.attack(store);
	}
}