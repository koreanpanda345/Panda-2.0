import express from "express";
import { RSA_NO_PADDING } from "node:constants";
import { cache, config } from "../src/PandaBot";
import { Commands } from "../src/types/Commands";
///@ts-ignore
import authClient from "./auth-client";

const app = express();

app.use(express.static(`${__dirname}/assets`));
app.locals.basedir = `${__dirname}/assets`;
app.set("views", __dirname + "/views");
``;
app.set("view engine", "pug");


//#region Auth Routes

app.get('/login', (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&redirect_uri=${config.DASHBOARD_URL}&response_type=code&scope=identify guilds`);
});

app.get('/auth', async (req, res) => {
  const code = req.query.code;
  const key = await authClient.getAccess(code);
  res.send(key);
})

//#endregion


//#region Root Routes

app.get("/", (req, res) => res.render("index"));

app.get("/commands", (req, res) => {
  const categories: {name: string, icon: string}[] = [];
  const icons:{[key: string]: string} = {
	  "Moderation": "fas fa-id-badge",
	  "Fun": "fas fa-gamepad",
	  "Dev": "fas fa-tv",
	  "Settings": "fas fa-cogs",
	  "Music": "fas fa-music",
	  "Reaction Roles": "fas fa-list"
  };

  const commands: {[key: string]: Commands[]} = {};
  cache.commands.forEach((cmd) => {
    if (categories.find(x => x.name === cmd.category as string) === undefined) {
      categories.push({name: cmd.category as string, icon: icons[cmd.category as string]});
	  commands[cmd.category as string] = [];
	}
  });

  cache.commands.forEach(cmd => {
	  commands[cmd.category as string].push(cmd);
  })
  res.render("commands", {
    subtitle: "Commands",
    categories: categories,
	commands
  });
});


//#endregion

// 404 Error Page
app.get("*", (req, res) => res.render('errors/404.pug'))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is live on port ${port}`));
