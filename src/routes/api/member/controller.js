const memberService = require('../../../services/MemberService');
module.exports = function(app) {

    const MemberService = new memberService(app);
    return {
        createMember: async (request, reply) => {
            const { body } = request;
            const [status, code, data] = await MemberService.createMember({ body });
            return {
                status,
                code,
                msg: status ? 'success' : 'failed',
                data,
            }
        },
        updateMember: async (request, reply) => {
            const { body, params } = request;
            const [status, code, data] = await MemberService.updateMember({ body, params });
            return {
                status,
                code,
                msg: status ? 'success' : 'failed',
                data,
            }
        },
        getMemberById: async (request, reply) => {
            const { params } = request;
            const [status, code, data] = await MemberService.getMemberById({ params });
            return {
                status,
                code,
                msg: status ? 'success' : 'failed',
                data,
            }
        },
        listMember: async (request, reply) => {
            const { query } = request;
            const [status, code, data] = await MemberService.listMember({ query });
            return {
                status,
                code,
                msg: status ? 'success' : 'failed',
                data,
            }
        },
        loginMember: async (request, reply) => {
            const { body } = request;
            const { phone, password } = body;
            const [status, code, data] = await MemberService.loginMember({ phone, password });
            return {
                status,
                code,
                msg: status ? 'success' : 'failed',
                data,
            }
        },
        changePasswordMember: async (request, reply) => {
            const { body } = request;
            const [status, code, data] = await MemberService.changePasswordMember({ body });
            return {
                status,
                code,
                msg: status ? 'success' : 'failed',
                data,
            }
        },
    }
}
