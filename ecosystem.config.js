// Run from the backend release directory using Node 22.
// Set FEE_ORIGIN to the public FRONTEND origin before starting PM2.
// Database credentials remain in server/private/connection.json.
module.exports = {
	apps: [
		{
			name: "horizon-fees-api",
			cwd: __dirname,
			script: "./server/index.cjs",
			interpreter: process.execPath,
			exec_mode: "fork",
			instances: 1,
			autorestart: true,
			watch: false,
			restart_delay: 5000,
			max_memory_restart: "300M",
			kill_timeout: 10000,
			time: true,
			env: {
				NODE_ENV: "production",
				FEE_HOST: "127.0.0.1",
				FEE_PORT: "5302",
				FEE_ORIGIN: process.env.FEE_ORIGIN || "https://fees.horizon.sa.edu.au",
			},
		},
	],
};
