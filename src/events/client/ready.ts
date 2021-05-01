import { createEvent } from "../../utils/helpers";
import { client } from "../../constants/client";


createEvent({
	name: "ready",
	async invoke() {
		console.log(`${client.user?.username} is ready`);
		await client.user?.setStatus("dnd");
		await client.user?.setActivity({name: "Bamboo Simluator", type: "PLAYING"});
	}
});