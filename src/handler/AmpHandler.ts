import axios from "axios";
import type { Amp, Buff, TeamAmp } from "../ampsList";
import type ZEngine from "@fukutotojido/z-engine";

import { ampsList } from "../ampsList";
import type IPCClient from "./IPCClient";

export default class AmpHandler {
	engine: ZEngine;
	teams?: TeamAmp[];

	containerLeft: HTMLDivElement | null = null;
	containerRight: HTMLDivElement | null = null;

	ampsLeft: Amp[] = [];
	ampsRight: Amp[] = [];

	currentAmpLeft?: Amp;
	currentAmpRight?: Amp;

	customMult = 1;

	constructor(engine: ZEngine) {
		this.engine = engine;
		this.containerLeft = document.querySelector<HTMLDivElement>("#ampsLeft");
		this.containerRight = document.querySelector<HTMLDivElement>("#ampsRight");

		this.engine.register_jq(
			".tourney?.manager?.teamName | tostring",
			(_, __, data) => {
				const teamLeft = data.tourney.manager.teamName.left;
				const teamRight = data.tourney.manager.teamName.right;

				this.updateTeam(teamLeft, teamRight);
			},
		);

		const instance = this;
		document
			.querySelector<HTMLInputElement>("#customScoreMult")
			?.addEventListener("change", function () {
				instance.customMult = +this.value;
				console.log(instance.customMult);
			});

		document
			.querySelector<HTMLButtonElement>("#resetLeft")
			?.addEventListener("click", () => {
				for (const ele of document.querySelectorAll<HTMLInputElement>(
					"[name=amp-left]",
				)) {
					ele.checked = false;
				}
				this.currentAmpLeft = undefined;
				const ele = document.querySelector<HTMLDivElement>("#leftAmpIcon");
				if (ele) {
					ele.style.aspectRatio = "";
					ele.style.backgroundImage = ""
				} 
			});

		document
			.querySelector<HTMLButtonElement>("#resetRight")
			?.addEventListener("click", () => {
				for (const ele of document.querySelectorAll<HTMLInputElement>(
					"[name=amp-right]",
				)) {
					ele.checked = false;
				}
				this.currentAmpRight = undefined;
				const ele = document.querySelector<HTMLDivElement>("#rightAmpIcon");
				if (ele) {
					ele.style.aspectRatio = "";
					ele.style.backgroundImage = ""
				} 
			});
	}

	async init() {
		const json: TeamAmp[] = (await axios.get("./team.json")).data;
		this.teams = json;
	}

	updateTeam(teamLeft: string, teamRight: string) {
		if (!this.teams) return;
		if (!this.containerLeft || !this.containerRight) return;

		this.containerLeft.innerHTML = "";
		this.containerRight.innerHTML = "";

		const ampsIdLeft =
			this.teams.find((team) => team.name === teamLeft)?.ampsList ?? [];
		const ampsIdRight =
			this.teams.find((team) => team.name === teamRight)?.ampsList ?? [];

		this.ampsLeft = [...new Set([...ampsIdLeft, ...ampsIdRight])].reduce((accm, curr) => {
			const amp = ampsList.find((amp) => amp.id === curr);
			if (amp) accm.push(amp);
			return accm;
		}, [] as Amp[]);

		this.ampsRight = [...new Set([...ampsIdLeft, ...ampsIdRight])].reduce((accm, curr) => {
			const amp = ampsList.find((amp) => amp.id === curr);
			if (amp) accm.push(amp);
			return accm;
		}, [] as Amp[]);

		const elementsLeft = this.ampsLeft.map((amp) => {
			const ele = document.createElement("div");
			ele.classList.add("flex", "items-center", "gap-2.5");
			ele.innerHTML = `
			    <input type="radio" name="amp-left" id="amp-left-${amp.id}" value="${amp.id}"
			    	class="appearance-none w-5 h-5 rounded-full border-2 border-surface-0 checked:border-text before:content-['_'] before:transition-all before:w-0 before:h-0 checked:before:w-2.5 checked:before:h-2.5 before:rounded-full before:block before:bg-text flex items-center justify-center transition-all">
			    <label for="amp-left-${amp.id}">${amp.name}</label>
            `;

			ele
				.querySelector<HTMLInputElement>("input")
				?.addEventListener("change", () => {
					this.changeAmp(amp.id, "left");
				});

			return ele;
		});

		const elementsRight = this.ampsRight.map((amp) => {
			const ele = document.createElement("div");
			ele.classList.add("flex", "items-center", "gap-2.5");
			ele.innerHTML = `
			    <input type="radio" name="amp-right" id="amp-right-${amp.id}" value="${amp.id}"
			    	class="appearance-none w-5 h-5 rounded-full border-2 border-surface-0 checked:border-text before:content-['_'] before:transition-all before:w-0 before:h-0 checked:before:w-2.5 checked:before:h-2.5 before:rounded-full before:block before:bg-text flex items-center justify-center transition-all">
			    <label for="amp-right-${amp.id}">${amp.name}</label>
            `;

			ele
				.querySelector<HTMLInputElement>("input")
				?.addEventListener("change", () => {
					this.changeAmp(amp.id, "right");
				});

			return ele;
		});

		this.containerLeft.append(...elementsLeft);
		this.containerRight.append(...elementsRight);
	}

