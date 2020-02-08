export function move(object) {
	return {
		type: 'MOVE',
		object: object
	};
}

export function create(object) {
	return {
		type: 'CREATE',
		object: object
	};
}