import {config} from "dotenv";
import { PandaBot } from "./PandaBot";

config();

const bot = new PandaBot();


bot.start();