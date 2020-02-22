import Grid from '../../physics/Grid';
import Actor from '../../actors/Actor';
import Collision from '../../physics/Collision';

export interface Actors {
	[id: string]: Actor;
}

export interface Pair {
	firstActor: Actor;
	secondActor: Actor;
}

export default class GameState {
	pause: boolean;
	enemiesCount: number;
	playersCount: number;
	grid: Grid;
	actors: Actors;
	constructor() {
		this.pause = true;
		this.enemiesCount = 0;
		this.playersCount = 0;
		this.actors = {};

		this.play = this.play.bind(this);
	}
	moveActor(actor: Actor) {
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
			}
			const quadrantToAddActorTo = actor.currentQuadrants[0];
			this.grid.quadrants[quadrantToAddActorTo.xIndex][quadrantToAddActorTo.yIndex].activeActors.push(actor.id);
		}
	}

	play() {
		for (let actorID in this.actors) {
			this.actors[actorID].act();
		}
		let pairs = [];
		for (let dimensionIndex = 0; dimensionIndex < this.grid.quadrants.length; dimensionIndex++) {
			const dimension = this.grid.quadrants[dimensionIndex];
			for (let quadrantIndexInArray = 0; quadrantIndexInArray < dimension.length; quadrantIndexInArray++) {
				const quadrant = dimension[quadrantIndexInArray];
				if (quadrant.activeActors.length > 1) {
					for (let i = 0; i < quadrant.activeActors.length; i++) {
						const firstActorToCheck = this.actors[quadrant.activeActors[i]];
						for (let j = i + 1; j < quadrant.activeActors.length; j++) {							
							const secondActorToCheck = this.actors[quadrant.activeActors[j]];
							const pair = {firstActor: firstActorToCheck, secondActor: secondActorToCheck};
							if (!this.isPairCheckedForCollision(pairs, pair)) {
								pairs.push(pair);
								Collision.check(pair);
							}

						}
					}
				}
			}
		}
		for (let actorID in this.actors) {
			this.actors[actorID].move();
		}
	}
	
	isPairCheckedForCollision(pairs: Pair[], pair: Pair) {
		let isPairChecked = false;
		let quadrantIndexInArray = pairs.findIndex((currentPair) => {
			if (currentPair.firstActor == pair.firstActor && currentPair.secondActor == currentPair.secondActor) {
				return true;
			}
		});
		if (quadrantIndexInArray > -1) isPairChecked = true;
		return isPairChecked;
	}
}

