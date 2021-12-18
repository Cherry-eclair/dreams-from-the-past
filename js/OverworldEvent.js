class OverworldEvent {
	constructor({ map, event}) {
		this.map = map;
		this.event = event;
	}

	stand(resolve) {
		const who = this.map.gameObjects[ this.event.who ];
		who.startBehavior({
			map: this.map
		}, {
			type: "stand",
			direction: this.event.direction,
			time: this.event.time
		})

		const completeHandler = e => {
			if (e.detail.whoId === this.event.who) {
				document.removeEventListener("PersonStandComplete", completeHandler);
				resolve();
			}
		}

		document.addEventListener("PersonStandComplete", completeHandler)
	}


	walk(resolve) {
		const who = this.map.gameObjects[ this.event.who ];
		who.startBehavior({
			map: this.map
		}, {
			type: "walk",
			direction: this.event.direction,
			retry: true
		})

		const completeHandler = e => {
			if (e.detail.whoId === this.event.who) {
				document.removeEventListener("PersonWalkingComplete", completeHandler);
				resolve();
			}
		}

		document.addEventListener("PersonWalkingComplete", completeHandler)
	}

	textMessage(resolve) {
		
		if (this.event.faceHero) {
			const obj = this.map.gameObjects[this.event.faceHero];
			obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
		}

		const message = new TextMessage({
			text: this.event.text,
			onComplete: () => resolve()
		})
		message.init( document.querySelector(".game-container"))
	}

	changeMap(resolve) {

		const sceneTransition = new SceneTransition();
		sceneTransition.init(document.querySelector(".game-container"), () => {
			this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
				x: this.event.x,
				y: this.event.y,
				direction: this.event.direction,
			});
			resolve();

			sceneTransition.fadeOut();
		})
	}

	pause(resolve) {
		
		this.map.isPause = true;
		const menu = new PauseMenu({
			onComplete: () => {
				resolve();
				this.map.isPause = false;
				this.map.overworld.startGameLoop();
			}
		});
		menu.init(document.querySelector(".game-container"));
	}

	init() {
		return new Promise(resolve => {
			this[this.event.type](resolve)
		})
	}
}