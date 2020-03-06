// eslint-disable-next-line no-unused-vars
import {Pair} from './Grid';
// eslint-disable-next-line no-unused-vars
import Actor from '../actors/Actor';

export default class Collision {
	static check(pair: Pair): void {
		const firstActor = pair.firstActor;
		const secondActor = pair.secondActor;
		const distance = (secondActor.destination.x - firstActor.destination.x) * (secondActor.destination.x - firstActor.destination.x) + 
			(secondActor.destination.y - firstActor.destination.y) * (secondActor.destination.y - firstActor.destination.y);
		if (distance <= (secondActor.hitBoxRadius + firstActor.hitBoxRadius)*(secondActor.hitBoxRadius + firstActor.hitBoxRadius)) {	
			this.collide(firstActor, secondActor);
		}
	}

	
	static collide(firstActor: Actor, secondActor: Actor) {
		if (firstActor.movable && secondActor.movable) {
			// two movable objects. one of them is gonna be pushed
			let pushingActor;
			let pushedActor;
			if (firstActor.strength >= secondActor.strength) {
				pushingActor = firstActor;
				pushedActor = secondActor;
			}
			if (firstActor.strength < secondActor.strength) {
				pushingActor = secondActor;
				pushedActor = firstActor;
			}
			// const strengthRelative = pushedActor.strength/pushingActor.strength;
			// pushedActor.speed = pushingActor.speed/(1 - strengthRelative);
			// pushingActor.speed = pushingActor.speed/strengthRelative;

			const horizontalDistanceToPushedActor = pushedActor.x - pushingActor.x;
			const verticalDistanceToPushedActor = pushedActor.y - pushingActor.y;
			let directionToPushedActor = Math.atan2(verticalDistanceToPushedActor, horizontalDistanceToPushedActor);

			const horizontalDistanceToDestination = pushingActor.destination.x - pushingActor.x;
			const verticalDistanceToDestination = pushingActor.destination.y - pushingActor.y;
			let directionPushingActor = Math.atan2(verticalDistanceToDestination, horizontalDistanceToDestination);

			if (pushingActor.status.moving) {
				pushingActor.calculateDestination(directionPushingActor);
			}
			pushedActor.calculateDestination(directionToPushedActor);
		}
		else {
			if (firstActor.type == 'projectile' && firstActor.status.alive && secondActor.type == 'enemy') {
				firstActor.hit(secondActor);
			}
			if (secondActor.type == 'projectile' && secondActor.status.alive && firstActor.type == 'enemy') {
				secondActor.hit(firstActor);
			}
		}
	}

}