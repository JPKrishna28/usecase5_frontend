import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, ProgressBar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getStatus } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_files: 0,
    processed_files: 0,
    pending_files: 0,
    latest_results: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for the chart
  const severityData = [
    { name: 'Low', value: 12, color: '#4cc9f0' },
    { name: 'Medium', value: 8, color: '#ffd166' },
    { name: 'High', value: 5, color: '#ef476f' },
    { name: 'Critical', value: 2, color: '#343a40' }
  ];

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
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard data...</p>
      </div>
    );
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
      <div className="jumbotron text-center">
        <h1 className="display-4">Audio Threat Detector</h1>
        <p className="lead">Automated audio analysis and threat detection system</p>
        <div className="mt-4">

        </div>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <div className="stats-card">
            <div className="stats-icon mb-3">
              <i className="fas fa-file-audio fa-2x text-primary"></i>
            </div>
            <h3>{stats.total_files}</h3>
            <p>Total Files</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card">
            <div className="stats-icon mb-3">
              <i className="fas fa-check-circle fa-2x text-success"></i>
            </div>
            <h3>{stats.processed_files}</h3>
            <p>Processed Files</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card">
            <div className="stats-icon mb-3">
              <i className="fas fa-hourglass-half fa-2x text-warning"></i>
            </div>
            <h3>{stats.pending_files}</h3>
            <p>Pending Files</p>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-chart-bar me-2"></i> Recent Analyses
                </h5>
                <Link to="/history" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {stats.latest_results && stats.latest_results.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Threat Type</th>
                        <th>Confidence</th>
                        <th>Severity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.latest_results.map(result => (
                        <tr key={result.id}>
                          <td>{result.filename}</td>
                          <td>{result.threat_type}</td>
                          <td style={{ width: '20%' }}>
                            <ProgressBar
                              now={result.confidence * 100}
                              label={`${(result.confidence * 100).toFixed(1)}%`}
                              variant={getSeverityClass(result.severity)}
                            />
                          </td>
                          <td>
                            <Badge bg={getSeverityClass(result.severity)}>
                              {result.severity}
                            </Badge>
                          </td>
                          <td>
                            <Link
                              to={`/results/${result.id}`}
                              className="btn btn-sm btn-primary"
                            >
                              <i className="fas fa-eye me-1"></i> View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                  <p className="mb-0">No recent analyses available.</p>
                  <div className="mt-3">

                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-pie me-2"></i> Threat Severity
              </h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} threats`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-center">
                <div className="d-flex flex-wrap justify-content-center">
                  {severityData.map((entry, index) => (
                    <div key={index} className="mx-2 mb-2">
                      <span
                        className="d-inline-block me-1"
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: entry.color,
                          borderRadius: '50%'
                        }}
                      ></span>
                      <small>{entry.name}: {entry.value}</small>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="card-title mb-0">
            <i className="fas fa-map-marked-alt me-2"></i> Threat Map
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="text-center py-3">
            <p>Interactive threat map will be displayed here.</p>
            <p className="text-muted">View geographical distribution of detected threats.</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;