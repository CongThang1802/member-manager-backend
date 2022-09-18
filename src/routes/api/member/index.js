const MemberController = require("./controller");
const {
  createMemberSchema,
  updateMemberSchema,
  getMemberByIdSchema,
  listMemberSchema,
  loginMemberSchema,
  changePassMemberSchema,
} = require("./schema");
const {
  createMemberRules,
  updateMemberRules,
  getByIdRules,
  loginMemberRules,
  changPassMemberRules,
} = require("./validation");
const memberRoutes = async (app, options) => {
  const memberController = MemberController(app);
  app.post(
    "/create",
    {
      schema: createMemberSchema,
      preValidation: [
        // app.authenticated,
        app.validate(createMemberRules),
      ],
    },
    memberController.createMember
  );
  app.put(
    "/update/:id",
    {
      schema: updateMemberSchema,
      preValidation: [
        // app.authenticated,
        app.validate(updateMemberRules),
        app.validate(getByIdRules, "params"),
      ],
    },
    memberController.updateMember
  );
  app.get(
    "/:member_id",
    {
      schema: getMemberByIdSchema,
      preValidation: [
        // app.authenticated,
        app.validate(getByIdRules, "params"),
      ],
    },
    memberController.getMemberById
  );
  app.get(
    "/",
    {
      schema: listMemberSchema,
      preValidation: [
        // app.authenticated,
      ],
    },
    memberController.listMember
  );
  app.post(
    "/login",
    {
      schema: loginMemberSchema,
      preValidation: [app.validate(loginMemberRules)],
    },
    memberController.loginMember
  );
  app.post(
    "/change-pass",
    {
      schema: changePassMemberSchema,
      preValidation: [app.validate(changPassMemberRules)],
    },
    memberController.loginMember
  );
};

module.exports = memberRoutes;
