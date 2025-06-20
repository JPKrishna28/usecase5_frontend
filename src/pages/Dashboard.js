import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getStatus } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_files: 0,
    processed_files: 0,
    pending_files: 0,
    latest_results: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getStatus();
        if (response.data.success) {
          setStats(response.data);
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return <div className="text-center my-5">Loading dashboard data...</div>;
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
      <div className="jumbotron text-center mb-4">
        <h1 className="display-4">Audio Threat Detector</h1>
        <p className="lead">Automated audio analysis and threat detection system</p>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{stats.total_files}</h3>
              <p>Total Files</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{stats.processed_files}</h3>
              <p>Processed Files</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{stats.pending_files}</h3>
              <p>Pending Files</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h3>Recent Analyses</h3>
        </Card.Header>
        <Card.Body>
          {stats.latest_results && stats.latest_results.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Threat Type</th>
                  <th>Confidence</th>
                  <th>Severity</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.latest_results.map(result => (
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
          ) : (
            <p className="text-center">No recent analyses available.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;