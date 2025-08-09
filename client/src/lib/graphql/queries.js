import { ApolloLink, createHttpLink, gql } from '@apollo/client';

export const GET_JOBS = gql`
  query GetJobs {
    jobs {
      id
      title
      date
      company {
        id
        name
        description
      }
    }
  }
`;

export const GET_JOB = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      id
      title
      date
      company {
        id
        name
        description
      }
    }
  }
`;

export const GET_COMPANY = gql`
  query GetCompany($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
        date
      }
    }
  }
`;

export const CREATE_JOB = gql`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      id
      title
      description
      date
      company {
        id
        name
      }
    }
  }
`;

const customHttpLink = createHttpLink({uri: '/graphql'}); 
const authlink =  new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }
  return forward(operation);
});

// use th concat operator to combine the auth link and the http link
// export const link = authlink.concat(customHttpLink);
// const apolloClient = new ApolloClient({
//   link: concat(authlink, customHttpLink),
//   cache: new InMemoryCache(),
// }); // the order of the links matters, authlink should be first