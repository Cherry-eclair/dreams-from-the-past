class PauseMenu {
	constructor({progress, onComplete}) {
		this.progress = progress;
		this.onComplete = onComplete;
	}

	getOptions(pageKey) {

		if (pageKey === "root") {
			return [
			{
				label: "Сохранить",
				description: "Сохранить прогресс",
				handler: () => {
					this.progress.save();
					this.close();
				}
			},
			{
				label: "Закрыть",
				description: "Закрыть меню паузы",
				handler: () => {
					this.close();
				}
			}
			]
		}

		return [];
	}

	createElement() {
		this.element = document.createElement("div");
    	this.element.classList.add("PauseMenu");
    	this.element.innerHTML = (`
    		<h2>Пауза</h2>
    	`)
	}

	close() {
		this.esc?.unbind();
		this.keyboardMenu.end();
		this.element.remove();
		this.onComplete();
	}

	async init(container) {
		this.createElement();
		this.keyboardMenu = new KeyboardMenu({
			descriptionContainer: container
		})
		this.keyboardMenu.init(this.element);
		this.keyboardMenu.setOptions(this.getOptions("root"));

		container.appendChild(this.element);

		utils.wait(200);
		this.esc = new KeyPressListener("Escape", () => {
			this.close();
		})
	}
}