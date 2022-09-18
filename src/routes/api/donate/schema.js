const tags = ["Donate"];

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

const createDonateSchema = {
  tags,
  headers,
  body: {
    type: "object",
    properties: {
      member_id: {
        type: "number",
      },
      donate: {
        type: "number",
      },
    },
  },
};
const updateDonateSchema = {
  tags,
  headers,
  body: {
    type: "object",
    properties: {
      member_id: {
        type: "number",
      },
      donate: {
        type: "number",
      },
    },
  },
  params: {
    type: "object",
    properties: {
      id: { type: "number" },
    },
  },
};
const getDonateByIdSchema = {
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
const listDonateSchema = {
  tags,
  headers,
};

module.exports = {
  createDonateSchema,
  updateDonateSchema,
  getDonateByIdSchema,
  listDonateSchema,
};
