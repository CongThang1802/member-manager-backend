/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('donate').then(exists => {
        if (!exists) {

            return knex.schema.createTable('donate', table => {
                table.bigIncrements();
                table.integer('member_id').unsigned().notNullable();
                table.foreign('member_id').references('member.member_id').onDelete('CASCADE');
                table.integer('donate').notNullable();
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
    return knex.schema.dropTable('donate');
};
