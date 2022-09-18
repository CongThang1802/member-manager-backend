const Service = require("./Service");
class DonateService extends Service {
  constructor(app) {
    super(app);
    this.donateRepository = this.getRepository("DonateRepository");
    this.memberRepository = this.getRepository("MemberRepository");
    this.companyCode = "HN";
  }
  async createDonate({ body }) {
    try {
      const { member_id, donate } = body;
      const getMember = await this.memberRepository.get({ member_id }).first();
      if (!getMember) {
        return [
          false,
          this.getErrorCode("MEMBER_NOT_FOUND", "MEMBER_NOT_FOUND"),
        ];
      }
      const result = await this.donateRepository.create({
        member_id,
        donate,
      });
      if (result) {
        return [true, 0, []];
      }
      return [
        false,
        this.getErrorCode("ERROR_CREATE_DONATE"),
        "ERROR_CREATE_DONATE",
      ];
    } catch (e) {
      throw e;
    }
  }

  async updateDonate({ body, params }) {
    try {
      const { id } = params;
      const { member_id, donate } = body;
      const dataUpdate = {};
      const getDonate = await this.donateRepository.get({ id }).first();
      if (!getDonate) {
        return [
          false,
          this.getErrorCode("NOT_FOUND_DONATE"),
          "NOT_FOUND_DONATE",
        ];
      }
      if (member_id) {
        dataUpdate["member_id"] = member_id;
      }
      if (donate) {
        dataUpdate["donate"] = donate;
      }
      if (this.isEmpty(dataUpdate)) {
        return [false, this.getErrorCode("NOT_FOUND"), []];
      }
      const data = await this.donateRepository
        .model()
        .where({ id })
        .update(dataUpdate);
      if (data) {
        return [true, 0, []];
      }
      return [
        false,
        this.getErrorCode("ERROR_UPDATE_DONATE"),
        "ERROR_UPDATE_DONATE",
      ];
    } catch (e) {
      throw e;
    }
  }
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  async getDonateById({ params }) {
    try {
      const { member_id } = params;
      const data = await this.donateRepository.get({ member_id });
      if (data) {
        return [true, 0, data];
      }
      return [true, 0, []];
    } catch (e) {
      console.log({ error: e });
      return [false, this.getErrorCode("OTHER"), []];
    }
  }

  async listDonate({ query }) {
    try {
      let { page, limit, sort } = query;
      if (!limit) limit = 10;
      if (!page) page = 1;
      if (!sort) sort = "DESC";
      const data = await this.donateRepository
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
}
module.exports = DonateService;
