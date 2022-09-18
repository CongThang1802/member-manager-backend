const tags = ["Member"];

const headers = {
  type: "object",
  properties: {
    Authorization: {
      type: "string",
      description: "Bearer [token]",
    },
  },
  // required: ['authorization']
};

const createMemberSchema = {
  tags,
  headers,
  body: {
    type: "object",
    properties: {
      full_name: {
        type: "string",
      },
      avatar: {
        type: "string",
      },
      address: {
        type: "string",
      },
      gender: {
        type: "number",
      },
      phone: {
        type: "string",
      },
      expiry_date: {
        type: "number",
      },
      identity_card_number: {
        type: "number",
      },
    },
  },
};
const updateMemberSchema = {
  tags,
  headers,
  body: {
    type: "object",
    properties: {
      full_name: {
        type: "string",
      },
      avatar: {
        type: "string",
      },
      address: {
        type: "string",
      },
      qrcode: {
        type: "string",
      },
      gender: {
        type: "number",
      },
      phone: {
        type: "string",
      },
      expiry_date: {
        type: "number",
      },
      identity_card_number: {
        type: "number",
      },
      status: {
        type: "number",
      },
      level: {
        type: "number",
      },
    },
  },
  params: {
    type: "object",
    properties: {
      member_id: { type: "string" },
    },
  },
};
const getMemberByIdSchema = {
  tags,
  headers,
  params: {
    type: "object",
    properties: {
      member_id: {
        type: "string",
      },
    },
  },
};
const listMemberSchema = {
  tags,
  headers,
};
const loginMemberSchema = {
  tags,
  body: {
    type: "object",
    properties: {
      phone: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
    required: ["phone", "password"],
  },
};

const changePassMemberSchema = {
  tags,
  body: {
    type: "object",
    properties: {
      phone: {
        type: "string",
      },
      password: {
        type: "string",
      },
      new_password: {
        type: "string",
      },
    },
    required: ["phone", "password"],
  },
};
module.exports = {
  createMemberSchema,
  updateMemberSchema,
  getMemberByIdSchema,
  listMemberSchema,
  loginMemberSchema,
  changePassMemberSchema,
};
