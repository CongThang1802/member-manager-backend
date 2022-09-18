const apiRoutes = async (app) => {
  app.register(require("./auth"), { prefix: "auth" });
  app.register(require("./file"), { prefix: "file" });
  app.register(require("./member"), { prefix: "member" });
  app.register(require("./donate"), { prefix: "donate" });
};

module.exports = apiRoutes;
