const initialState = {};

export default function reducer(state = initialState, action) {
	let newState ={};
	switch (action.type) {
	case 'MOVE':
		newState[action.object.id] = {
			x: action.object.x,
			y: action.object.y
		};
		return Object.assign({}, state, newState);
	case 'CREATE': 
		newState[action.object.id] = {
			x: action.object.x,
			y: action.object.y
		};
		return Object.assign({}, state, newState);
	default:
		return state;
	}
}