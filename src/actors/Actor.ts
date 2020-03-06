// eslint-disable-next-line no-unused-vars
import { Point, Container } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import GameState from '../stateManagement/GameState';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../physics/Grid';
// eslint-disable-next-line no-unused-vars
import Ground from '../helpers/Ground';

interface Status {
	moving: boolean;
	alive: boolean;
	attacking: boolean;
}

export default class Actor extends Container {
	id: string;
	type: string;

	maxHealth: number;
	currentHealth: number;

	status: Status;
	hitBoxRadius: number;
	strength: number;

	state: GameState;
	ground: Ground;
	attackReady: boolean;

	speed: number;
	currentQuadrants: Quadrant[];
	isObstacle: boolean;
	destination: PIXI.Point;
	movable: boolean;

	constructor(texture: PIXI.Texture, state: GameState, type: string, quadrant: Quadrant, ground: Ground) {
		super();
		
		this.state = state;
		this.ground = ground;

		this.type = type;
		if (type == 'enemy') this.id = this.type + (state.enemiesCount + 1);
		if (type == 'player') this.id = this.type + (state.playersCount + 1);
		if (type == 'projectile') this.id = this.type + (state.projectilesCount + 1);
		if (type == 'spawner') this.id = this.type + (state.spawnerCount + 1);

		// this.hitBoxRadius = Math.floor(Math.sqrt(this.height/2*this.height/2 + this.width/2*this.width/2));
		this.currentQuadrants = [];
		this.currentQuadrants.push(quadrant);
		let actorCenterX;
		let actorCentery;
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

	}

	calculateDestination(direction: number) {
		let x = this.x + this.speed * Math.cos(direction);
		let y = this.y + this.speed * Math.sin(direction);
		if (x - this.hitBoxRadius <= 0) {
			x = this.hitBoxRadius;
		}
		if (x + this.hitBoxRadius >= this.ground.fixedWidth) {
			x = this.ground.fixedWidth - this.hitBoxRadius;
		}
		if (y - this.hitBoxRadius <= 0) {
			y = this.hitBoxRadius;
		}
		if (y + this.hitBoxRadius >= this.ground.fixedHeight) {
			y = this.ground.fixedHeight - this.hitBoxRadius;
		}
		this.destination.x = x;
		this.destination.y = y;
		this.state.prepareToMoveActor(this);
	}

	reduceHealth(damage: number) {
		this.currentHealth = this.currentHealth - damage;
	}
	prepare() {}
	act(){}
	// eslint-disable-next-line no-unused-vars
	hit(actor: Actor){}
	
	die() {
		this.speed = 0;
		this.status.alive = false;
		this.ground.removeChild(this);
		for (let i = 0, quadrantCount = this.currentQuadrants.length; i < quadrantCount; i++) {
			const quadrant = this.currentQuadrants[i];
			quadrant.activeActors.splice(quadrant.activeActors.indexOf(this.id), 1);
		}
	}
}