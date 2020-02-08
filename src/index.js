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

import Player from './actors/Player.js';

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

app.loader.load((loader, resources) => {
	app.stage.interactive = true;
	const player = new Player(app.stage, Sprite.from('player'));
	// app.stage.addChild(player.sprite);
	// Sprite.from('player');
	// app.stage.addChild(player);
	// player.x = 100;
	// player.y = 100;
	// player.anchor.x = 0.5;
	// player.anchor.y = 0.5;
	// player.vx = 0;
	// player.vy = 0;
	// player.rotation = -(3*Math.PI/2);

	// document.addEventListener('keydown', handleKeyDown);
	// document.addEventListener('keyup', handleKeyUp);

	app.ticker.add(delta => gameLoop(delta, player));
});

// const keysDown = {
// 	w: false,
// 	d: false,
// 	s: false,
// 	a: false
// };

// function handleKeyDown(event) {
// 	if (event.code === 'KeyW') keysDown.w = true;
// 	if (event.code === 'KeyD') keysDown.d = true;
// 	if (event.code === 'KeyS') keysDown.s = true;
// 	if (event.code === 'KeyA') keysDown.a = true;
// }

// function handleKeyUp(event) {
// 	if (event.code === 'KeyW') keysDown.w = false;
// 	if (event.code === 'KeyD') keysDown.d = false;
// 	if (event.code === 'KeyS') keysDown.s = false;
// 	if (event.code === 'KeyA') keysDown.a = false;
// }

function gameLoop(delta, player){
	if (state == 'play') {
		player.control();
	}
}