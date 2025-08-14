import knex from 'knex';

export const connection = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

// check queries running (n + 1 problem)

connection.on('query', ({sql , bindings}) => {
  const query = connection.raw(sql, bindings).toQuery();
  console.log(`Running query: ${query}`);
});