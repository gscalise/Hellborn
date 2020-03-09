// eslint-disable-next-line no-unused-vars
import {Container, Rectangle, Text, Graphics} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';

export default class Menu extends Container {
	newGame: Container;
	game: Game;
	// newGame

	constructor(game: Game) {
		super();	
		this.game = game;
		this.newGame = new Container();
		this.newGame.addChild(new Text('New game'));
		this.addChild(this.newGame);
		this.newGame.interactive = true;
		this.newGame.on('click', this.game.pause.bind(this.game));
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
	}

	show() {
		this.x = this.game.screen.width/2;
		this.y = this.game.screen.height/2;
		this.game.camera.addChild(this);
	}

	hide() {
		this.game.camera.removeChild(this);
	}
}