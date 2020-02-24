import GameState, { Actors } from '../../stateManagement/GameState';
import Actor, { quadrantIndex } from '../../actors/Actor';
import Collision from '../../physics/Collision';

export interface Quadrant {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	activeActors: string[];
}

export interface Pair {
	firstActor: Actor;
	secondActor: Actor;
}

export default class Grid {
	id: string;
	quadrants: Quadrant[][];
	horizontalCount: number;
	verticalCount: number;
	constructor(ground: PIXI.Container, state: GameState) {
		this.id = 'grid';
		this.quadrants = new Array<Array<Quadrant>>();
		this.horizontalCount = 16;
		this.verticalCount = 16;
		const quadrantWidth = ground.width/this.horizontalCount;
		const quadrantHeight = ground.height/this.verticalCount;
		for (let i = 0; i < this.horizontalCount; i++) {
			this.quadrants[i] = [];
			let currentX = i * quadrantWidth;
			for (let j = 0; j < this.verticalCount; j++) {
				let currentY = j * quadrantHeight;
				this.quadrants[i][j] = {
					x1: currentX,
					y1: currentY,
					x2: currentX + quadrantWidth,
					y2: currentY + quadrantHeight,
					activeActors: []
				};
			}
		}
		state.addGrid(this);
	}

	calculateNewQuadrants(actor: Actor) {
		const actorRightBorder = actor.x + actor.hitBoxRadius;
		const actorLeftBorder = actor.x - actor.hitBoxRadius;
		const actorBottomBorder = actor.y + actor.hitBoxRadius;
		const actorTopBorder = actor.y - actor.hitBoxRadius;

		let currentQuadrantsClone = actor.currentQuadrants.slice();
		currentQuadrantsClone.forEach((quadrantIndex) => {
			if (actor.type == 'player') {
				console.log('removing' + actor.x + '--- ' + actor.y);
			}
			const currentQuadrant = this.quadrants[quadrantIndex.xIndex][quadrantIndex.yIndex];
			if (actorBottomBorder < currentQuadrant.y1 ||
					actorTopBorder > currentQuadrant.y2 ||
					actorRightBorder < currentQuadrant.x1 ||
					actorLeftBorder > currentQuadrant.x2) {
				if (actor.type == 'player') {
					console.log(currentQuadrant);
				}
				this.removeActorFromQuadrant(currentQuadrant, actor, quadrantIndex);
			}
		});

		currentQuadrantsClone = actor.currentQuadrants.slice();
		currentQuadrantsClone.forEach((quadrantIndex) => {
			if (actor.type == 'player') {
				console.log('adding' + actor.x + '--- ' + actor.y);
			}
			const currentQuadrant = this.quadrants[quadrantIndex.xIndex][quadrantIndex.yIndex];
			// right
			if (actorRightBorder >= currentQuadrant.x2) {
				const newQuadrantIndex = Object.assign({}, quadrantIndex);
				if (newQuadrantIndex.xIndex + 1 < this.horizontalCount) {
					newQuadrantIndex.xIndex = newQuadrantIndex.xIndex + 1;
					const newQuadrant = this.quadrants[newQuadrantIndex.xIndex][newQuadrantIndex.yIndex];
					this.addActorToQuadrant(newQuadrant, actor, newQuadrantIndex);
				}
				// right-bootom 
				if (actorBottomBorder >= currentQuadrant.y2) {
					if (newQuadrantIndex.yIndex + 1 < this.verticalCount) {
						newQuadrantIndex.yIndex = newQuadrantIndex.yIndex + 1;
						const newQuadrant = this.quadrants[newQuadrantIndex.xIndex][newQuadrantIndex.yIndex];
						this.addActorToQuadrant(newQuadrant, actor, newQuadrantIndex);
					}
				}
				// right-top
				if (actorTopBorder <= currentQuadrant.y1) {			
					if (newQuadrantIndex.yIndex - 1 >= 0) {
						newQuadrantIndex.yIndex = newQuadrantIndex.yIndex - 1;
						const newQuadrant = this.quadrants[newQuadrantIndex.xIndex][newQuadrantIndex.yIndex];
						this.addActorToQuadrant(newQuadrant, actor, newQuadrantIndex);
					}
				}
			}
			// bottom
			if (actorBottomBorder >= currentQuadrant.y2) {
				const newQuadrantIndex = Object.assign({}, quadrantIndex);
				if (newQuadrantIndex.yIndex + 1 < this.verticalCount) {
					newQuadrantIndex.yIndex = newQuadrantIndex.yIndex + 1;
					const newQuadrant = this.quadrants[newQuadrantIndex.xIndex][newQuadrantIndex.yIndex];
					this.addActorToQuadrant(newQuadrant, actor, newQuadrantIndex);
				}
			}
			// left
			if (actorLeftBorder <= currentQuadrant.x1) {
				const newQuadrantIndex = Object.assign({}, quadrantIndex);
				if (newQuadrantIndex.xIndex - 1 >= 0) {
					newQuadrantIndex.xIndex = newQuadrantIndex.xIndex - 1;
					const newQuadrant = this.quadrants[newQuadrantIndex.xIndex][newQuadrantIndex.yIndex];
					this.addActorToQuadrant(newQuadrant, actor, newQuadrantIndex);
				}
				// left-bottom
				if (actorBottomBorder >= currentQuadrant.y2) {
					if (newQuadrantIndex.yIndex + 1 < this.verticalCount) {
						newQuadrantIndex.yIndex = newQuadrantIndex.yIndex + 1;
						const newQuadrant = this.quadrants[newQuadrantIndex.xIndex][newQuadrantIndex.yIndex];
						this.addActorToQuadrant(newQuadrant, actor, newQuadrantIndex);
					}
				}
				// left-top
				if (actorTopBorder <= currentQuadrant.y1) {
					if (newQuadrantIndex.yIndex - 1 >= 0) {
						newQuadrantIndex.xIndex = newQuadrantIndex.xIndex - 1;
						const newQuadrant = this.quadrants[newQuadrantIndex.xIndex][newQuadrantIndex.yIndex];
						this.addActorToQuadrant(newQuadrant, actor, newQuadrantIndex);
					}
				}
			}
			// top
			if (actorTopBorder <= currentQuadrant.y1) {			
				const newQuadrantIndex = Object.assign({}, quadrantIndex);
				if (newQuadrantIndex.yIndex - 1 >= 0) {
					newQuadrantIndex.yIndex = newQuadrantIndex.yIndex - 1;
					const newQuadrant = this.quadrants[newQuadrantIndex.xIndex][newQuadrantIndex.yIndex];
					this.addActorToQuadrant(newQuadrant, actor, newQuadrantIndex);
				}
			}
		});
	}

