import * as PIXI from 'pixi.js';

export default class Ground extends PIXI.Container {
	fixedWidth: number;
	fixedHeight: number;
	constructor() {
		super();
		this.fixedWidth = 3500;
		this.fixedHeight = 2000;
	}
}