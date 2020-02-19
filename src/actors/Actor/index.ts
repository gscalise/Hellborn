import { customstore } from '../../stateManagement/reducers/Reducer';
import { addActor, moveActor } from '../../stateManagement/actions/Action';
import { Sprite } from 'pixi.js';
import checkCollision from '../../physics/collisionCheck';

interface Status {
	moving: boolean;
	alive: boolean;
	attacking: boolean;
}

export default class Actor extends Sprite {
	health: number;
	type: string;
	id: string;
	attackReady: boolean;
	speed: number;
	store: customstore;
	status: Status;
	currentQuadrants: string[];
	hitBoxRadius: number;

	constructor(texture: PIXI.Texture, store: customstore, type: string, quadrantIndex: string) {
		super(texture);
		this.store = store;
		
		this.type = type;
		if (type == 'enemy') this.id = `${this.type}${this.store.getState().enemiesCount + 1}`;
		if (type == 'player') this.id = `${this.type}${this.store.getState().playersCount + 1}`;

		this.hitBoxRadius = Math.floor(Math.sqrt(this.height/2*this.height/2 + this.width/2*this.width/2));
		this.currentQuadrants = [];
		this.currentQuadrants.push(quadrantIndex);
		const i = parseInt(quadrantIndex.charAt(0), 10);
		const j = parseInt(quadrantIndex.charAt(1), 10);
		const quadrant = this.store.getState().grid.quadrants[i][j];
		const quadrantCenterX = (quadrant.x1 + quadrant.x2)/2;	
		const quadrantCenterY = (quadrant.y1 + quadrant.y2)/2;

		this.x = quadrantCenterX;
		this.y = quadrantCenterY;

		this.store.dispatch(addActor(this));

		this.status = {} as Status;
		this.status.alive = true;
		this.status.moving = false;
		this.status.attacking = false;
	}

	move (horizontalSpeed: number, verticalSpeed: number) {
		const isCollisionHappend = checkCollision(
			this.store.getState(), 
			this.x + horizontalSpeed, 
			this.y + verticalSpeed, 
			this);
		if (!isCollisionHappend) {
			this.x = this.x + horizontalSpeed;
			this.y = this.y + verticalSpeed;
			this.store.dispatch(moveActor(this));
		}
	}
	

}