const crypto = require("node:crypto");
const { connectDatabase } = require("./mongo.cjs");
process.stderr.write(
	"Enter the admin password on stdin (input is not stored):\n",
);
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
	input += chunk;
});
process.stdin.on("end", async () => {
	let client;
	try {
		const password = input.replace(/\r?\n$/, "");
		if (password.length < 12 || password.length > 256)
			throw new Error("Use a password from 12 to 256 characters.");
		const salt = crypto.randomBytes(32).toString("hex");
		const hash = crypto.scryptSync(password, salt, 64).toString("hex");
		const connection = await connectDatabase();
		client = connection.client;
		const username = process.env.FEE_ADMIN_USERNAME || "ict";
		await connection.db
			.collection("administrators")
			.insertOne({ _id: username, username, salt, hash });
		console.log(
			"Admin account created in MongoDB. Only its password hash was stored.",
		);
	} catch (error) {
		console.error(
			error.code === 11000
				? "Admin account already exists; it has not been changed."
				: error.message,
		);
		process.exitCode = 1;
	} finally {
		if (client) await client.close();
	}
});
