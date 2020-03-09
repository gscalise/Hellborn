import {Container} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import HUD from '../interface/HUD';

export default class Camera extends Container {
	hud: HUD;
	constructor() {
		super();
	}
}