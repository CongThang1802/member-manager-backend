const Service = require("./Service");
const nanoid = require("nanoid");
const qrcode = require("qrcode");

class MemberService extends Service {
  constructor(app) {
    super(app);
    this.memberRepository = this.getRepository("MemberRepository");
    this.companyCode = "HN";
    this.DAYS_EXPIRES = 7;
  }

  async createMember({ body }) {
    try {
      const {
        full_name,
        avatar,
        address,
        gender,
        phone,
        level,
        expiry_date,
        identity_card_number,
      } = body;
      const getMember = await this.memberRepository.get({ phone }).first();
      if (getMember) {
        return [
          false,
          this.getErrorCode("MEMBER_ALREADY_EXISTS", "MEMBER_ALREADY_EXISTS"),
        ];
      }
      let member_id;
      const lastMember = await this.memberRepository
        .get({ gender })
        .orderBy("member_id", "DESC")
        .first();
      if (lastMember) {
        const temp = Number(
          lastMember.member_id.replace(`${this.companyCode}`, "")
        );
        member_id = this.companyCode + `${temp + 1}`;
      } else {
        member_id =
          gender === 1
            ? this.companyCode + "10000001"
            : this.companyCode + "160000001";
      }
      const password = "honguyen2022";
      const result = await this.memberRepository.create({
        full_name,
        avatar: avatar ? avatar : "1077114",
        address,
        gender,
        phone,
        level,
        member_id,
        password,
        expiry_date,
        identity_card_number,
      });
      if (result) {
        return [true, 0, []];
      }
      return [
        false,
        this.getErrorCode("ERROR_CREATE_MEMBER"),
        "ERROR_CREATE_MEMBER",
      ];
    } catch (e) {
      console.log({ error: e });
      return [false, this.getErrorCode("OTHER"), []];
    }
  }

  async updateMember({ body, params }) {
    try {
      const { member_id } = params;
      const {
        full_name,
        avatar,
        address,
        gender,
        phone,
        level,
        expiry_date,
        identity_card_number,
        status,
        qrcode,
      } = body;
      const member = await this.memberRepository.getOneOrNull({ member_id });
      if (member) {
        const dataUpdate = {};
        if (full_name) {
          dataUpdate["full_name"] = full_name;
        }
        if (avatar) {
          dataUpdate["avatar"] = avatar;
        }
        if (address) {
          dataUpdate["address"] = address;
        }
        if (gender) {
          dataUpdate["gender"] = gender;
        }
        if (phone) {
          dataUpdate["phone"] = phone;
        }
        if (level) {
          dataUpdate["level"] = level;
        }
        if (expiry_date) {
          dataUpdate["expiry_date"] = expiry_date;
        }
        if (identity_card_number) {
          dataUpdate["identity_card_number"] = identity_card_number;
        }
        if (status) {
          dataUpdate["status"] = status;
        }
        if (qrcode) {
          dataUpdate["qrcode"] = qrcode;
        }
        if (this.isEmpty(dataUpdate)) {
          return [false, this.getErrorCode("NOT_FOUND"), []];
        }
        const data = await this.memberRepository
          .model()
          .where({ id })
          .update(dataUpdate);
        if (data) {
          return [true, 0, []];
        }
        return [
          false,
          this.getErrorCode("ERROR_UPDATE_MEMBER"),
          "ERROR_UPDATE_MEMBER",
        ];
      }
      return [false, this.getErrorCode("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND"];
    } catch (e) {
      console.log({ error: e });
      return [false, this.getErrorCode("OTHER"), []];
    }
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  async getMemberById({ params }) {
    try {
      const { member_id } = params;
      const data = await this.memberRepository.get({ member_id }).first();
      if (data) {
        return [true, 0, data];
      }
      return [true, 0, []];
    } catch (e) {
      console.log({ error: e });
      return [false, this.getErrorCode("OTHER"), []];
    }
  }

  async listMember({ query }) {
    try {
      let { page, limit, sort } = query;
      if (!limit) limit = 10;
      if (!page) page = 1;
      if (!sort) sort = "DESC";
      const data = await this.memberRepository
        .get()
        .orderBy("updated_at", `${sort}`)
        .paginate({
          perPage: limit,
          currentPage: page,
          isLengthAware: true,
        });
      if (data) {
        return [true, 0, data];
      }
      return [true, 0, []];
    } catch (e) {
      console.log({ error: e });
      return [false, this.getErrorCode("OTHER"), []];
    }
  }

  async loginMember({ phone, password }) {
    try {
      const queryBuilder = this.memberRepository
        .get({
          phone,
        })
        .first();
      let user = await queryBuilder;
      if (!user) {
        return [false, this.getErrorCode("USER_NOT_FOUND"), "USER_NOT_FOUND"];
      }
      const expiresIn = this.app.moment().add(this.DAYS_EXPIRES, "days").unix();
      if (this.app.bcrypt.compareSync(password, user.password)) {
        const token = this.app.jwt.sign({
          ...{
            id: user.id,
            phone: user.phone,
            member_id: user.member_id,
            full_name: user.full_name,
          },
          expiresIn,
        });
        const response = {
          token: token,
          expiresIn: expiresIn,
          user: {
            id: user.id,
            phone: user.phone,
            member_id: user.member_id,
            full_name: user.full_name,
          },
        };
        return [true, 0, [response]];
      }
      return [false, this.getErrorCode("WRONG_PASSWORD"), "WRONG_PASSWORD"];
    } catch (error) {
      return [false, 1000, []];
    }
  }

  async changePasswordMember({ body }) {
    try {
      const { phone, password, new_password } = body;
      const checkUser = await this.memberRepository.get({ phone }).first();
      if (!checkUser) {
        return [false, this.getErrorCode("USER_NOT_FOUND"), "USER_NOT_FOUND"];
      }
      if (this.app.bcrypt.compareSync(password, checkUser.password)) {
        const salt = this.app.bcrypt.genSaltSync(10);
        const newPassword = this.app.bcrypt.hashSync(new_password, salt);
        const data = await this.memberRepository
          .model()
          .where({ id })
          .update({ password: newPassword });
        if (data) {
          return [true, 0, []];
        }
        return [
          false,
          this.getErrorCode("CAN_CHANGE_PASSWORD"),
          "CAN_CHANGE_PASSWORD",
        ];
      }
      return [false, this.getErrorCode("WRONG_PASSWORD"), "WRONG_PASSWORD"];
    } catch (e) {
      throw e;
    }
  }
}

module.exports = MemberService;
