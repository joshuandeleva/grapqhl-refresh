import JobList from '../components/JobList';
import {useQuery} from '@apollo/client';
import { GET_JOBS } from '../lib/graphql/queries';

function HomePage() {
  const { loading, error, data } = useQuery(GET_JOBS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={data.jobs} />
    </div>
  );
}

export default HomePage;
