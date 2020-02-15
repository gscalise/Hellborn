import {createActor, /*move,*/ pause} from '../../actions/Action';
import Actor from '../Actor';
import { Store } from 'redux';

interface keysDown {
	w: boolean;
	d: boolean;
	s: boolean;
	a: boolean;
}

interface mouseCoords {
	x: number;
	y: number;
}

export default class Player extends Actor {
	keysDown: keysDown;
	mouseCoords: mouseCoords;

	constructor(stage: PIXI.Container, sprite: PIXI.Sprite, store: Store) {
		super(stage, sprite, store);
		this.type = 'player';
		this.id = `${this.type}${store.getState().playersCount + 1}`;

		store.dispatch(createActor(this));
		
		this.store = store;
		this.sprite = sprite;
		this.sprite.x = 100;
		this.sprite.y = 100;
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.speed = 3;
		this.sprite.rotation = -(3*Math.PI/2);
		this.sprite.interactive = true;
		stage.addChild(this.sprite);

		this.health = 100;

		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));
		document.addEventListener('keydown', this.handleKeyPress.bind(this));
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

	control() {
		this.controlMovement();
		this.controlSight();
	}

	controlMovement() {
		let direction = 0;
		this.status.moving = false;
		if (this.keysDown.w) {
			this.status.moving = true;
			direction = -Math.PI/2;
		}
		if (this.keysDown.s) {
			if (!this.status.moving) {
				direction = Math.PI/2;
				this.status.moving = true;
			}
			else this.status.moving = false;
		}
		if (this.keysDown.d) {   
			direction = direction/2;
			this.status.moving = true;
		}
		if (this.keysDown.a) {
			if (direction == 0) {
				if (this.status.moving == true) this.status.moving = false;
				else {
					direction = Math.PI;
					this.status.moving= true;
				}
			}
			else if (direction > 0) {
				direction = (direction + Math.PI)/2;
				this.status.moving = true;
			}
			else {
				direction = (direction - Math.PI)/2;
				this.status.moving = true;
			}
		}

		if (this.status.moving) {
			this.sprite.x = this.sprite.x + this.speed * Math.cos(direction);
			this.sprite.y = this.sprite.y + this.speed * Math.sin(direction);
		}

		// this.store.dispatch(move(this));
	}

	controlSight() {
		let angle = Math.atan((this.mouseCoords.y - this.sprite.y)/(this.mouseCoords.x - this.sprite.x));
		if (this.mouseCoords.x <= this.sprite.x) {
			angle = Math.PI + angle;
		} 
		this.sprite.rotation = angle;
	}

	handleKeyDown(event: KeyboardEvent) {
		if (event.code === 'KeyW') this.keysDown.w = true;
		if (event.code === 'KeyD') this.keysDown.d = true;
		if (event.code === 'KeyS') this.keysDown.s = true;
		if (event.code === 'KeyA') this.keysDown.a = true;
	}

	handleKeyUp(event: KeyboardEvent) {
		if (event.code === 'KeyW') this.keysDown.w = false;
		if (event.code === 'KeyD') this.keysDown.d = false;
		if (event.code === 'KeyS') this.keysDown.s = false;
		if (event.code === 'KeyA') this.keysDown.a = false;
	}

	handleKeyPress(event: KeyboardEvent) {
		if (event.code === 'Escape') this.store.dispatch(pause());
	}

	handleMouseMove(event: MouseEvent) {
		this.mouseCoords.x = event.clientX;
		this.mouseCoords.y = event.clientY;
	}
}