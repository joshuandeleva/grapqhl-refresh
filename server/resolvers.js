import { companies } from "../client/src/lib/fake-data.js";
import { getCompany } from "./db/companies.js";
import { createJob, deleteJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
    Query: {
        jobs: async () => {
            const jobs = await getJobs();
            return jobs;
        },
        job: async (_, { id }) => {
            const jobs = await getJobs();
            const fjob = jobs.find(job => job.id === id);
            if (!fjob) {
                throw notFoundError(`Job not found: ${id}`);
            }
            return fjob
        },
        company: async (_, { id }) => {
            const company =  await getCompany(id);
            if (!company) {
                throw notFoundError(`Company not found: ${id}`);
            }
            return company;
        },
        companies: async () => {
            return companies;
        }
    },
    Mutation: {
        createJob: async (parent , args , contextValue , info) => {
            const {auth , user}   = contextValue
            console.log(auth , user , 'logge in user')
            if(!auth){
                throw unAuthorizedError("Missing authentication token");
            }
            const { title, description } = args.input;
            const companyId = user.companyId; 
            const job = await createJob({ companyId, title, description });
            return job;
        },
        deleteJob: async (_, { id } , contextValue) => {
            const {user} = contextValue;
            if (!user) {
                throw unAuthorizedError("You must be logged in to delete a job");
            }
            const deletedJob = await deleteJob(id , user.companyId);
            return deletedJob
        },
        updateJob: async (parent , args , contextValue , imfo) => {
            const {id, title, description} = args.input
            const {user} = contextValue;
            if (!user) {
                throw unAuthorizedError("You must be logged in to update a job");
            }
            const job = await updateJob({ id, title, description, companyId: user.companyId });
            if (!job) {
                throw notFoundError(`Job not found: ${id}`);
            }
            return job;
        }

    },
    Job: {
        date: (job) => formatDate(job.createdAt),
        company: (job) => getCompany(job.companyId)
    },
    Company: {
        jobs: async (company) => {
            const jobs = await getJobsByCompany(company.id);
            return jobs.map(job => ({
                ...job,
                date: formatDate(job.createdAt)
            }));
        }
    }

};

function formatDate(dateString) {
    return dateString.slice(0, 'yyyy-mm-dd'.length);
}

function notFoundError(message) {
    return new GraphQLError(`${message}`, {
        extensions: {
            code: 'NOT_FOUND',
        },
    });
}

function unAuthorizedError(message) {
    return new GraphQLError(`${message}`, {
        extensions: {
            code: 'UNAUTHORIZED',
        },
    });
}