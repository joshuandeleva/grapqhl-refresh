import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import {readFile} from 'node:fs/promises';
import { authMiddleware, handleLogin } from './auth.js';
import { resolvers } from './resolvers.js';
import { getUser } from './db/users.js';
import { createCompanyLoader } from './db/companies.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const typedefs =  await readFile('./schema.graphql', 'utf8');

const apolloServer = new ApolloServer({
  typeDefs: typedefs,
  resolvers: resolvers
});

async function getContext({ req, res }) {
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };
  if (req.auth) {
    context.user = await getUser(req.auth.sub)
    context.auth = req.auth;
    return context;
  } else {
    return context
  }
}

await apolloServer.start();
app.use('/graphql', cors(), express.json(), expressMiddleware(apolloServer,{context: getContext}));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}/graphql`);
});
