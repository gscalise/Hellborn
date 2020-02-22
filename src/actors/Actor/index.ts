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

	constructor(texture: PIXI.Texture, state: GameState, type: string, quadrantIndex: quadrantIndex, ground: PIXI.Container) {
		super(texture);
		this.state = state;
		this.ground = ground;

		this.type = type;
		if (type == 'enemy') this.id = this.type + state.enemiesCount + 1;
		if (type == 'player') this.id = this.type + (state.playersCount + 1);
		if (type == 'bullet') this.id = this.type;

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
		this.collide = this.collide.bind(this);
		this.calculateDestination = this.calculateDestination.bind(this);
	}

	act(){}

	collide(withActor: Actor) {
		if (this.status.moving) {
			let newDirection;
			let newSpeed = this.speed;
			const PIFlooredToThree = MathHelper.floorToTwo(Math.PI);

			const horizontalDistanceToActor = this.x - withActor.x;
			const verticalDistanceToActor = this.y - withActor.y;
			let directionToActor = MathHelper.floorToTwo(Math.atan(verticalDistanceToActor/horizontalDistanceToActor));
			// if (this.x <= withActor.x) {
			// 	directionToActor = PIFlooredToThree + directionToActor;
			// } 

			const horizontalDistanceToDestination = this.x - this.destination.x;
			const verticalDistanceToDestination = this.y - this.destination.y;
			let directionToDestination = MathHelper.floorToTwo(Math.atan(verticalDistanceToDestination/horizontalDistanceToDestination));
			// if (this.x <= this.destination.x) {
			// 	directionToDestination = PIFlooredToThree + directionToDestination;
			// } 
			newDirection = directionToDestination;

			console.log(directionToDestination + '----' + directionToActor);
			if (directionToDestination !== directionToActor) {
			}
			else {
				newSpeed = 0;
			}
			if (this.speed > withActor.speed) {
			}
			if (this.speed < withActor.speed) {
				if (withActor.status.moving) {
					newSpeed = 0;
				}
			}
			this.calculateDestination(newDirection, newSpeed);
			console.log(newDirection);
		}
	}

	move() {
		this.x = this.destination.x;
		this.y = this.destination.y;
		this.state.moveActor(this);
	}

	calculateDestination(direction: number, speed: number) {
		let x = this.x + speed * Math.cos(direction);
		let y = this.y + speed * Math.sin(direction);
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
}