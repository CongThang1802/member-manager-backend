/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('member').then(exists => {
        if (!exists) {

            return knex.schema.createTable('member', table => {
                table.bigIncrements();
                table.string('member_id', 50).unique().nullable();
                table.string('full_name', 50).nullable();
                table.string('phone').unique().nullable();
                table.string('password', 255).notNullable();
                table.string('avatar', 255).notNullable();
                table.string('address', 255).nullable();
                table.integer('gender').notNullable();
                table.integer('expiry_date').nullable();
                table.integer('identity_card_number').nullable();
                table.integer('total_donate').nullable();
                table.integer('status').notNullable().defaultTo(1);
                table.integer('level').notNullable().defaultTo(1);
                table.string('qrcode', 255).nullable();
                table.timestamp('created_at').defaultTo(knex.fn.now())
                table.timestamp('updated_at').defaultTo(knex.fn.now())
            });
        }
    })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('member');
};
