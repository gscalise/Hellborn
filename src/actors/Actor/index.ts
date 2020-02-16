import Status from '../Status';
import { customstore } from '../../stateManagement/reducers/Reducer';
import { addActor } from '../../stateManagement/actions/Action';

export default class Actor {
	health: number;
	type: string;
	id: string;
	attackReady: boolean;
	sprite: PIXI.Sprite;
	speed: number;
	store: customstore;
	status: Status;
	currentQuadrants: number[]

	constructor(stage: PIXI.Container, sprite: PIXI.Sprite, store: customstore, type: string) {
		this.store = store;
		
		this.type = type;
		if (type == 'enemy') this.id = `${this.type}${this.store.getState().enemiesCount + 1}`;
		if (type == 'player') this.id = `${this.type}${this.store.getState().playersCount + 1}`;
		this.store.dispatch(addActor(this));

		this.status = {} as Status;
		this.status.alive = true;
		this.status.moving = false;
		this.status.attacking = false;

		this.sprite = sprite;
	}
}