import * as PIXI from 'pixi.js';

import Spawner from '../actors/Spawner';
import Ground from '../helpers/Ground';
import Player from '../actors/Player';
// eslint-disable-next-line no-unused-vars
import Grid, { Quadrant } from '../physics/Grid';
// eslint-disable-next-line no-unused-vars
import Actor from '../actors/Actor';
import HUD from '../interface/HUD';

export interface Actors {
	[id: string]: Actor;
}

export default class Game extends PIXI.Application {
	pause: boolean;

	// What do you use the counts for?
	enemiesCount: number;
	playersCount: number;
	projectilesCount: number;
	spawnerCount: number;
	hud: HUD;
	grid: Grid;
	actors: Actors;

	constructor() {
		super({
			width: window.innerWidth,
			height: window.innerHeight,
			resolution: window.devicePixelRatio,
			resizeTo: window
		});
		this.pause = true;
		this.enemiesCount = 0;
		this.playersCount = 0;
		this.projectilesCount = 0;
		this.spawnerCount = 0;
		this.actors = {};

		this.play = this.play.bind(this);
	}

	loadResources() {
		return this.loader
			.add('player1', 'assets/sprites/player_left_leg.png')
			.add('player2', 'assets/sprites/player_standing.png')
			.add('player3', 'assets/sprites/player_right_leg.png')
			.add('enemy', 'assets/sprites/enemy.png')
			.add('ground', 'assets/sprites/ground.png')
			.add('wall', 'assets/sprites/wall.png')
			.add('bullet', 'assets/sprites/bullet.png')
			.add('spawner', 'assets/sprites/spawner.png');
	}

	initialize(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
		const groundSprite = PIXI.Sprite.from('ground');
		groundSprite.zIndex = 0;
		const ground = new Ground();
		
		ground.addChild(groundSprite);
		
		const camera = new PIXI.Container();
		camera.interactive = true;
		camera.addChild(ground);
	
		this.stage.addChild(camera);
	
		// initialize grid for collisions
		new Grid(ground, this);
	
		// initialize player and enemy
		const playerQuadrant: Quadrant = this.grid.quadrants[4][5];
		const playerTextures = [resources.player2.texture, resources.player1.texture, resources.player2.texture, resources.player3.texture];
		const player = new Player(this.screen, camera, ground, playerTextures, this, playerQuadrant, resources.bullet.texture);
		ground.addChild(player);
	
		const spawnerQuadrant1: Quadrant = this.grid.quadrants[4][2];
		new Spawner(ground, PIXI.Texture.from('enemy'), this, spawnerQuadrant1);
		const spawnerQuadrant2: Quadrant = this.grid.quadrants[7][2];
		new Spawner(ground, PIXI.Texture.from('enemy'), this, spawnerQuadrant2);
		const spawnerQuadrant3: Quadrant = this.grid.quadrants[7][8];
		new Spawner(ground, PIXI.Texture.from('enemy'), this, spawnerQuadrant3);
		
		// initialize interface
		const graphics = new PIXI.Graphics();
		this.hud = new HUD(camera, graphics, this);
		// const menu = new Menu();

	}

	loop(): void{
		if (!this.pause) {
			// console.log(delta);
			this.play();
			// tick++;
		}
		else {
			// menu.manage();
		}
	}

	addGrid(grid: Grid) {
		this.grid = grid;
	}

	prepareToMoveActor(actor: Actor) {
		this.grid.calculateNewQuadrants(actor);
	}

	addActor(actor: Actor) {
		if (!this.actors[actor.id]) {
			this.actors[actor.id] = actor;
			switch(actor.type) {
			case 'enemy':
				this.enemiesCount = this.enemiesCount + 1;
				break;
			case 'player':
				this.playersCount = this.playersCount + 1;
				break;
			case 'projectile':
				this.projectilesCount = this.projectilesCount + 1;
				break;
			case 'spawner':
				this.spawnerCount = this.spawnerCount + 1;
				break;
			}
			const quadrantToAddActorTo = actor.currentQuadrants[0];
			this.grid.quadrants[quadrantToAddActorTo.xIndex][quadrantToAddActorTo.yIndex].activeActors.push(actor.id);
		}
	}

	play() {
		// console.log(this);
		this.hud.render();
		for (let actorID in this.actors) {
			if (this.actors[actorID].status.alive) {
				this.actors[actorID].prepare();
			}
		}
		this.grid.checkCollisions(this.actors);

		for (let actorID in this.actors) {
			if (this.actors[actorID].status.alive) {
				this.actors[actorID].act();
			}
		}
	}
}


