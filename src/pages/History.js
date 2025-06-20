import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Pagination, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getResults } from '../services/api';

const History = () => {
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults(pagination.page);
  }, []);

  const fetchResults = async (page) => {
    try {
      setLoading(true);
      const response = await getResults(page, pagination.perPage);

      if (response.data.success) {
        setResults(response.data.results);
        setPagination({
          page: response.data.page,
          perPage: response.data.per_page,
          total: response.data.total,
          pages: response.data.pages
        });
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('Failed to load analysis history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchResults(page);
  };

  const getSeverityClass = (severity) => {
    const classes = {
      'low': 'info',
      'medium': 'warning',
      'high': 'danger',
      'critical': 'dark',
      'error': 'secondary'
    };
    return classes[severity?.toLowerCase()] || 'secondary';
  };

  if (loading && results.length === 0) {
    return <div className="text-center my-5">Loading analysis history...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger my-3">
        <i className="fas fa-exclamation-circle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Analysis History</h2>

      <Card>
        <Card.Body>
          {results.length > 0 ? (
            <>
              <Table responsive>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Threat Type</th>
                    <th>Confidence</th>
                    <th>Severity</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                    <tr key={result.id}>
                      <td>{result.filename}</td>
                      <td>{result.threat_type}</td>
                      <td>
                        <ProgressBar
                          now={result.confidence * 100}
                          label={`${(result.confidence * 100).toFixed(1)}%`}
                        />
                      </td>
                      <td>
                        <Badge bg={getSeverityClass(result.severity)}>
                          {result.severity}
                        </Badge>
                      </td>
                      <td>{new Date(result.created_at).toLocaleString()}</td>
                      <td>
                        <Link
                          to={`/results/${result.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {pagination.pages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.page === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    />

                    {[...Array(pagination.pages).keys()].map(page => (
                      <Pagination.Item
                        key={page + 1}
                        active={pagination.page === page + 1}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(pagination.pages)}
                      disabled={pagination.page === pagination.pages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <p className="text-center">No analysis results found.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default History;