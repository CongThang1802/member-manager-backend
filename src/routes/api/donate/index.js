const DonateController = require("./controller");
const {
  createDonateSchema,
  updateDonateSchema,
  getDonateByIdSchema,
  listDonateSchema,
} = require("./schema");
const {
  getByIdRules,
  createDonateRules,
  updateDonateRules,
} = require("./validation");
const memberRoutes = async (app, options) => {
  const donateController = DonateController(app);
  app.post(
    "/create",
    {
      schema: createDonateSchema,
      preValidation: [app.authenticated, app.validate(createDonateRules)],
    },
    donateController.createDonate
  );
  app.put(
    "/update/:id",
    {
      schema: updateDonateSchema,
      preValidation: [
        app.authenticated,
        app.validate(updateDonateRules),
        app.validate(getByIdRules, "params"),
      ],
    },
    donateController.updateDonate
  );
  app.get(
    "/:member_id",
    {
      schema: getDonateByIdSchema,
      preValidation: [app.authenticated, app.validate(getByIdRules, "params")],
    },
    donateController.getDonateById
  );
  app.get(
    "/",
    {
      schema: listDonateSchema,
      preValidation: [app.authenticated],
    },
    donateController.listDonate
  );
};

module.exports = memberRoutes;
