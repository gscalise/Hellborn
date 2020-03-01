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
		this.speed = 25;
		this.status.moving = true;
		this.direction = shooter.rotation;
		this.movable = false;
		this.hitBoxRadius = 3;
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
		this.die();
	}
}