// export function move(object) {
// 	return {
// 		type: 'MOVE',
// 		object: object
// 	};
// }

export function createActor(object: unknown) {
	return {
		type: 'CREATE_ACTOR',
		object: object
	};
}

export function pause() {
	return {
		type: 'PAUSE'
	};
}