	addActorToQuadrant(quadrant: Quadrant, actor: Actor, quadrantIndex: quadrantIndex) {
		if (!quadrant.activeActors.includes(actor.id)) {
			quadrant.activeActors.push(actor.id);
		}
		if (!this.checkQuadrantIndexInArray(actor.currentQuadrants, quadrantIndex)) {
			actor.currentQuadrants.push(quadrantIndex);
		}
		return quadrant;
	}

	// replace indexof with findIndex
	removeActorFromQuadrant(quadrant: Quadrant, actor: Actor, quadrantIndex: quadrantIndex) {
		if (quadrant.activeActors.includes(actor.id)) {
			quadrant.activeActors.splice( quadrant.activeActors.indexOf(actor.id), 1);
		}
		if (this.checkQuadrantIndexInArray(actor.currentQuadrants, quadrantIndex)) {
			actor.currentQuadrants.splice(actor.currentQuadrants.indexOf(quadrantIndex), 1);

		}
		return quadrant;
	}
	
	checkQuadrantIndexInArray(quadrantIndexes: quadrantIndex[], quadrantIndex: quadrantIndex) {
		let isQuadrantIndexInArray = false;
		let quadrantIndexInArray = quadrantIndexes.findIndex((currentQuadrantIndex) => {
			if (currentQuadrantIndex.xIndex == quadrantIndex.xIndex && currentQuadrantIndex.yIndex == quadrantIndex.yIndex) {
				return true;
			}
		});
		if (quadrantIndexInArray > -1) isQuadrantIndexInArray = true;
		return isQuadrantIndexInArray;
	}

	checkCollisions(actors: Actors) {
		// set up an array of quadrantIndexes to check
		let quadrantIndexesArray: quadrantIndex[] = [];
		for (var actorID in actors) {
			const actor = actors[actorID];
			actor.currentQuadrants.forEach((quadrantIndex) => {
				if (!this.checkQuadrantIndexInArray(quadrantIndexesArray, quadrantIndex)) {
					quadrantIndexesArray.push(quadrantIndex);
				}
			});
		}

		let pairs: Pair[] = [];
		quadrantIndexesArray.forEach((quadrantIndex) => {
			const quadrant = this.quadrants[quadrantIndex.xIndex][quadrantIndex.yIndex];
			if (quadrant.activeActors.length > 1) {
				for (let i = 0; i < quadrant.activeActors.length; i++) {
					const firstActorToCheck = actors[quadrant.activeActors[i]];
					if (firstActorToCheck.status.alive) {
						for (let j = i + 1; j < quadrant.activeActors.length; j++) {							
							const secondActorToCheck = actors[quadrant.activeActors[j]];
							if (secondActorToCheck.status.alive) {
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
		});
	}

	isPairCheckedForCollision(pairs: Pair[], pair: Pair) {
		let isPairChecked = false;
		let quadrantIndexInArray = pairs.findIndex((currentPair) => {
			if ((currentPair.firstActor.id == pair.firstActor.id && currentPair.secondActor.id == pair.secondActor.id) ||
					(currentPair.firstActor.id == pair.secondActor.id && currentPair.secondActor.id == pair.firstActor.id)) {
				return true;
			}
		});
		if (quadrantIndexInArray > -1) isPairChecked = true;
		return isPairChecked;
	}
} 