import {create, move} from '../actions/action.js';

export default class Player {
	constructor(stage, sprite, store) {
		this.sprite = sprite;
		this.sprite.x = 100;
		this.sprite.y = 100;
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.sprite.vx = 3;
		this.sprite.vy = 3;
		this.sprite.rotation = -(3*Math.PI/2);
		this.sprite.interactive = true;
		stage.addChild(this.sprite);

		// this.store = store;
		store.dispatch(create({
			id: 'player',
			x: this.sprite.x,
			y: this.sprite.y
		}));

		this.state = {
			moving: false
		};
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));
		stage.on('mousemove', this.handleMouseMove.bind(this));

		this.keysDown = {
			w: false,
			d: false,
			s: false,
			a: false
		};

		this.mouseCoords = {
			x: 500,
			y: 500
		};

		this.control = this.control.bind(this);
		this.controlMovement = this.controlMovement.bind(this);
	}

	control(store) {
		this.controlMovement(store);
		this.controlSight();
	}

	controlMovement(store) {
		let direction = 0;
		this.state.moving = false;
		if (this.keysDown.w) {
			this.state.moving = true;
			direction = -Math.PI/2;
		}
		if (this.keysDown.s) {
			if (!this.state.moving) {
				direction = Math.PI/2;
				this.state.moving = true;
			}
			else this.state.moving = false;
		}
		if (this.keysDown.d) {   
			direction = direction/2;
			this.state.moving = true;
		}
		if (this.keysDown.a) {
			if (direction == 0) {
				if (this.state.moving == true) this.state.moving = false;
				else {
					direction = Math.PI;
					this.state.moving= true;
				}
			}
			else if (direction > 0) {
				direction = (direction + Math.PI)/2;
				this.state.moving = true;
			}
			else {
				direction = (direction - Math.PI)/2;
				this.state.moving = true;
			}
		}

		if (this.state.moving) {
			this.sprite.x = this.sprite.x + this.sprite.vx * Math.cos(direction);
			this.sprite.y = this.sprite.y + this.sprite.vy * Math.sin(direction);
		}

		store.dispatch(move({
			id: 'player',
			x: this.sprite.x,
			y: this.sprite.y
		}));
	}

	controlSight() {
		let angle = Math.atan((this.mouseCoords.y - this.sprite.y)/(this.mouseCoords.x - this.sprite.x));
		if (this.mouseCoords.x <= this.sprite.x) {
			angle = Math.PI + angle;
		} 
		this.sprite.rotation = angle;
	}

	handleKeyDown(event) {
		if (event.code === 'KeyW') this.keysDown.w = true;
		if (event.code === 'KeyD') this.keysDown.d = true;
		if (event.code === 'KeyS') this.keysDown.s = true;
		if (event.code === 'KeyA') this.keysDown.a = true;
	}

	handleKeyUp(event) {
		if (event.code === 'KeyW') this.keysDown.w = false;
		if (event.code === 'KeyD') this.keysDown.d = false;
		if (event.code === 'KeyS') this.keysDown.s = false;
		if (event.code === 'KeyA') this.keysDown.a = false;
	}

	handleMouseMove(event) {
		this.mouseCoords.x = event.data.global.x;
		this.mouseCoords.y = event.data.global.y;
	}
}