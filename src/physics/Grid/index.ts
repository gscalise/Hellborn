import GameState from '../../stateManagement/GameState';
import Actor, { quadrantIndex } from '../../actors/Actor';

export interface Quadrant {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	activeActors: string[];
}

export default class Grid {
	id: string;
	quadrants: Quadrant[][];
	horizontalCount: number;
	verticalCount: number;
	constructor(ground: PIXI.Container, state: GameState) {
		this.id = 'grid';
		this.quadrants = new Array<Array<Quadrant>>();
		this.horizontalCount = 20;
		this.verticalCount = 20;
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
		let currentQuadrantsClone = actor.currentQuadrants.slice();
		currentQuadrantsClone.forEach((quadrantIndex) => {
			const currentQuadrant = this.quadrants[quadrantIndex.xIndex][quadrantIndex.yIndex];
			if (actor.x + actor.hitBoxRadius > currentQuadrant.x2) {
				const newQuadrantIndex = Object.assign({}, quadrantIndex);
				if (newQuadrantIndex.xIndex + 1 < this.horizontalCount) {
					newQuadrantIndex.xIndex = newQuadrantIndex.xIndex + 1;
					this.addActorToQuadrant(currentQuadrant, actor, newQuadrantIndex);
				}
			}
			if (actor.x - actor.hitBoxRadius < currentQuadrant.x1) {
				const newQuadrantIndex = Object.assign({}, quadrantIndex);
				if (newQuadrantIndex.xIndex - 1 >= 0) {
					newQuadrantIndex.xIndex = newQuadrantIndex.xIndex - 1;
					this.addActorToQuadrant(currentQuadrant, actor, newQuadrantIndex);
				}
			}
			if (actor.y + actor.hitBoxRadius > currentQuadrant.y2) {
				const newQuadrantIndex = Object.assign({}, quadrantIndex);
				if (newQuadrantIndex.yIndex + 1 < this.verticalCount) {
					newQuadrantIndex.yIndex = newQuadrantIndex.yIndex + 1;
					this.addActorToQuadrant(currentQuadrant, actor, newQuadrantIndex);
				}
			}
			if (actor.y - actor.hitBoxRadius < currentQuadrant.y1) {			
				const newQuadrantIndex = Object.assign({}, quadrantIndex);
				if (newQuadrantIndex.yIndex - 1 >= 0) {
					newQuadrantIndex.yIndex = newQuadrantIndex.yIndex - 1;
					this.addActorToQuadrant(currentQuadrant, actor, newQuadrantIndex);
				}
			}
		});
		currentQuadrantsClone = actor.currentQuadrants.slice();
		currentQuadrantsClone.forEach((quadrantIndex) => {
			const currentQuadrant = this.quadrants[quadrantIndex.xIndex][quadrantIndex.yIndex];
			if (actor.y + actor.hitBoxRadius < currentQuadrant.y1 ||
					actor.y - actor.hitBoxRadius > currentQuadrant.y2 ||
					actor.x + actor.hitBoxRadius < currentQuadrant.x1 ||
					actor.x - actor.hitBoxRadius > currentQuadrant.x2) {
				this.removeActorFromQuadrant(currentQuadrant, actor, quadrantIndex);
			}
		});

	}

	addActorToQuadrant(quadrant: Quadrant, actor: Actor, quadrantIndex: quadrantIndex) {
		if (!quadrant.activeActors.includes(actor.id)) {
			quadrant.activeActors.push(actor.id);
		}
		if (!this.checkIfActorIsInQuadrant(actor.currentQuadrants, quadrantIndex)) {
			actor.currentQuadrants.push(quadrantIndex);
		}
		return quadrant;
	}

	removeActorFromQuadrant(quadrant: Quadrant, actor: Actor, quadrantIndex: quadrantIndex) {
		if (quadrant.activeActors.includes(actor.id)) {
			quadrant.activeActors.splice( quadrant.activeActors.indexOf(actor.id), 1);
		}
		if (this.checkIfActorIsInQuadrant(actor.currentQuadrants, quadrantIndex)) {
			actor.currentQuadrants.splice(actor.currentQuadrants.indexOf(quadrantIndex), 1);

		}
		return quadrant;
	}
	
	checkIfActorIsInQuadrant(quadrantIndexes: quadrantIndex[], quadrantIndex: quadrantIndex) {
		let isActorInQuadrant = false;
		let quadrantIndexInArray = quadrantIndexes.findIndex((currentQuadrantIndex) => {
			if (currentQuadrantIndex.xIndex == quadrantIndex.xIndex && currentQuadrantIndex.yIndex == quadrantIndex.yIndex) {
				return true;
			}
		});
		if (quadrantIndexInArray > -1) isActorInQuadrant = true;
		return isActorInQuadrant;
	}
} 