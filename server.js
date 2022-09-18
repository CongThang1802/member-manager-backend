require("dotenv").config();

const { build } = require("./src/app");

const { APP_PORT, APP_ADDRESS } = process.env;

build().then((app) => {
  // run the server!

  app.listen({ port: APP_PORT, host: APP_ADDRESS }, (err, address) => {
    if (err) {
      console.log(err);
      app.log.error(err);
      process.exit(1);
    }
    console.log(
      `server listening on ${address} - environment ${process.env.APP_ENV}`
    );
    app.log.info(`server listening on ${address}`);

    process.on("SIGINT", () => app.close());
    process.on("SIGTERM", () => app.close());
  });
});
