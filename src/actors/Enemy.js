import {create} from '../actions/action.js';

export default class Enemy {
	constructor(stage, sprite, store) {
		this.sprite = sprite;
		this.sprite.x = 500;
		this.sprite.y = 500;
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.sprite.vx = 2;
		this.sprite.vy = 2;
		this.sprite.rotation = -(Math.PI/2);
		this.sprite.interactive = true;
		stage.addChild(this.sprite);
    
		store.dispatch(create({
			id: 'enemy',
			x: this.sprite.x,
			y: this.sprite.y
		}));

		this.attack = this.attack.bind(this);
	}

	attack(store){
		let state = store.getState();
		const playerX = state.player.x;
		const playerY = state.player.y;

		let angle = Math.atan((playerY - this.sprite.y)/(playerX - this.sprite.x));
		if (playerX <= this.sprite.x) {
			angle = Math.PI + angle;
		} 
		this.sprite.rotation = angle;

		this.sprite.x = this.sprite.x + this.sprite.vx * Math.cos(angle);
		this.sprite.y = this.sprite.y + this.sprite.vy * Math.sin(angle);
	}
}