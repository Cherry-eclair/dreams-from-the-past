class OverworldMap {
	constructor(config) {
		this.overworld = null;
		this.gameObjects = config.gameObjects;
		this.walls = config.walls || {};
		this.cutsceneSpaces = config.cutsceneSpaces || {};
		this.objectCutsceneSpaces = config.objectCutsceneSpaces || {};

		this.lowerImage = new Image();
		this.lowerImage.src = config.lowerSrc;

		this.upperImage = new Image();
		this.upperImage.src = config.upperSrc;

		this.isCutscenePlaying = false;
		this.isPause = false;
	}

	//Отрисовка нижнего слоя карты

	drawLowerImage(ctx, cameraPerson) {
		ctx.drawImage(
			this.lowerImage,
			utils.widthGrid(7.75) - cameraPerson.x,
			utils.widthGrid(5) - cameraPerson.y
			)
	}

	//Отрисовка верхнео слоя карты

	drawUpperImage(ctx, cameraPerson) {
		ctx.drawImage(
			this.upperImage,
			utils.widthGrid(7.75) - cameraPerson.x,
			utils.widthGrid(5) - cameraPerson.y
			)
	}

	isSpaceTaken(currentX, currentY, direction) {
		const {x,y} = utils.nextPosition(currentX, currentY, direction);
		return this.walls[`${x},${y}`] || false;
	}

	mountObjects() {
		Object.keys(this.gameObjects).forEach(key => {
			
			let object = this.gameObjects[key];
			object.id = key;

			object.mount(this);
		})
	}

	async startCutscene(events) {
		this.isCutscenePlaying = true;

		for (let i=0; i< events.length; i++) {
			const eventHandler = new OverworldEvent({
				event: events[i],
				map: this,
			})
			await eventHandler.init();
		}

		this.isCutscenePlaying = false;

		Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
	}

	checkForActionCutscene() {
		const hero = this.gameObjects["hero"];
		const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
		const match = Object.values(this.gameObjects).find(object => {
			return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
		});
		if (!this.isCutscenePlaying && match && match.talking.length) {
			this.startCutscene(match.talking[0].events)
		}
	}

	checkForActionObjectCutscene() {
		const hero = this.gameObjects["hero"];
		const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
		const match = this.objectCutsceneSpaces[`${nextCoords.x},${nextCoords.y}`];

		if (!this.isCutscenePlaying && match) {
			this.startCutscene(match[0].events)
		}
	}

	checkForFootstepCutscene() {
		const hero = this.gameObjects["hero"];
		const match = this.cutsceneSpaces[ `${hero.x},${hero.y}`];
		if (!this.isCutscenePlaying && match) {
			this.startCutscene(match[0].events)
		}
	}

	//Коллизия 

	addWall(x, y) {
		this.walls[`${x},${y}`] = true;
	}

	removeWall(x, y) {
		delete this.walls[`${x},${y}`]
	}

	moveWall(wasX, wasY, direction) {
		this.removeWall(wasX, wasY);
		const {x,y} = utils.nextPosition(wasX, wasY, direction);
		this.addWall(x,y);
	}
}

//Карты

