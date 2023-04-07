module.exports = {
  apps: [
    {
      name: "next-store-be",
      script: "src/index.ts",
      watch: true,
      // Delay between restart
      watch_delay: 500,
      ignore_watch: ["node_modules"],
    },
  ],
};
