import GameState from "../../stateManagement/GameState";

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
		const healthCount = this.state.actors.player1.health;
		this.graphics.clear();
		this.graphics.beginFill(0xDE3249);
		this.graphics.drawRect(50, 50, 2 * healthCount, 20);
		this.graphics.endFill();
	}
}