import {Pair} from '../../stateManagement/GameState';

export default class Collision {
	static check(pair: Pair): void {
		const firstActor = pair.firstActor;
		const secondActor = pair.secondActor;
		const distance = (secondActor.destination.x - firstActor.destination.x) * (secondActor.destination.x - firstActor.destination.x) + 
			(secondActor.destination.y - firstActor.destination.y) * (secondActor.destination.y - firstActor.destination.y);
		if (distance <= (secondActor.hitBoxRadius + firstActor.hitBoxRadius)*(secondActor.hitBoxRadius + firstActor.hitBoxRadius)) {
			firstActor.collide(secondActor);
			secondActor.collide(firstActor);
		}
	}
}