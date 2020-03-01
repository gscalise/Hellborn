// eslint-disable-next-line no-unused-vars
import Actor from '../Actor';
// eslint-disable-next-line no-unused-vars
import GameState from '../../stateManagement/GameState';
// eslint-disable-next-line no-unused-vars
import {Quadrant} from '../../physics/Grid';

export default class Enemy extends Actor {
	attackCooldown: number;
	attackReach: number;

	constructor(ground: PIXI.Container, texture: PIXI.Texture, state: GameState, quadrant: Quadrant) {
		const type = 'enemy';
		super(texture, state, type, quadrant, ground);

		this.attackReady = true;

		this.zIndex = 1;
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.speed = 3;
		this.rotation = -(Math.PI/2);

		this.hitBoxRadius = 28;
		this.attackReach = 50;
		this.strength = 80;
		this.health = 80;
		this.movable = true;

		this.attackCooldown = 0;
		this.attack = this.attack.bind(this);
		this.act = this.act.bind(this);
	}
	
	prepare() {
		if (this.health <= 0) {
			this.die();
		}
		else {
			if (this.attackCooldown > 0) {
				this.attackCooldown = this.attackCooldown - this.state.ticker.elapsedMS;
				if (this.attackCooldown <= 0) {
					this.attackReady = true;
				}
			}
			this.status.moving = true;
			this.speed = 3;
	
			const player = this.state.actors.player1;
			// temporarily set as player1 cause there's no multiplayer yet
			const playerX = player.x;
			const playerY = player.y;
			const verticalDistance = playerY - this.y;
			const horizontalDistance = playerX - this.x;
			let direction = Math.atan2(verticalDistance, horizontalDistance);
			this.rotation = direction;
	
			this.calculateDestination(direction);
			
			const quadDistance = verticalDistance*verticalDistance + horizontalDistance*horizontalDistance;
			if (quadDistance <= this.attackReach*this.attackReach + player.hitBoxRadius*player.hitBoxRadius && this.attackReady) {
				this.attack(player);
			}
		}
	}

	act(): void {
		this.move();
	}

	attack(player: Actor): void {
		player.reduceHealth(10);
		if (player.health <= 0) {
			this.state.pause = true;
		}
		this.attackReady = false;
		this.attackCooldown = 1000;
	}
}