const { APP_PORT, APP_ADDRESS, APP_ENV } = process.env;
const code = require("../config/code");

const errorOriginal = {};

for (const _code in code) {
  const item = code[_code];
  errorOriginal[item] = {
    type: _code,
  };
}
const TOKEN_NAME = "JwtToken";

module.exports = {
  routePrefix: "/docs",
  exposeRoute: true,
  swagger: {
    info: {
      title: "Member Manager App",
      description: "Api of Member Manager App",
      version: "1.0.0",
    },
    schemes: APP_ENV === "local" ? ["http"] : ["https", "http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    definitions: {
      "Error Code Original": {
        type: "object",
        properties: errorOriginal,
      },
      "Account Login": {
        type: "object",
        description: "Dùng để đăng nhập",
        properties: {
          username: { type: "super_admin@gmail.com" },
          password: { type: "Wall68@14" },
          password_md5: { type: "a74b1df602d18358af7f6d03360d7060" },
        },
      },
    },
  },
};
