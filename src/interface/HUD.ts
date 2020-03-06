// eslint-disable-next-line no-unused-vars
import GameState from '../stateManagement/GameState';
// eslint-disable-next-line no-unused-vars
import Player from '../actors/Player';

export default class HealthBar {
	graphics: PIXI.Graphics;
	state: GameState;

	constructor(stage: PIXI.Container, graphics: PIXI.Graphics, state: GameState) {
		this.graphics = graphics;
		this.state = state;
		stage.addChild(this.graphics);

		this.monitor = this.monitor.bind(this);
	}

	monitor() {
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