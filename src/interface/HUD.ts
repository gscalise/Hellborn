// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import Player from '../actors/Player';

export default class HUD {
	graphics: PIXI.Graphics;
	state: Game;

	constructor(stage: PIXI.Container, graphics: PIXI.Graphics, state: Game) {
		this.graphics = graphics;
		this.state = state;
		stage.addChild(this.graphics);

		this.render = this.render.bind(this);
	}

	render() {
		const player = this.state.actors.player1 as Player;
		this.graphics.clear();
		this.graphics.beginFill(0x432828);
		this.graphics.drawRect(50, 50, 2 * player.maxHealth, 20);
		this.graphics.endFill();
		this.graphics.beginFill(0xDE3230);
		this.graphics.drawRect(50, 50, 2 * player.currentHealth, 20);
		this.graphics.endFill();

		this.graphics.beginFill(0x344543);
		this.graphics.drawRect(50, 85, 2 * player.maxStamina, 20);
		this.graphics.endFill();
		this.graphics.beginFill(0x33B149);
		this.graphics.drawRect(50, 85, 2 * player.currentStamina, 20);
		this.graphics.endFill();
	}
}