window.OverworldMaps = {
	LivingRoom: {
		id: "LivingRoom",
		lowerSrc: "images/maps/livingroom_lower.png",
		upperSrc: "images/maps/livingroom_upper.png",
		gameObjects: {
			hero: new Person({
				isPlayerControlled: true,
				x: utils.widthGrid(6),
				y: utils.widthGrid(7),
				src: "images/characters/hero.png"
			}),
			npcA: new Person({
				x: utils.widthGrid(3),
				y: utils.widthGrid(8),
				src: "images/characters/npc1.png",
				behaviorLoop: [
					{type: "stand", direction: "left", time: 1800 },
					{type: "stand", direction: "down", time: 2800 },
					{type: "stand", direction: "right", time: 800 },
					{type: "stand", direction: "down", time: 3800 },
				],
				talking: [
				{
					events: [
						{type: "textMessage", text: "Привет", faceHero: "npcA"},
						{type: "textMessage", text: "Как дела?"}
					]
				}
				]
			}),
		},
		walls: {
			[utils.asGridCoords(0,3)] : true,
			[utils.asGridCoords(1,3)] : true,
			[utils.asGridCoords(2,3)] : true,
			[utils.asGridCoords(3,3)] : true,
			[utils.asGridCoords(4,3)] : true,
			[utils.asGridCoords(5,3)] : true,
			[utils.asGridCoords(6,3)] : true,
			[utils.asGridCoords(7,3)] : true,
			[utils.asGridCoords(8,3)] : true,
			[utils.asGridCoords(9,3)] : true,
			[utils.asGridCoords(10,3)] : true,
			[utils.asGridCoords(11,3)] : true,
			[utils.asGridCoords(0,1)] : true,
			[utils.asGridCoords(0,2)] : true,
			[utils.asGridCoords(0,4)] : true,
			[utils.asGridCoords(0,5)] : true,
			[utils.asGridCoords(0,6)] : true,
			[utils.asGridCoords(0,7)] : true,
			[utils.asGridCoords(0,8)] : true,
			[utils.asGridCoords(0,9)] : true,
			[utils.asGridCoords(0,10)] : true,
			[utils.asGridCoords(0,11)] : true,
			[utils.asGridCoords(0,12)] : true,
			[utils.asGridCoords(1,12)] : true,
			[utils.asGridCoords(2,12)] : true,
			[utils.asGridCoords(3,12)] : true,
			[utils.asGridCoords(4,12)] : true,
			[utils.asGridCoords(5,13)] : true,
			[utils.asGridCoords(6,13)] : true,
			[utils.asGridCoords(7,12)] : true,
			[utils.asGridCoords(8,12)] : true,
			[utils.asGridCoords(9,12)] : true,
			[utils.asGridCoords(10,12)] : true,
			[utils.asGridCoords(11,12)] : true,
			[utils.asGridCoords(11,4)] : true,
			[utils.asGridCoords(12,5)] : true,
			[utils.asGridCoords(11,6)] : true,
			[utils.asGridCoords(11,7)] : true,
			[utils.asGridCoords(11,8)] : true,
			[utils.asGridCoords(11,9)] : true,
			[utils.asGridCoords(11,10)] : true,
			[utils.asGridCoords(11,11)] : true,
			[utils.asGridCoords(11,12)] : true,
			[utils.asGridCoords(1,4)] : true,
			[utils.asGridCoords(3,4)] : true,
			[utils.asGridCoords(4,4)] : true,
			[utils.asGridCoords(5,4)] : true,
			[utils.asGridCoords(6,4)] : true,
			[utils.asGridCoords(7,4)] : true,
			[utils.asGridCoords(9,4)] : true,
			[utils.asGridCoords(1,5)] : true,
			[utils.asGridCoords(1,6)] : true,
			[utils.asGridCoords(1,7)] : true,
		
			[utils.asGridCoords(4,6)] : true,
			[utils.asGridCoords(4,7)] : true,
			[utils.asGridCoords(1,11)] : true,
			[utils.asGridCoords(2,11)] : true,
			[utils.asGridCoords(3,11)] : true,

			[utils.asGridCoords(7,8)] : true,
			[utils.asGridCoords(7,9)] : true,
			[utils.asGridCoords(7,10)] : true,
			[utils.asGridCoords(8,7)] : true,
			[utils.asGridCoords(8,8)] : true,
			[utils.asGridCoords(8,9)] : true,
			[utils.asGridCoords(8,10)] : true,
			[utils.asGridCoords(9,8)] : true,
			[utils.asGridCoords(9,9)] : true,
			[utils.asGridCoords(9,10)] : true,
			[utils.asGridCoords(10,11)] : true,

		},
		cutsceneSpaces: {
			[utils.asGridCoords(5,12)]: [
				{
					events: [
						{type: "changeMap", map: "Hall",
						x: utils.widthGrid(12),
						y: utils.widthGrid(9),
						direction: "down"
					}
					]
				}
			],
			[utils.asGridCoords(6,12)]: [
				{
					events: [
						{type: "changeMap", map: "Hall",
						x: utils.widthGrid(13),
						y: utils.widthGrid(9),
						direction: "down"}
					]
				}
			],
			[utils.asGridCoords(11,5)]: [
				{
					events: [
						{type: "textMessage", text: "Закрыто."}
					]
				}
			]
		},
		objectCutsceneSpaces: {
			[utils.asGridCoords(9,4)]: [
				{
					events: [
						{type: "textMessage", text: "Цветочек Жора. Мамин любимый цветок."}
					]
				}
			],
			[utils.asGridCoords(6,4)]: [
				{
					events: [
						{type: "textMessage", text: "Книжный шкаф"}
					]
				}
			],
			[utils.asGridCoords(7,4)]: [
				{
					events: [
						{type: "textMessage", text: "Книжный шкаф"}
					]
				}
			],
			[utils.asGridCoords(3,11)]: [
				{
					events: [
						{type: "textMessage", text: "Мои подарки на день рождения"},
						{type: "textMessage", text: "Открою их позже"}
					]
				}
			],
		}
	},
	Hall: {
		id: "Hall",
		lowerSrc: "images/maps/hall_lower.png",
		upperSrc: "images/maps/hall_upper.png",
		gameObjects: {
			hero: new Person({
				isPlayerControlled: true,
				x: utils.widthGrid(12),
				y: utils.widthGrid(9),
				src: "images/characters/hero.png"
			}),
		},
		walls: {
			[utils.asGridCoords(3,8)] : true,
			[utils.asGridCoords(4,8)] : true,
			[utils.asGridCoords(4,7)] : true,
			[utils.asGridCoords(4,6)] : true,
			[utils.asGridCoords(3,5)] : true,
			[utils.asGridCoords(4,4)] : true,
			[utils.asGridCoords(5,3)] : true,
			[utils.asGridCoords(6,3)] : true,
			[utils.asGridCoords(7,3)] : true,
			[utils.asGridCoords(8,4)] : true,
			[utils.asGridCoords(8,5)] : true,
			[utils.asGridCoords(8,6)] : true,
			[utils.asGridCoords(8,7)] : true,
			[utils.asGridCoords(8,8)] : true,
			[utils.asGridCoords(9,8)] : true,
			[utils.asGridCoords(10,8)] : true,
			[utils.asGridCoords(11,8)] : true,
			[utils.asGridCoords(12,7)] : true,
			[utils.asGridCoords(13,7)] : true,
			[utils.asGridCoords(14,8)] : true,
			[utils.asGridCoords(15,8)] : true,
			[utils.asGridCoords(16,8)] : true,
			[utils.asGridCoords(17,8)] : true,
			[utils.asGridCoords(18,8)] : true,
			[utils.asGridCoords(19,8)] : true,
			[utils.asGridCoords(20,8)] : true,
			[utils.asGridCoords(21,8)] : true,
			[utils.asGridCoords(22,8)] : true,
			[utils.asGridCoords(23,8)] : true,
			[utils.asGridCoords(23,6)] : true,
			[utils.asGridCoords(23,7)] : true,
			[utils.asGridCoords(23,8)] : true,
			[utils.asGridCoords(23,9)] : true,
			[utils.asGridCoords(23,10)] : true,
			[utils.asGridCoords(23,11)] : true,
			[utils.asGridCoords(15,12)] : true,
			[utils.asGridCoords(16,12)] : true,
			[utils.asGridCoords(17,12)] : true,
			[utils.asGridCoords(18,12)] : true,
			[utils.asGridCoords(19,12)] : true,
			[utils.asGridCoords(20,12)] : true,
			[utils.asGridCoords(21,12)] : true,
			[utils.asGridCoords(22,12)] : true,

			[utils.asGridCoords(15,13)] : true,
			[utils.asGridCoords(15,14)] : true,
			[utils.asGridCoords(15,15)] : true,

			[utils.asGridCoords(14,16)] : true,
			[utils.asGridCoords(13,16)] : true,
			[utils.asGridCoords(12,16)] : true,
			[utils.asGridCoords(11,16)] : true,
			[utils.asGridCoords(10,12)] : true,
			[utils.asGridCoords(10,13)] : true,
			[utils.asGridCoords(10,14)] : true,
			[utils.asGridCoords(10,15)] : true,
			[utils.asGridCoords(1,12)] : true,
			[utils.asGridCoords(2,12)] : true,
			[utils.asGridCoords(3,12)] : true,
			[utils.asGridCoords(4,12)] : true,
			[utils.asGridCoords(5,12)] : true,
			[utils.asGridCoords(6,12)] : true,
			[utils.asGridCoords(7,12)] : true,
			[utils.asGridCoords(8,12)] : true,
			[utils.asGridCoords(9,12)] : true,
			[utils.asGridCoords(0,6)] : true,
			[utils.asGridCoords(0,7)] : true,
			[utils.asGridCoords(0,8)] : true,
			[utils.asGridCoords(0,9)] : true,
			[utils.asGridCoords(0,10)] : true,
			[utils.asGridCoords(0,11)] : true,
			[utils.asGridCoords(1,5)] : true,
			[utils.asGridCoords(2,5)] : true,
			[utils.asGridCoords(3,6)] : true,
			[utils.asGridCoords(3,7)] : true,
			[utils.asGridCoords(3,8)] : true,

			[utils.asGridCoords(3,9)] : true,
			[utils.asGridCoords(1,6)] : true,
			[utils.asGridCoords(2,6)] : true
		},
		cutsceneSpaces: {
			[utils.asGridCoords(13,8)]: [
				{
					events: [
						{type: "changeMap", map: "LivingRoom",
						x: utils.widthGrid(6),
						y: utils.widthGrid(11),
						direction: "up"}
					]
				}
			],
			[utils.asGridCoords(12,8)]: [
				{
					events: [
						{type: "changeMap", map: "LivingRoom",
						x: utils.widthGrid(5),
						y: utils.widthGrid(11),
						direction: "up"}
					]
				}
			],
			[utils.asGridCoords(4,5)]: [
				{
					events: [
						{type: "changeMap", map: "Kitchen",
						x: utils.widthGrid(4),
						y: utils.widthGrid(5),
						direction: "left"}
					]
				}
			],
			[utils.asGridCoords(1,7)]: [
				{
					events: [
						{type: "changeMap", map: "Hall2",
						x: utils.widthGrid(1),
						y: utils.widthGrid(8),
						direction: "up"}
					]
				}
			],
			[utils.asGridCoords(2,7)]: [
				{
					events: [
						{type: "changeMap", map: "Hall2",
						x: utils.widthGrid(2),
						y: utils.widthGrid(8),
						direction: "up"}
					]
				}
			],

		},
		objectCutsceneSpaces: {
			[utils.asGridCoords(18,8)]: [
				{
					events: [
						{type: "changeMap", map: "Bathroom",
						x: utils.widthGrid(1),
						y: utils.widthGrid(6),
						direction: "up"}
					]
				}
			],
			[utils.asGridCoords(12,16)]: [
				{
					events: [
						{type: "textMessage", text: "Я не могу покинуть дом"}
					]
				}
			],
			[utils.asGridCoords(13,16)]: [
				{
					events: [
						{type: "textMessage", text: "Я не могу покинуть дом"}
					]
				}
			]
		}
	}, 
	Kitchen: {
		id: "Kitchen",
		lowerSrc: "images/maps/kitchen_lower.png",
		upperSrc: "images/maps/kitchen_upper.png",
		gameObjects: {
			hero: new Person({
				isPlayerControlled: true,
				x: utils.widthGrid(4),
				y: utils.widthGrid(5),
				src: "images/characters/hero.png"
			}),
		},
		walls: {
			[utils.asGridCoords(0,4)] : true,
			[utils.asGridCoords(0,5)] : true,
			[utils.asGridCoords(0,6)] : true,
			[utils.asGridCoords(0,7)] : true,
			[utils.asGridCoords(0,8)] : true,
			[utils.asGridCoords(1,4)] : true,
			[utils.asGridCoords(2,4)] : true,
			[utils.asGridCoords(3,4)] : true,
			[utils.asGridCoords(4,4)] : true,
			[utils.asGridCoords(5,4)] : true,
			[utils.asGridCoords(6,5)] : true,
			[utils.asGridCoords(5,6)] : true,
			[utils.asGridCoords(5,7)] : true,
			[utils.asGridCoords(5,8)] : true,

			[utils.asGridCoords(1,9)] : true,
			[utils.asGridCoords(2,9)] : true,
			[utils.asGridCoords(3,9)] : true,
			[utils.asGridCoords(4,9)] : true,
			[utils.asGridCoords(2,6)] : true,
			[utils.asGridCoords(3,6)] : true,
			[utils.asGridCoords(3,9)] : true,
			[utils.asGridCoords(1,7)] : true,
			[utils.asGridCoords(2,7)] : true,
			[utils.asGridCoords(3,7)] : true,
			[utils.asGridCoords(2,8)] : true,
			[utils.asGridCoords(3,8)] : true,
		},
		cutsceneSpaces: {
			[utils.asGridCoords(5,5)]: [
				{
					events: [
						{type: "changeMap", map: "Hall",
						x: utils.widthGrid(5),
						y: utils.widthGrid(5),
						direction: "right"}
					]
				}
			]
		},
		objectCutsceneSpaces: {
			[utils.asGridCoords(1,4)]: [
				{
					events: [
						{type: "textMessage", text: "Холодильник."},
						{type: "textMessage", text: "Внутри много еды."}
					]
				}
			]
		}
	},
	Bathroom: {
		id: "Bathroom",
		lowerSrc: "images/maps/bathroom_lower.png",
		upperSrc: "images/maps/bathroom_upper.png",
		gameObjects: {
			hero: new Person({
				isPlayerControlled: true,
				x: utils.widthGrid(1),
				y: utils.widthGrid(6),
				src: "images/characters/hero.png"
			}),
		},
		walls: {
			[utils.asGridCoords(1,3)] : true,
			[utils.asGridCoords(2,3)] : true,
			[utils.asGridCoords(3,3)] : true,
			[utils.asGridCoords(4,4)] : true,
			[utils.asGridCoords(4,5)] : true,
			[utils.asGridCoords(4,6)] : true,
			[utils.asGridCoords(2,7)] : true,
			[utils.asGridCoords(3,7)] : true,
			[utils.asGridCoords(1,8)] : true,
			[utils.asGridCoords(0,7)] : true,
			[utils.asGridCoords(0,4)] : true,
			[utils.asGridCoords(0,5)] : true,
			[utils.asGridCoords(0,6)] : true,

			[utils.asGridCoords(1,4)] : true,
			[utils.asGridCoords(2,4)] : true,
			[utils.asGridCoords(3,5)] : true,
			[utils.asGridCoords(3,6)] : true,
		},
		cutsceneSpaces: {
			[utils.asGridCoords(1,7)]: [
				{
					events: [
						{type: "changeMap", map: "Hall",
						x: utils.widthGrid(18),
						y: utils.widthGrid(9),
						direction: "down"}
					]
				}
			]
		},
		objectCutsceneSpaces: {
			
		}
	},
	Hall2: {
		id: "Hall2",
		lowerSrc: "images/maps/hall2_lower.png",
		upperSrc: "images/maps/hall2_upper.png",
		gameObjects: {
			hero: new Person({
				isPlayerControlled: true,
				x: utils.widthGrid(1),
				y: utils.widthGrid(8),
				src: "images/characters/hero.png"
			}),
		},
		walls: {
			[utils.asGridCoords(0,4)] : true,
			[utils.asGridCoords(0,5)] : true,
			[utils.asGridCoords(0,6)] : true,
			[utils.asGridCoords(0,7)] : true,
			[utils.asGridCoords(0,8)] : true,
			[utils.asGridCoords(0,9)] : true,
			[utils.asGridCoords(1,3)] : true,
			[utils.asGridCoords(2,3)] : true,
			[utils.asGridCoords(3,3)] : true,
			[utils.asGridCoords(4,4)] : true,
			[utils.asGridCoords(5,5)] : true,
			[utils.asGridCoords(4,6)] : true,
			[utils.asGridCoords(4,7)] : true,
			[utils.asGridCoords(4,8)] : true,
			[utils.asGridCoords(1,10)] : true,
			[utils.asGridCoords(2,10)] : true,
			[utils.asGridCoords(3,9)] : true
		},
		cutsceneSpaces: {
			[utils.asGridCoords(1,9)]: [
				{
					events: [
						{type: "changeMap", map: "Hall",
						x: utils.widthGrid(1),
						y: utils.widthGrid(8),
						direction: "down"}
					]
				}
			],
			[utils.asGridCoords(2,9)]: [
				{
					events: [
						{type: "changeMap", map: "Hall",
						x: utils.widthGrid(2),
						y: utils.widthGrid(8),
						direction: "down"}
					]
				}
			]
		},
		objectCutsceneSpaces: {
			[utils.asGridCoords(2,3)]: [
				{
					events: [
						{type: "changeMap", map: "HeroRoom",
						x: utils.widthGrid(2),
						y: utils.widthGrid(7),
						direction: "up"}
					]
				}
			]
		}
	},
	HeroRoom: {
		id: "HeroRoom",
		lowerSrc: "images/maps/heroroom_lower.png",
		upperSrc: "images/maps/heroroom_upper.png",
		gameObjects: {
			hero: new Person({
				isPlayerControlled: true,
				x: utils.widthGrid(2),
				y: utils.widthGrid(7),
				src: "images/characters/hero.png"
			}),
		},
		walls: {
			[utils.asGridCoords(1,3)] : true,
			[utils.asGridCoords(2,3)] : true,
			[utils.asGridCoords(3,3)] : true,
			[utils.asGridCoords(4,3)] : true,
			[utils.asGridCoords(5,3)] : true,
			[utils.asGridCoords(6,3)] : true,
			[utils.asGridCoords(7,3)] : true,
			[utils.asGridCoords(8,3)] : true,
			[utils.asGridCoords(0,4)] : true,
			[utils.asGridCoords(0,5)] : true,
			[utils.asGridCoords(0,6)] : true,
			[utils.asGridCoords(0,7)] : true,

			[utils.asGridCoords(9,4)] : true,
			[utils.asGridCoords(9,5)] : true,
			[utils.asGridCoords(9,6)] : true,
			[utils.asGridCoords(9,7)] : true,
			[utils.asGridCoords(9,8)] : true,
			[utils.asGridCoords(9,8)] : true,
			[utils.asGridCoords(1,8)] : true,
			[utils.asGridCoords(2,9)] : true,
			[utils.asGridCoords(3,8)] : true,
			[utils.asGridCoords(4,8)] : true,
			[utils.asGridCoords(5,8)] : true,
			[utils.asGridCoords(6,8)] : true,
			[utils.asGridCoords(7,8)] : true,
			[utils.asGridCoords(8,8)] : true,

			[utils.asGridCoords(1,4)] : true,
			[utils.asGridCoords(2,4)] : true,
			[utils.asGridCoords(3,4)] : true,
			[utils.asGridCoords(5,4)] : true,
			[utils.asGridCoords(6,4)] : true,
			[utils.asGridCoords(7,4)] : true,
			[utils.asGridCoords(8,4)] : true,
			[utils.asGridCoords(2,5)] : true,
			[utils.asGridCoords(5,5)] : true,
			[utils.asGridCoords(6,5)] : true,
		},
		cutsceneSpaces: {
			[utils.asGridCoords(2,8)]: [
				{
					events: [
						{type: "changeMap", map: "Hall2",
						x: utils.widthGrid(2),
						y: utils.widthGrid(4),
						direction: "down"}
					]
				}
			]
		},
		objectCutsceneSpaces: {
			
		}
	},
}