import Actor, {quadrantIndex} from '../Actor';
import Player from '../Player';
import GameState from '../../stateManagement/GameState';
import MathHelper from '../../helpers/MathHelper';

export default class Enemy extends Actor {
	constructor(ground: PIXI.Container, texture: PIXI.Texture, state: GameState, quadrantIndex: quadrantIndex) {
		const type = 'enemy';
		super(texture, state, type, quadrantIndex, ground);

		this.attackReady = true;

		this.zIndex = 1;
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.speed = 3;
		this.rotation = -(Math.PI/2);

		this.strength = 80;
		this.health = 80;
		this.movable = true;

		this.attack = this.attack.bind(this);
		this.act = this.act.bind(this);
	}
	
	prepare() {
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
		if (quadDistance <= this.hitBoxRadius*this.hitBoxRadius && this.attackReady) {
			// this.attack(player);
		}
		// if (this.health <= 0) {
		// 	this.ground.removeChild(this);

		// }
	}

	act(): void {
		this.move();
	}

	attack(player: Player): void {
		player.health = player.health - 10;
		if (player.health <= 0) {
			this.state.pause = true;
		}
		this.attackReady = false;
		setTimeout(() => {this.attackReady = true;}, 1000);
	}
}