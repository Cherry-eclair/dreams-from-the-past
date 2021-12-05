class Overworld {
	constructor(config) {
		this.element = config.element;
		this.canvas = this.element.querySelector(".game-canvas");
		this.ctx = this.canvas.getContext('2d');
		this.map = null;

	}

	startGameLoop() {
		const step = () => {
			//Очистка канваса
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			const cameraPerson = this.map.gameObjects.hero;

			Object.values(this.map.gameObjects).forEach(object => {
				object.update({
					arrow: this.directionInput.direction,
					map: this.map,
				})
			})

			//Отрисовка нижнего слоя
			this.map.drawLowerImage(this.ctx, cameraPerson);

			//Отрисовка игровых объектов
			Object.values(this.map.gameObjects).sort((a,b) => {
				return a.y - b.y;
			}).forEach(object => {		
				object.sprite.draw(this.ctx, cameraPerson);
			})

			//Отрисовка верхнего слоя
			this.map.drawUpperImage(this.ctx, cameraPerson);

			requestAnimationFrame(() => {
				step();
			})
		}
		step();
	}

	bindActionInput() {
		new KeyPressListener("KeyZ", () => {
			this.map.checkForActionCutscene();
		})
	}

	bindHeroPositionCheck() {
		document.addEventListener("PersonWalkingComplete", e => {
			if (e.detail.whoId === "hero") {
				this.map.checkForFootstepCutscene()
			}
		})
	}

	startMap(mapConfig) {
		this.map = new OverworldMap(mapConfig);
		this.map.overworld = this;
		this.map.mountObjects();
	}

	init() {
		this.startMap(window.OverworldMaps.LivingRoom);

		this.bindActionInput();
		this.bindHeroPositionCheck();

		this.directionInput = new DirectionInput();
		this.directionInput.init();

		this.startGameLoop();

		this.map.startCutscene([
			{ type: "textMessage", text: "Привет:)"},
			//{who: "hero", type: "walk", direction: "down" },
			])
		

	}
}