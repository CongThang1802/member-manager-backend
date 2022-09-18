module.exports = {
  createDonateRules: {
    member_id: "required|integer",
    donate: "required|integer",
  },
  updateDonateRules: {
    member_id: "integer",
    donate: "integer",
  },
  getByIdRules: {
    member_id: "required|string|maxLength:255",
  },
};
