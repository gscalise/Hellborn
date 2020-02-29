// eslint-disable-next-line no-unused-vars
import Actor from '../Actor';
// eslint-disable-next-line no-unused-vars
import GameState from '../../stateManagement/GameState';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../../physics/Grid';

export default class Projectile extends Actor {
	direction: number;

	constructor(texture: PIXI.Texture, state: GameState, type: string, quadrant: Quadrant, ground: PIXI.Container, shooter: Actor) {
		super(texture, state, type, quadrant, ground);
		this.type = 'projectile';
		const shooterFaceCenterX = shooter.x + shooter.hitBoxRadius * Math.cos(shooter.rotation);
		const shooterFaceCenterY = shooter.y + shooter.hitBoxRadius * Math.sin(shooter.rotation);
		this.x = shooterFaceCenterX;
		this.y = shooterFaceCenterY; 
		this.speed = 10;
		this.status.moving = true;
		this.direction = shooter.rotation;
		this.movable = false;

		this.hit = this.hit.bind(this);
	}
	prepare() {
		this.calculateDestination(this.direction);
	}

	act() {
		this.move();
	}

	hit(actor: Actor) {
		actor.reduceHealth(10);
		// delete this.state.actors[this.id];
		this.speed = 0;
		this.status.alive = false;
		this.ground.removeChild(this);

		// this.currentQuadrants.forEach((quadrantIndex) => {
		// 	const quadrant = this.state.grid.quadrants[quadrantIndex.xIndex][quadrantIndex.yIndex];
		// 	this.state.grid.removeActorFromQuadrant(quadrant, this, quadrantIndex);
		// });
	}
}