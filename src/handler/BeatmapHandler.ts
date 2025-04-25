import type ZEngine from "@fukutotojido/z-engine";
import axios from "axios";
import { BeatmapDecoder } from 'osu-parsers';
import { StandardRuleset } from 'osu-standard-stable';
import type { Data } from "@fukutotojido/z-engine";

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
		// {
		// 	id: "CS",
		// 	key: "menu.bm.stats.CS",
		// },
		// {
		// 	id: "AR",
		// 	key: "menu.bm.stats.AR",
		// },
		// {
		// 	id: "OD",
		// 	key: "menu.bm.stats.OD",
		// },
		// {
		// 	id: "BPM",
		// 	key: "menu.bm.stats.BPM.common",
		// },
		// {
		// 	id: "SR",
		// 	key: "menu.bm.stats.fullSR",
		// },
		// {
		// 	id: "length",
		// 	key: "menu.bm.time.full",
		// },
		{
			id: "metadata",
			key: "menu.bm.path.full",
		}
	];

	decoder: BeatmapDecoder;
	ruleset: StandardRuleset;

	constructor(engine: ZEngine, mappoolJson: Data) {
		this.decoder = new BeatmapDecoder();
		this.ruleset = new StandardRuleset();

		engine.register("menu.bm.path.file", async (_, newValue, data) => {
			let _mod = "";
			for (const { mod, maps } of mappoolJson.mappool) {
				if (maps.includes(data.menu.bm.id)) {
					_mod = mod;
					break; 
				}
			};

			const mods = this.ruleset.createModCombination(_mod);
			try {
				const { data: raw } = await axios.get(`http://127.0.0.1:24050/Songs/${encodeURIComponent(newValue)}`);
				const parsed = this.decoder.decodeFromString(raw, false);
				const calc = this.ruleset.createDifficultyCalculator(parsed);
				const beatmap = this.ruleset.applyToBeatmapWithMods(parsed, mods);
				const diff = calc.calculateWithMods(mods);

				const CS = beatmap.difficulty.circleSize;
				const AR = beatmap.difficulty.approachRate;
				const OD = beatmap.difficulty.overallDifficulty;
				const SR = diff.starRating;
				const length = this.toMinutes(beatmap.length);
				const BPM = beatmap.bpm;

				const CSElement = document.querySelector<HTMLDivElement>("#CS");
				if (CSElement) CSElement.innerText = CS.toFixed(1);

				const ARElement = document.querySelector<HTMLDivElement>("#AR");
				if (ARElement) ARElement.innerText = AR.toFixed(1);

				const ODElement = document.querySelector<HTMLDivElement>("#OD");
				if (ODElement) ODElement.innerText = OD.toFixed(1);

				const SRElement = document.querySelector<HTMLDivElement>("#SR");
				if (SRElement) SRElement.innerText = SR.toFixed(2);

				const BPMElement = document.querySelector<HTMLDivElement>("#BPM");
				if (BPMElement) BPMElement.innerText = BPM.toFixed(0);

				const LengthElement = document.querySelector<HTMLDivElement>("#length");
				if (LengthElement) LengthElement.innerText = length;

			} catch (e) { 
				console.error(e);
			}
		})

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
