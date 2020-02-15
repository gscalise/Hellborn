import {createActor} from '../../actions/Action';
import { Store } from 'redux';
import Status from '../Status';

export default class Actor {
	health: number;
	type: string;
	id: string;
	attackReady: boolean;
	sprite: PIXI.Sprite;
	speed: number;
	store: Store;
	status: Status;

	constructor(stage: PIXI.Container, sprite: PIXI.Sprite, store: Store) {
		this.status = {} as Status;
		this.status.alive = true;
		this.status.moving = false;
		this.status.attacking = false;
	}
}