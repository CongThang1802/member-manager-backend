module.exports = {
  createMemberRules: {
    full_name: "required|string|maxLength:255",
    avatar: "string|maxLength:255",
    address: "string|maxLength:255",
    gender: "required|in:0,1",
    phone: "required|string|maxLength:255",
    expiry_date: "integer",
    identity_card_number: "required|integer",
  },
  updateMemberRules: {
    full_name: "string|maxLength:255",
    avatar: "string|maxLength:255",
    address: "string|maxLength:255",
    qrcode: "string|maxLength:255",
    gender: "in:0,1",
    phone: "string|maxLength:255",
    expiry_date: "integer",
    identity_card_number: "integer",
    status: "in:0,1,2",
    level: "in:0,1,2",
  },
  getByIdRules: {
    member_id: "required|string|maxLength:255",
  },
  loginMemberRules: {
    phone: "required|string|maxLength:255",
    password: "required|minLength:8|maxLength:50",
  },
  changPassMemberRules: {
    phone: "required|string|maxLength:255",
    password: "required|minLength:8|maxLength:50",
    new_password: "required|minLength:8|maxLength:50",
  },
};
