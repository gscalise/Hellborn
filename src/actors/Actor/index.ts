import { Sprite, Point } from 'pixi.js';
import GameState from '../../stateManagement/GameState';
import MathHelper from '../../helpers/MathHelper';

interface Status {
	moving: boolean;
	alive: boolean;
	attacking: boolean;
}

export interface quadrantIndex {
	xIndex: number;
	yIndex: number
}

export default class Actor extends Sprite {
	health: number;
	type: string;
	id: string;
	attackReady: boolean;
	speed: number;
	state: GameState;
	status: Status;
	currentQuadrants: quadrantIndex[];
	hitBoxRadius: number;
	isObstacle: boolean;
	destination: PIXI.Point;
	ground: PIXI.Container;
	strength: number;
	movable: boolean;

	constructor(texture: PIXI.Texture, state: GameState, type: string, quadrantIndex: quadrantIndex, ground: PIXI.Container) {
		super(texture);
		this.state = state;
		this.ground = ground;

		this.type = type;
		if (type == 'enemy') this.id = this.type + (state.enemiesCount + 1);
		if (type == 'player') this.id = this.type + (state.playersCount + 1);
		if (type == 'projectile') this.id = this.type + (state.projectilesCount + 1);

		this.hitBoxRadius = Math.floor(Math.sqrt(this.height/2*this.height/2 + this.width/2*this.width/2));
		this.currentQuadrants = [];
		this.currentQuadrants.push(quadrantIndex);
		let actorCenterX;
		let actorCentery;

		const quadrant = state.grid.quadrants[quadrantIndex.xIndex][quadrantIndex.yIndex];
		actorCenterX = (quadrant.x1 + quadrant.x2)/2;	
		actorCentery = (quadrant.y1 + quadrant.y2)/2;

		this.x = actorCenterX;
		this.y = actorCentery;
		this.destination = new Point(this.x, this.y);

		this.status = {} as Status;
		this.status.alive = true;
		this.status.moving = false;
		this.status.attacking = false;

		this.isObstacle = true;
		this.state.addActor(this);

		this.move = this.move.bind(this);
		this.calculateDestination = this.calculateDestination.bind(this);
	}

	move() {
		this.x = this.destination.x;
		this.y = this.destination.y;
		this.state.moveActor(this);
	}

	calculateDestination(direction: number) {
		let x = this.x + this.speed * Math.cos(direction);
		let y = this.y + this.speed * Math.sin(direction);
		if (x <= 0) {
			x = this.hitBoxRadius;
		}
		if (x >= this.ground.width) {
			x = this.ground.width - this.hitBoxRadius;
		}
		if (y <= 0) {
			y = this.hitBoxRadius;
		}
		if (y >= this.ground.height) {
			x = this.ground.height - this.hitBoxRadius;
		}
		this.destination.x = x;
		this.destination.y = y;
	}

	reduceHealth(damage: number) {
		this.health = this.health - damage;
	}
	prepare() {}
	act(){}
	hit(actor: Actor){}
	
}