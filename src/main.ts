import "./style.css";
import "./styles/scrollbar.css";
import "./styles/score.css";
import "./styles/test.css";

import ZEngine from "@fukutotojido/z-engine";
import BeatmapHandler from "./handler/BeatmapHandler";
import ChatHandler from "./handler/ChatHandler";
import TeamHandler from "./handler/TeamHandler";
import Test from "./Test";
import ScoreHandler from "./handler/ScoreHandler";
import GameStateHandler from "./handler/GameStateHandler";
import MappoolHandler from "./handler/MappoolHandler";
import AmpHandler from "./handler/AmpHandler";

const engine = new ZEngine("ws://127.0.0.1:24050/ws");
const test = new Test(engine);

const ampHandler = new AmpHandler(engine);
await ampHandler.init();

const beatmapHandler = new BeatmapHandler(engine);
const chatHandler = new ChatHandler(engine, test);
const teamHandler = new TeamHandler(engine);
const scoreHandler = new ScoreHandler(engine, ampHandler, test);
const gameStateHandler = new GameStateHandler(engine, test);
new MappoolHandler();

test.assign({
	beatmapHandler,
	chatHandler,
	teamHandler,
	scoreHandler,
    gameStateHandler
});
