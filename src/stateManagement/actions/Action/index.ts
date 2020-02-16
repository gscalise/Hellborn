import Actor from "../../../actors/Actor";
import Grid from "../../../physics/Grid";

// export function move(object) {
// 	return {
// 		type: 'MOVE',
// 		object: object
// 	};
// }

export function addActor(actor: Actor) {
	return {
		type: 'ADD_ACTOR',
		actor: actor
	};
}

export function addGrid(grid: Grid) {
	return {
		type: 'ADD_GRID',
		grid: grid
	};
}

export function pause(pause: boolean) {
	return {
		type: 'PAUSE',
		pause: pause
	};
}