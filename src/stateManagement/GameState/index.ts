// eslint-disable-next-line no-unused-vars
import Grid from '../../physics/Grid';
// eslint-disable-next-line no-unused-vars
import Actor from '../../actors/Actor';

export interface Actors {
	[id: string]: Actor;
}

export default class GameState {
	pause: boolean;
	enemiesCount: number;
	playersCount: number;
	projectilesCount: number;
	spawnerCount: number;

	grid: Grid;
	actors: Actors;
	ticker: PIXI.Ticker;
	constructor() {
		this.pause = true;
		this.enemiesCount = 0;
		this.playersCount = 0;
		this.projectilesCount = 0;
		this.spawnerCount = 0;
		this.actors = {};

		this.play = this.play.bind(this);
	}
	prepareToMoveActor(actor: Actor) {
		this.grid.calculateNewQuadrants(actor);
	}
	addGrid(grid: Grid) {
		this.grid = grid;
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

