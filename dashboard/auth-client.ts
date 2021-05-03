
const OAuthClient = require('disco-oauth');
import {config} from "../src/PandaBot";
const authClient = new OAuthClient(config.CLIENT_ID, config.CLIENT_SECRET);

authClient.setRedirect(`${config.DASHBOARD_URL}`);
authClient.setScopes('identify', 'guilds');

export default authClient;