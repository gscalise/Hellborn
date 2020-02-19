import {addActor, pause} from '../../stateManagement/actions/Action';
import Actor from '../Actor';
import { Store } from 'redux';
import Player from '../Player';

export default class Enemy extends Actor {
	constructor(ground: PIXI.Container, texture: PIXI.Texture, store: Store, quadrantIndex: string) {
		const type = 'enemy';
		super(texture, store, type, quadrantIndex);

		this.attackReady = true;

		this.zIndex = 1;
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.speed = 2;
		this.rotation = -(Math.PI/2);
		this.interactive = true;

		this.attack = this.attack.bind(this);
		this.followPlayer = this.followPlayer.bind(this);
	}

	followPlayer(store: Store): void {
		const state = store.getState();
		const player = state.actors.player1;
		// temporarily set as player1 cause there's no multiplayer yet
		const playerX = player.x;
		const playerY = player.y;
		const verticalDistance = playerY - this.y;
		const horizontalDistance = playerX - this.x;
		let angle = Math.atan(verticalDistance/(horizontalDistance));
		if (playerX < this.x) {
			angle = Math.PI + angle;
		} 
		this.rotation = angle;
		const horizontalSpeed = this.speed * Math.cos(angle);
		const verticalSpeed = this.speed * Math.sin(angle);
		this.move(horizontalSpeed, verticalSpeed);

		const distance = Math.sqrt(verticalDistance*verticalDistance + horizontalDistance*horizontalDistance);
		if (distance < 50 && this.attackReady) {
			// this.attack(player);
		}
	}

	attack(player: Player): void {
		player.health = player.health - 10;
		if (player.health <= 0) {
			this.store.dispatch(pause(true));
		}
		this.attackReady = false;
		setTimeout(() => {this.attackReady = true;}, 1000);
	}
}