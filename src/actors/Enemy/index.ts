import {addActor} from '../../stateManagement/actions/Action';
import Actor from '../Actor';
import { Store } from 'redux';
import Player from '../Player';

export default class Enemy extends Actor {
	constructor(stage: PIXI.Container, sprite: PIXI.Sprite, store: Store, quadrant: number) {
		const type = 'enemy';
		super(stage, sprite, store, type);

		this.attackReady = true;

		this.sprite.zIndex = 1;
		this.sprite.x = 500;
		this.sprite.y = 500;
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.speed = 2;
		this.sprite.rotation = -(Math.PI/2);
		this.sprite.interactive = true;
		stage.addChild(this.sprite);
    
		// store.dispatch(createActor(this));

		this.attack = this.attack.bind(this);
		this.followPlayer = this.followPlayer.bind(this);
	}

	followPlayer(store: Store): void {
		const state = store.getState();
		const player = state.actors.player1;
		// temporarily set as player1 cause there's no multiplayer yet
		const playerX = player.sprite.x;
		const playerY = player.sprite.y;
		const verticalDistance = playerY - this.sprite.y;
		const horizontalDistance = playerX - this.sprite.x;
		let angle = Math.atan(verticalDistance/(horizontalDistance));
		if (playerX <= this.sprite.x) {
			angle = Math.PI + angle;
		} 
		this.sprite.rotation = angle;

		this.sprite.x = this.sprite.x + this.speed * Math.cos(angle);
		this.sprite.y = this.sprite.y + this.speed * Math.sin(angle);

		const distance = Math.sqrt(verticalDistance*verticalDistance + horizontalDistance*horizontalDistance);
		if (distance < 50 && this.attackReady) {
			this.attack(player);
		}
	}

	attack(player: Player): void {
		player.health = player.health - 10;
		this.attackReady = false;
		setTimeout(() => {this.attackReady = true;}, 1000);
	}
}