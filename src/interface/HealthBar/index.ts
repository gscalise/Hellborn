import { Store } from "redux";

export default class HealthBar {
	graphics: PIXI.Graphics;
	store: Store;

	constructor(stage: PIXI.Container, graphics: PIXI.Graphics, store: Store) {
		this.graphics = graphics;
		this.store = store;
		stage.addChild(this.graphics);

		this.monitor = this.monitor.bind(this);
	}

	monitor() {
		const healthCount = this.store.getState().actors.player1.health;
		this.graphics.clear();
		this.graphics.beginFill(0xDE3249);
		this.graphics.drawRect(50, 50, 2 * healthCount, 20);
		this.graphics.endFill();
	}
}