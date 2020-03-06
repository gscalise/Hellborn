// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import GameState from '../stateManagement/GameState';
// eslint-disable-next-line no-unused-vars
import {Quadrant} from '../physics/Grid';
import Enemy from './Enemy';
// eslint-disable-next-line no-unused-vars
import Ground from '../helpers/Ground';

export default class Spawner extends Actor {
	spawnCooldown: number;
	spawnTexture: PIXI.Texture;

	constructor(ground: Ground, texture: PIXI.Texture, state: GameState, quadrant: Quadrant) {
		const type = 'spawner';
		super(texture, state, type, quadrant, ground);

		this.spawnTexture = texture;
		this.spawnCooldown = 0;
		this.act = this.act.bind(this);
	}
	
	prepare() {
		if (this.spawnCooldown > 0) {
			this.spawnCooldown = this.spawnCooldown - this.state.ticker.elapsedMS;
		}
	}

	act(): void {
		if (this.spawnCooldown <= 0) {
			const enemy = new Enemy(this.ground, this.spawnTexture, this.state, this.currentQuadrants[0]);
			this.ground.addChild(enemy);	
			this.spawnCooldown = 4000;
		}

	}

}