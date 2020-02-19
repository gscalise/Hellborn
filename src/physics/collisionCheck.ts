import Grid, { Quadrant } from "./Grid";
import { State } from "../stateManagement/reducers/Reducer";
import Actor from "../actors/Actor";

export default function checkCollision(state: State, x: number, y: number, actor: Actor): boolean {
	let collisionHappened = false;
	for (let i = 0; i < actor.currentQuadrants.length; i++) {
		if (collisionHappened) { break; };
		const currentQuadrantIndex = actor.currentQuadrants[i];
		const quadrant = state.grid.quadrants[parseInt(currentQuadrantIndex.charAt(0), 10)][parseInt(currentQuadrantIndex.charAt(1), 10)];
		for (let i = 0; i < quadrant.activeActors.length; i++) {
			const currentActorToCheck = state.actors[quadrant.activeActors[i]];			
			if (currentActorToCheck.id !== actor.id) {
				const distance = (currentActorToCheck.x - x) * (currentActorToCheck.x - x) + (currentActorToCheck.y - y) * (currentActorToCheck.y - y);
				if (distance <= (currentActorToCheck.hitBoxRadius + actor.hitBoxRadius)*(currentActorToCheck.hitBoxRadius + actor.hitBoxRadius)) {
					collisionHappened = true;
				}
			}
		}
	}
	return collisionHappened;
}