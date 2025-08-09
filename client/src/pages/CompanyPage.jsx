import { Link, useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import { GET_COMPANY } from '../lib/graphql/queries';
import { formatDate } from '../lib/formatters';

function CompanyPage() {
  const { companyId } = useParams();
  const { loading, error, data } = useQuery(GET_COMPANY, {
    variables: { id: companyId },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const company = data.company;
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className="subtitle">
        Jobs at {company.name}
      </h2>
      <ul className="box">
        {company.jobs.map((job) => (
          <li key={job.id}>
            <Link to={`/jobs/${job.id}`}>
              {job.title} - {formatDate(job.date)}
            </Link>
          </li>
        ))}
      </ul>
      {company.jobs.length === 0 && <p>No jobs available at this time.</p>}
      <Link to="/" className="button is-link">
        Back to Home
      </Link>
    </div>
  );
}

export default CompanyPage;
