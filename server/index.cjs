const { createApp } = require("./app.cjs");
const { connectDatabase, createMongoStore } = require("./mongo.cjs");
async function start() {
	const secure = process.env.NODE_ENV === "production";
	const port = Number(process.env.FEE_PORT || (secure ? 5302 : 3001));
	const origins = secure
		? [process.env.FEE_ORIGIN]
		: [
				"http://127.0.0.1:3000",
				"http://localhost:3000",
				"http://127.0.0.1:3001",
			];
	if (secure && !/^https:\/\//.test(origins[0] || ""))
		throw new Error("Set FEE_ORIGIN to the public HTTPS origin.");
	const { client, db } = await connectDatabase();
	const store = await createMongoStore(db);
	const auth = () =>
		db
			.collection("administrators")
			.findOne({ _id: process.env.FEE_ADMIN_USERNAME || "ict" });
	const server = createApp({ store, auth, origins, secure });
	server.listen(
		port,
		process.env.FEE_HOST || "127.0.0.1",
		() =>
			console.log(
				"Fee API connected to MongoDB; listening on port " +
					port,
			),
	);
	async function stop() {
		server.close();
		await client.close();
		process.exit(0);
	}
	process.on("SIGTERM", stop);
	process.on("SIGINT", stop);
}
start().catch((error) => {
	console.error("Fee API could not start:", error.message);
	process.exit(1);
});
