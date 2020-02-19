import { customstore } from "../../stateManagement/reducers/Reducer";
import {addGrid} from '../../stateManagement/actions/Action';

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
	constructor(ground: PIXI.Container, store: customstore) {
		this.id = 'grid';
		this.quadrants = new Array<Array<Quadrant>>();
		const horizontalCount = 10;
		const verticalCount = 10;
		const quadrantWidth = ground.width/horizontalCount;
		const quadrantHeight = ground.height/verticalCount;
		for (let i = 0; i < horizontalCount; i++) {
			this.quadrants[i] = [];
			let currentX = i * quadrantWidth;
			for (let j = 0; j < verticalCount; j++) {
				let currentY = j * quadrantHeight;
				this.quadrants[i][j] = {
					x1: currentX,
					y1: currentY,
					x2: currentX + quadrantWidth,
					y2: currentY + quadrantHeight,
					activeActors: []
				}
			}
		}
		store.dispatch(addGrid(this));
	}
} 