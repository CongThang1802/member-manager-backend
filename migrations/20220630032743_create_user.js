/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('users').then(exists => {
        if (!exists) {

            return knex.schema.createTable('users', table => {
                table.bigIncrements();
                table.string('full_name', 50).nullable();
                table.string('email', 50).unique().notNullable();
                table.string('password', 255).notNullable();
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
    return knex.schema.dropTable('users');
};
