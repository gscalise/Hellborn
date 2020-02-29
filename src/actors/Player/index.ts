// eslint-disable-next-line no-unused-vars
import Actor, { quadrantIndex } from '../Actor';
// eslint-disable-next-line no-unused-vars
import { interaction } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import GameState from '../../stateManagement/GameState';
import Projectile from '../Projectile';

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
	screen: PIXI.Rectangle;
	camera: PIXI.Container;
	bulletTexture: PIXI.Texture;

	constructor(screen: PIXI.Rectangle, camera: PIXI.Container, ground: PIXI.Container, texture: PIXI.Texture, state: GameState, quadrantIndex: quadrantIndex, bulletTexture: PIXI.Texture) {
		const type = 'player';
		super(texture, state, type, quadrantIndex, ground);

		this.ground = ground;
		this.screen = screen;
		this.camera = camera;
		this.bulletTexture = bulletTexture;

		this.zIndex = 1;
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;

		this.centerCamera();

		this.speed = 4;
		this.rotation = -(3*Math.PI/2);
		this.interactive = true;

		this.health = 100;

		this.strength = 90;
		this.movable = true;

		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));
		document.addEventListener('keydown', this.handleKeyPress.bind(this));
		window.onresize = this.centerCamera.bind(this);
		camera.on('mousemove', this.handleMouseMove.bind(this));
		camera.on('mouseout', this.handleMouseOut.bind(this));
		camera.on('click', this.shoot.bind(this));

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

		this.act = this.act.bind(this);
		this.controlMovement = this.controlMovement.bind(this);
		this.centerCamera = this.centerCamera.bind(this);
	}

	prepare() {
		this.controlMovement();
		this.controlSight();
	}

	act() {
		this.move();
		this.centerCamera();
	}

	controlMovement() {
		let direction = 0;
		this.speed = 4;
		this.status.moving = false;
		if (this.keysDown.w) {
			this.status.moving = true;
			direction = -Math.PI/2;
		}
		if (this.keysDown.s) {
			if (this.keysDown.w) {
				this.status.moving = false;
			}
			else {
				direction = Math.PI/2;
				this.status.moving = true;
			}
		}
		if (this.keysDown.d) {   
			if (this.keysDown.s) {
				direction = direction - Math.PI/4;
			}
			if (this.keysDown.w) {
				direction = direction + Math.PI/4;
			}
			if (!this.keysDown.s && !this.keysDown.w) {
				direction = 0;
			}
			this.status.moving = true;
		}
		if (this.keysDown.a) {
			if (this.keysDown.d) {
				this.status.moving = false;
			}
			else {
				this.status.moving = true;
				if (this.keysDown.w) {
					direction = direction - Math.PI/4;
				}
				if (this.keysDown.s) {
					direction = direction + Math.PI/4;
				}	
				if (!this.keysDown.w && !this.keysDown.s) {
					direction = Math.PI;
				}
			}
		}
		if (this.status.moving) {
			this.calculateDestination(direction);
		}
	}

	controlSight() {
		const actorRelativeToCameraX = this.x + this.ground.x;
		const actorRelativeToCameraY = this.y + this.ground.y;
		let angle = Math.atan2(this.mouseCoords.y - actorRelativeToCameraY, this.mouseCoords.x - actorRelativeToCameraX);
		this.rotation = angle;
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
		if (event.code === 'Escape') {
			const isPaused = !this.state.pause;
			this.state.pause = isPaused;
		}
	}

	handleMouseMove(event: interaction.InteractionEvent) {
		this.mouseCoords.x = event.data.getLocalPosition(this.camera).x;
		this.mouseCoords.y = event.data.getLocalPosition(this.camera).y;
	}

	handleMouseOut() {
		this.state.pause = true;
	}

	centerCamera() {
		let x = this.x - this.screen.width/2;
		let y = this.y - this.screen.height/2;
		if (this.x - this.screen.width/2 <= 0) {
			x = 0;
		}
		if (this.x + this.screen.width/2 >= this.ground.width) {
			x = this.ground.width - this.screen.width;
		}
		if (this.y - this.screen.height/2 <= 0) {
			y = 0;
		}
		if (this.y + this.screen.height/2 >= this.ground.height) {
			y = this.ground.height - this.screen.height;
		}
		this.ground.x = -x;
		this.ground.y = -y;
	}

	shoot() {
		const shooterFaceCenterX = this.x + this.hitBoxRadius * Math.cos(this.rotation);
		const shooterFaceCenterY = this.y + this.hitBoxRadius * Math.sin(this.rotation);
		let bulletQuadrant = this.state.grid.getQuadrantByCoords(shooterFaceCenterX, shooterFaceCenterY);
		console.log(bulletQuadrant);
		const bullet = new Projectile(this.bulletTexture, this.state, 'projectile', bulletQuadrant, this.ground, this);
		this.ground.addChild(bullet);
	}
}