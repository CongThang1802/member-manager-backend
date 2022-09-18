const fp = require("fastify-plugin");
const lodash = require("lodash");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const util = require("util");
const {pipeline} = require("stream");
const pump = util.promisify(pipeline);
const moment_timezone = require("moment-timezone");
const moment = require("moment");
const numeral = require("numeral");
const config = require("../config/config");
const sqlParser = require("node-sql-parser");
const uuid = require("uuid");
const md5 = require("md5");
const platformJackpot = require("../../jackpot/config-" + process.env.APP_ENV + ".json");
var listRefCodeWithEmail = {};
const axios = require("axios")
module.exports = fp(function (app, opts, done) {
    app.decorate("config", config);
    // console.log(app.knex.fn.now())
    app.decorate("knex_now", function () {
        return app.knex.fn.now();
    });
    app.decorate("time_format", function (time) {
        if (moment(time).isValid()) {
            try {
                return moment_timezone(time).tz("Asia/Ho_Chi_Minh");
            } catch (e) {
                return time;
            }
        }
        return time;
    });
    app.decorate("now", function (time) {
        return app.moment().utc().format();
    });
    app.decorate("lastDay", function () {
        return app.moment().utc().endOf("day");
    });
    app.decorate("nowUTC", function (time) {
        return app.moment().utc().format("MM-DD-YYYY HH:mm:ss");
    });
    app.decorate("nowUTCFormat", function (format) {
        return app.moment().utc().format(format ? format : "YYYY-MM-DD HH:mm:ss");
    });
    app.decorate("nowUTCFormatTime", function (time, format) {
        return app.moment(time).utc().format(format ? format : "YYYY-MM-DD HH:mm:ss");
    });
    app.decorate("from_unix", function (timestamp) {
        return moment_timezone(timestamp).format();
    });
    app.decorate("to_unix", function (timestamp) {
        return moment_timezone().unix();
    });
    app.decorate("order_url", function ({order_id, token}) {
        return `http://wallet.test/payment?order_id=${order_id}&token=${token}`;
    });
    app.decorate("uuidv4", uuid.v4);
    app.decorate("my_dev_transaction_id", function () {
        return config.app_name + "-" + app.uuidv4();
    });
    app.decorate("root_path", function (dir = "") {
        return path.join(__dirname + "/../..", dir);
    });
    app.decorate("public_path", function (dir = "") {
        return path.join(app.root_path("public"), dir);
    });
    app.decorate("upload_path", function (dir = "") {
        return path.join(app.root_path("public/uploads"), dir);
    });
    app.decorate("storage_path", function (dir = "") {
        return path.join(app.root_path("storage"), dir);
    });
    app.decorate("log_path", function (dir = "") {
        return path.join(app.root_path("storage/logs"), dir);
    });
    app.decorate("service_path", function (dir = "") {
        return path.join(app.root_path("src/services"), dir);
    });
    app.decorate("blacklist_path", function (dir = "") {
        return path.join(app.storage_path("blacklist"), dir);
    });
    app.decorate("move_uploaded_file", async function (file, filename) {
        await pump(file, fs.createWriteStream(app.upload_path(filename)));
    });
    app.decorate("stringify_format", function (value) {
        return JSON.stringify(value, null, 2);
    });
    app.decorate("filename", function (filename) {
        return (Date.now() + "-" + lodash.trim(lodash.deburr(lodash.replace(filename, /\s/g, ""))));
    });
    app.decorate("get_blacklist_token", function () {
        return JSON.parse(fs.readFileSync(app.blacklist_path("token.json")));
    });
    app.decorate("force_json", function (instance) {
        let parsed = {};
        try {
            if (typeof instance === "string") {
                // instance = instance.replace(/abc/g, "");
                parsed = instance ? JSON.parse(instance) : {};
            } else if (typeof instance === "object") parsed = instance ? instance : {}; else parsed = {};
        } catch (e) {
            console.log(e);
            parsed = {};
        }

        return parsed;
    });
    app.decorate("add_blacklist_token", function (token) {
        if (token) {
            const tokens = app.get_blacklist_token();
            tokens[token] = Date.now();
            fs.writeFileSync(app.blacklist_path("token.json"), JSON.stringify(tokens));
        }
    });
    app.decorate("is_blacklist_token", function (token) {
        const tokens = app.get_blacklist_token();
        return app.lodash.has(tokens, token);
    });
    app.decorate("timestamp_tz", function () {
        const now = moment_timezone().tz("UTC").format("x");
        return Math.floor(now / 1000);
    });
    app.decorate("sleep", function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    });
    app.decorate("sql_parser", function (sqlstring) {
        try {
            const parser = new sqlParser.Parser();
            return parser.astify(sqlstring);
        } catch (e) {
            return null;
        }
    });
    // Math
    app.decorate("convert_amount", function (number, digits = 8) {
        if (number === null) number = 0;
        number = +number;
        // if(currency === 'USD') fixed = 2;
        return number.toFixed(digits);
        // ;
        // return app.lodash.toString(number);
    });
    app.decorate("subtract", function (x, y) {
        const result = numeral(x);
        result.subtract(y);
        return result.value();
    });
    app.decorate("add", function (x, y) {
        const result = numeral(x);
        result.add(y);
        return result.value();
    });
    app.decorate("except", function (data, paths = []) {
        return app.lodash.omit(data, paths);
    });
    app.decorate("only", function (data, paths = []) {
        return app.lodash.pick(data, paths);
    });

    const promisify = (fn) => new Promise((resolve, reject) => fn(resolve));

    app.decorate("promisify", promisify);

    // app.decorate("set_time_range", function (type) {
    //     const from = app.moment().startOf(type).format("YYYY-MM-DD H:mm:ss");
    //     const to = app.moment().endOf(type).format("YYYY-MM-DD H:mm:ss");
    //     return {
    //         from, to,
    //     };
    // });
    //
    // app.decorate("to_vietnamese", function (str) {
    //     str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    //     str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    //     str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    //     str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    //     str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    //     str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    //     str = str.replace(/đ/g, "d");
    //     str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    //     str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    //     str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    //     str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    //     str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    //     str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    //     str = str.replace(/Đ/g, "D");
    //     // Remove extra spaces
    //     str = str.replace(/ + /g, " ");
    //     str = str.trim();
    //     // Remove punctuations
    //     return str;
    // });

    // app.decorate("match_text", function (str) {
    //     const regex = /^[a-zA-Z\s]+$/;
    //     str = app.to_vietnamese(str);
    //     return str.match(regex) !== null;
    // });

    // app.decorate("random_code", function () {
    //     return app.lodash.random(100000, 999999);
    // });
    //
    // app.decorate("is_password_strength", function (password) {
    //     // const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#.?!@$%^&*-]).{8,50}$/;
    //     const regex = /^.{8,50}$/;
    //     return regex.test(password);
    // });
    // app.decorate("format_image_v1", function (image) {
    //     if (!image) {
    //         return "";
    //     }
    //     if (image.indexOf("http") != -1) {
    //         return image;
    //     } else {
    //         return process.env.PATH_IMAGE + image;
    //     }
    // });
    //
    // app.decorate("create_hash_for_p2p", function (string) {
    //     console.log({string}, "create_hash_for_p2p")
    //     const sign = crypto.createSign("SHA256");
    //     const key = fs.readFileSync(app.storage_path(process.env.API_TO_P2P_PRIVATE_KEY));
    //     // console.log({key})
    //     // const key = fs.readFileSync(app.storage_path(process.env.P2P_TO_API_PRIVATE_KEY));
    //     sign.write(string);
    //     sign.end();
    //     return sign.sign(key, "base64");
    // });
    //
    // app.decorate("check_hash_from_p2p", function (param) {
    //     const {hash, data} = param;
    //     console.log({hash, data}, "check_hash_from_p2p");
    //     // console.log({param}, process.env.P2P_TO_API_PUBLIC_KEY)
    //     const key = fs.readFileSync(app.storage_path(process.env.P2P_TO_API_PUBLIC_KEY));
    //     // console.log({ key: key.toString() });
    //     const verifier = crypto.createVerify("SHA256");
    //     verifier.update(data);
    //     return verifier.verify(key, hash, "base64");
    // });
    // app.decorate("create_hash_for_api", function (string) {
    //     console.log({string}, "create_hash_for_api");
    //     const sign = crypto.createSign("SHA256");
    //     const key = fs.readFileSync(app.storage_path(process.env.P2P_TO_API_PRIVATE_KEY));
    //     // console.log(key.toString())
    //     sign.write(string);
    //     sign.end();
    //     return sign.sign(key, "base64");
    // });
    //
    // //func để tạo mã giới thiệu cho người dùng
    // app.decorate("create_ref_code", function (uid) {
    //     uid = uid.toString();
    //     let lenCode = 10;
    //     let prefix = "68";
    //     for (let i = 0; i < lenCode - uid.length - 2; i++) {
    //         prefix += "0";
    //     }
    //     return prefix + uid;
    // });
    //
    // //func lấy id người dùng từ mã giới thiệu
    // app.decorate("get_uid_from_ref_code", function (ref_code) {
    //     console.log(parseFloat(ref_code.substr(2)));
    //     return parseFloat(ref_code.substr(2));
    // });

    app.decorate("sortObjectToParam", function (data) {
        console.log({data});
        let sorts = Object.keys(data).sort();
        let result = "";
        for (let item of sorts) {
            result += `${item}=${data[item]}&`;
        }
        return result;
    });


    app.decorate("sort_object", (obj) => {
        return Object.keys(obj)
            .sort()
            .reduce(function (result, key) {
                result[key] = obj[key];
                return result;
            }, {});
    });

    app.decorate("unix_to_date", function (time) {

        return moment.unix(value);

    });


    // (() => {
    //
    //     const algorithm = 'aes-256-ctr';
    //     const secretKey = process.env.ENCRYPT_KEY || Buffer.from("BASE_64_KEY!@#", 'base64');
    //     // console.log("secretKey",secretKey)
    //     const iv = crypto.randomBytes(16);
    //
    //     const encrypt = (text) => {
    //         const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    //         // console.log("cipher",cipher)
    //         const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    //         const json = {
    //             iv: iv.toString('hex'), content: encrypted.toString('hex')
    //         }
    //         return Buffer.from(JSON.stringify(json)).toString("base64")
    //     };
    //
    //     const decrypt = (data) => {
    //         let buff = Buffer.from(data, 'base64');
    //         let text = buff.toString('ascii');
    //         const hash = JSON.parse(text);
    //         const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    //         const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    //         return decrpyted.toString();
    //     };
    //     const mask_email = ($str, $first, $last) => {
    //         const $len = $str.length;
    //         const $toShow = $first + $last;
    //         return $str.substr(0, $len <= $toShow ? 0 : $first) + "*".repeat(Math.ceil(($len - ($len <= $toShow ? 0 : $toShow)) / 2)) + $str.substr($len - $last, $len <= $toShow ? 0 : $last);
    //     }
    //     const protect_email = (user_email) => {
    //         const $mail_parts = user_email.split('@');
    //         const $domain_parts = $mail_parts[1].split('.');
    //
    //         $mail_parts[0] = mask_email($mail_parts[0], 2, 1); // show first 2 letters and last 1 letter
    //         $domain_parts[0] = mask_email($domain_parts[0], 2, 1); // same here
    //         $mail_parts[1] = $domain_parts.join('.');
    //         return $mail_parts.join('@');
    //     };
    //
    //     app.decorate("encrypt", function (value) {
    //         return encrypt(value);
    //     });
    //     app.decorate("decrypt", function (value) {
    //         return decrypt(value);
    //     });
    //     app.decorate("protect_email", function (value) {
    //         return protect_email(value);
    //     });
    //
    //     app.decorate("format_number_decimal", function (value, decimal) {
    //         let format = "0,00";
    //         let formatDecimal = ".";
    //         for (let i = 0; i < decimal; i++) {
    //             formatDecimal += "0";
    //         }
    //         console.log({value, decimal, format, formatDecimal})
    //         format = format + (formatDecimal.length > 1 ? formatDecimal : "");
    //         console.log({value, decimal, format})
    //         return app.numeral(value).format(format)
    //     });
    //     app.decorate("checkIfValidMD5Hash", function (str) {
    //         const regexExp = /^[a-f0-9]{32}$/gi;
    //
    //         return regexExp.test(str);
    //     });
    //
    //
    //     app.decorate("nowPlusUnit", function (value, unit) {
    //         return app.moment().utc().add(unit, value).format();
    //     })
    //
    //     app.decorate(("createHashAgent"), function (data, publicKey, secretKey) {
    //         data = app.sortObjectToParam(data);
    //         console.log({data})
    //         let hmac = crypto.createHmac('sha256', secretKey).update(data).digest('base64');
    //         return (publicKey + '.' + hmac);
    //     });
    //
    //     app.decorate("getListRefCodeWithEmail", (email) => {
    //         return listRefCodeWithEmail[email];
    //     });
    //     app.decorate("addListRefCodeWithEmail", (email, ref_code) => {
    //         listRefCodeWithEmail[email] = ref_code;
    //     })
    //     app.decorate("removeListRefCodeWithEmail", (email) => {
    //         delete listRefCodeWithEmail[email];
    //     })
    //
    //     app.decorate("verifyTokenRSA256", function (data, token, publicKey) {
    //         const hash = token;
    //         const key = publicKey;
    //         const verifier = crypto.createVerify("SHA256");
    //         verifier.update(data);
    //         return verifier.verify(key, hash, "base64");
    //     });
    //
    //     app.decorate("createTokenRSA256", function (data, privateKey) {
    //         const sign = crypto.createSign("SHA256");
    //         const key = privateKey;
    //         sign.write(data);
    //         sign.end();
    //         return sign.sign(key, "base64");
    //     });
    //
    //     /**
    //      * @description create format data send to agent
    //      */
    //     app.decorate("formatDataWebhookSendToAgent",
    //         async (data) => {
    //             console.log("data", data)
    //             const checkDataInput = await app.check_input(data, {
    //                 id: 'required|string',
    //                 amount: 'required|min:0|decimal',
    //                 currency: 'required|string|minLength:3',
    //                 method: 'required|in:bank,blockchain,local',
    //                 type: 'required|in:withdraw,deposit,payment',
    //                 status: 'required|in:Completed,Cancel,Reject,Pending',
    //                 time: "required|decimal",
    //                 description: 'string',
    //                 from: 'required|string',
    //                 to: "string",
    //                 hash: 'required|string',
    //                 agentCode: 'required|length:10,10',
    //                 signature: 'required'
    //             }, "gateway")
    //             // console.log("checkDataInput", checkDataInput)
    //             return checkDataInput;
    //         })
    //
    //     /**
    //      *
    //      */
    //     app.decorate("sendNotifyForAgent", async (body) => {
    //         try {
    //             console.log("SEND NOTIFY AGENT");
    //             let {id, amount, currency, method, time, description, from, to, hash, userId, type, status, fee} = body;
    //             const agentDetail = await agentRepository.getAgentByUserId(userId);
    //             if (!agentDetail) {
    //                 throw new Error("AGENT NOT FOUNT")
    //             }
    //             const listType = [];
    //             for (let item in app.config.WEBHOOK_LOG.TYPE) {
    //                 listType.push(app.config.WEBHOOK_LOG.TYPE[item])
    //             }
    //             if (listType.indexOf(type) === -1) {
    //                 throw new Error("TYPE NOT SUPPORT")
    //             }
    //             //check allow receive notify
    //             if (type === app.config.WEBHOOK_LOG.TYPE.DEPOSIT && !agentDetail.notify_deposit) {
    //                 throw new Error("AGENT NOT SUPPORT RECEIVE DEPOSIT")
    //             }
    //             if (type === app.config.WEBHOOK_LOG.TYPE.WITHDRAW && !agentDetail.notify_withdraw) {
    //                 throw new Error("AGENT NOT SUPPORT RECEIVE WITHDRAW")
    //             }
    //             if (type === app.config.WEBHOOK_LOG.TYPE.PAYMENT && !agentDetail.notify_order) {
    //                 throw new Error("AGENT NOT SUPPORT RECEIVE ORDER")
    //             }
    //             // console.log("agentDetail", agentDetail,)
    //             // console.log({id, amount, currency, method, time, description, from, to, hash})
    //             time = app.moment(time).unix() * 1000;
    //             const _dataCreateToken = {
    //                 id,
    //                 amount, currency,
    //                 method, time,
    //                 description, from,
    //                 to, type, status,
    //                 hash, agentCode: agentDetail.agent_code,
    //                 fee: fee ? fee : 0
    //             }
    //             const stringDataToken = app.sortObjectToParam(_dataCreateToken);
    //             const signature = app.createTokenRSA256(stringDataToken, agentDetail.secret_key);
    //             console.log("stringDataToken", app.verifyTokenRSA256(stringDataToken, signature, agentDetail.public_key))
    //             // console.log("signature", signature)
    //             const dataSendNotify = {
    //                 ..._dataCreateToken, signature,
    //             }
    //             // console.log("checkDataSend", dataSendNotify)
    //             const checkDataSend = await app.formatDataWebhookSendToAgent(dataSendNotify);
    //             if (!checkDataSend[0]) {
    //                 throw  new Error("Validate Data Send Fail: " + JSON.stringify(checkDataSend[1]))
    //             }
    //             // console.log("checkDataSend", checkDataSend)
    //             //
    //             if (process.env.MIDDLEWARE_WEBHOOK_AGENT) {
    //                 dataSendNotify.callback_url = agentDetail.callback_url;
    //                 sendAgent(process.env.MIDDLEWARE_WEBHOOK_AGENT, dataSendNotify, 2).then();
    //             } else {
    //                 sendAgent(agentDetail.callback_url, dataSendNotify, 2).then();
    //             }
    //
    //         } catch (e) {
    //             console.log("sendNotifyForAgent", e.message)
    //         }
    //
    //
    //         // let dataCreateSignature=await
    //
    //
    //         async function sendAgent(url, body, amount) {
    //             for (let item = 0; item < amount; item++) {
    //                 axios.post(url, body).then((response) => {
    //                     const {data} = response;
    //                     webhookLogRepository.create({
    //                         from: app.config.WEBHOOK_LOG.FROM.WALLET,
    //                         data: JSON.stringify({request: body, response: data}),
    //                         to: body.agentCode
    //                     })
    //                 }).catch((error) => {
    //                     webhookLogRepository.create({
    //                         from: app.config.WEBHOOK_LOG.FROM.WALLET,
    //                         data: JSON.stringify({request: body, response: error.message}),
    //                         to: body.agentCode
    //                     })
    //                 })
    //                 await app.sleep(1000 * 60)
    //             }
    //
    //         }
    //
    //         //
    //         //
    //
    //
    //     })
    // })()
    done();
});
