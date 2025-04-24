import type ZEngine from "@fukutotojido/z-engine";

export default class BeatmapHandler {
	static map = [
		{
			id: "artist",
			key: "menu.bm.metadata.artist",
		},
		{
			id: "title",
			key: "menu.bm.metadata.title",
		},
		{
			id: "difficulty",
			key: "menu.bm.metadata.difficulty",
		},
		{
			id: "mapper",
			key: "menu.bm.metadata.mapper",
		},
		{
			id: "CS",
			key: "menu.bm.stats.CS",
		},
		{
			id: "AR",
			key: "menu.bm.stats.AR",
		},
		{
			id: "OD",
			key: "menu.bm.stats.OD",
		},
		{
			id: "BPM",
			key: "menu.bm.stats.BPM.common",
		},
		{
			id: "SR",
			key: "menu.bm.stats.fullSR",
		},
		{
			id: "length",
			key: "menu.bm.time.full",
		},
		{
			id: "metadata",
			key: "menu.bm.path.full",
		},
	];

	constructor(engine: ZEngine) {
		for (const value of BeatmapHandler.map) {
			const element: HTMLElement | null = document.querySelector(
				`#${value.id}`,
			);

			engine.register(value.key, (_, newValue) => {
				if (element === null) return;
				switch (value.id) {
					case "CS":
					case "AR":
					case "OD": {
						if (typeof newValue !== "number") break;
						element.innerText = newValue.toFixed(1);

						break;
					}
					case "SR": {
						if (typeof newValue !== "number") break;
						element.innerText = newValue.toFixed(2);
						break;
					}
					case "length": {
						if (typeof newValue !== "number") break;
						element.innerText = this.toMinutes(newValue);
						break;
					}
					case "metadata": {
						element.style.backgroundImage = `url("http://127.0.0.1:24050/Songs/${encodeURIComponent(newValue)}")`;
						break;
					}
					default: {
						element.innerText = newValue;
						break;
					}
				}
			});
		}
	}

	private toMinutes(miliseconds: number) {
		const seconds = Math.round(miliseconds / 1000);
		const minutes = Math.floor(seconds / 60);

		return `${minutes.toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
	}
}