	changeAmp(id: string, side: "left" | "right") {
		const amp =
			side === "left"
				? this.ampsLeft.find((amp) => amp.id === id)
				: side === "right"
					? this.ampsRight.find((amp) => amp.id === id)
					: null;

		if (!amp) return;
		if (side === "left") {
			this.currentAmpLeft = amp;

			const ele = document.querySelector<HTMLDivElement>("#leftAmpIcon");
			if (ele) {
				ele.style.aspectRatio = "1 / 1";
				ele.style.backgroundImage = `url('https://s.hoaq.works/${amp.id}.png')`;
			}
		}
		if (side === "right") {
			this.currentAmpRight = amp;

			const ele = document.querySelector<HTMLDivElement>("#rightAmpIcon");
			if (ele) {
				ele.style.aspectRatio = "1 / 1";
				ele.style.backgroundImage = `url('https://s.hoaq.works/${amp.id}.png')`;
			}
		}

		console.log(this.currentAmpLeft, this.currentAmpRight);
	}

	processBuff(
		scores: number[],
		buffs: (number | Buff | undefined)[],
		clients: IPCClient[],
	) {
		let s = scores;
        // console.log(buffs);
		for (const buff of buffs) {
			if (typeof buff === "number") {
				s = s.map((score) => score * buff);
				continue;
			}

			if (buff === undefined) {
				continue;
			}

			const b: Buff = buff as Buff;
			const val = typeof b.value !== "number" ? this.customMult : b.value;

			switch (b.type) {
				case "all": {
					s = s.map((score) => score * val);
					break;
				}
				case "min": {
					let i = 0;
					let min = scores[0];

					for (let j = 0; j < scores.length; j++) {
						if (scores[j] >= min) continue;
						min = scores[j];
						i = j;
					}

					s[i] = s[i] * val;
					break;
				}
				case "max": {
					let i = 0;
					let max = scores[0];

					for (let j = 0; j < scores.length; j++) {
						if (scores[j] < max) continue;
						max = scores[j];
						i = j;
					}

					s[i] = s[i] * val;
					break;
				}
				case "selected": {
					const selected = clients
						.map((client, idx) => (client.selectedForCustom ? idx : null))
						.filter((idx) => idx !== null);
					for (const idx of selected) {
						s[idx] = s[idx] * val;
					}
					break;
				}
			}
		}

        // console.log(s);
		return s;
	}

	applyScoreWithAmp(
		scoresLeft: number[],
		scoresRight: number[],
		clients: IPCClient[],
	) {
		const obj = {
			left: 0,
			right: 0,
		};

		if (!this.teams) return obj;

		const leftBuffs = [
			this.currentAmpLeft?.buff?.self,
			this.currentAmpRight?.buff?.opp,
		];
		const rightBuffs = [
			this.currentAmpRight?.buff?.self,
			this.currentAmpLeft?.buff?.opp,
		];

		const lefts = this.processBuff(
			scoresLeft,
			leftBuffs,
			clients.filter((_, idx) => idx < clients.length / 2),
		);
		const rights = this.processBuff(
			scoresRight,
			rightBuffs,
			clients.filter((_, idx) => idx >= clients.length / 2),
		);

		return {
			left: lefts.reduce((accm, curr) => {
				return accm + curr;
			}, 0),
            right: rights.reduce((accm, curr) => {
				return accm + curr;
			}, 0),
		};
	}
}
