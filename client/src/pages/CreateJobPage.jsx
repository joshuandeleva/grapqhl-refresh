import { useState } from 'react';
import {  useMutation } from '@apollo/client';
import { CREATE_JOB, GET_JOBS } from '../lib/graphql/queries';
import { useNavigate } from 'react-router';

function CreateJobPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [createJob, { loading, error }] = useMutation(CREATE_JOB, {
    variables: { input: { title, description } },
    onCompleted: () => {
      setTitle('');
      setDescription('');
      navigate('/'); 
    },
    onError: (error) => {
      console.error('Error creating job:', error);
    },
    update: (cache, { data: { createJob } }) => {
      console.log('Job created:', createJob);
      const existingJobs = cache.readQuery({ query: GET_JOBS });
      if (existingJobs) {
        cache.writeQuery({
          query: GET_JOBS,
          data: {
            jobs: [...existingJobs.jobs, createJob],
          },
        });
      }
    },
  });

  if (loading) return <p>Creating job...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const handleSubmit = (e) => {
    e.preventDefault();

    createJob({
      variables: {
        input: {
          title,
          description,
        },
      },
      refetchQueries: [GET_JOBS], 
      awaitRefetchQueries: true,
    });
  };


  return (
    <div>
      <h1 className="title">
        New Job
      </h1>
      <div className="box">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">
              Title
            </label>
            <div className="control">
              <input className="input" type="text" value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">
              Description
            </label>
            <div className="control">
              <textarea className="textarea" rows={10} value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button disabled={loading} type='submit' className="button is-link">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
