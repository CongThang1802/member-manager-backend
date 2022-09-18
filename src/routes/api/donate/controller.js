const donateService = require("../../../services/DonateService");
module.exports = function (app) {
  const DonateService = new donateService(app);
  return {
    createDonate: async (request, reply) => {
      const { body } = request;
      const [status, code, data] = await DonateService.createDonate({ body });
      return {
        status,
        code,
        msg: status ? "success" : "failed",
        data,
      };
    },
    updateDonate: async (request, reply) => {
      const { body, params } = request;
      const [status, code, data] = await DonateService.updateDonate({
        body,
        params,
      });
      return {
        status,
        code,
        msg: status ? "success" : "failed",
        data,
      };
    },
    getDonateById: async (request, reply) => {
      const { params } = request;
      const [status, code, data] = await DonateService.getDonateById({
        params,
      });
      return {
        status,
        code,
        msg: status ? "success" : "failed",
        data,
      };
    },
    listDonate: async (request, reply) => {
      const { query } = request;
      const [status, code, data] = await DonateService.listDonate({ query });
      return {
        status,
        code,
        msg: status ? "success" : "failed",
        data,
      };
    },
  };
};
