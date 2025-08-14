import JobList from '../components/JobList';
import {useQuery} from '@apollo/client';
import { GET_JOBS } from '../lib/graphql/queries';
import { useState } from 'react';
import PaginationBar from '../components/PaginationBar';

function HomePage() {
  const [limit , setLimit] = useState(10);
  const [offset , setOffset] = useState(0);
  const { loading, error, data } = useQuery(GET_JOBS ,{
    variables: { limit: limit, offset: offset },
  });
    const totalPage =  Math.ceil(data.jobs.totalCount / limit); 
  const handlePageChange = (newOffset) => {
    setOffset(newOffset);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <PaginationBar currentPage={offset} totalPages={totalPage} onPageChange={handlePageChange}/>
      <JobList jobs={data.jobs?.items} />
    </div>
  );
}

export default HomePage;
