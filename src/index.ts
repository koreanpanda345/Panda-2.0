import {config} from "dotenv";
import { PandaBot } from "./PandaBot";

config();
require('./../dashboard/server');

const bot = new PandaBot();


bot.start();

