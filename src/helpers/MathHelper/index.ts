export default class MathHelper {
	static floorToTwo(number: number) {
		return Math.floor(100 * number)/100;
	}
	// static atanZeroToTwoPI(verticalDistance: number, horizontalDistance: number) {
	// 	let atan = Math.atan2(verticalDistance, horizontalDistance);
	// 	if (atan < 0) {
	// 		atan = 2 * Math.PI + atan;
	// 	}
	// 	return atan;
	// }
}