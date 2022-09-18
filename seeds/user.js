/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    return knex('users').del().then(async function () {
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync('245b5944c3177d446a74606c5101023d', salt);
        return knex('users').insert([
            {
                full_name: "Admin Ho Nguyen",
                password,
                email: 'honguyen@gmail.com',
            }
        ])
    })
};
