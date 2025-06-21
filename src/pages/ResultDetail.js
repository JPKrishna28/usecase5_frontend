import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { getResult } from '../services/api';
import MapComponent from '../components/MapComponent';

const ResultDetail = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await getResult(id);
        if (response.data.success) {
          setResult(response.data.result);
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        setError('Failed to load result details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

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
        <p className="mt-3">Loading result details...</p>
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
      <div className="result-header">
        <div>
          <h2 className="page-title mb-0">Analysis Result</h2>
          <p className="text-muted">
            <i className="fas fa-calendar-alt me-2"></i>
            {new Date(result.created_at).toLocaleString()}
          </p>
        </div>
        <div>
          <Link to="/history" className="btn btn-outline-primary me-2">
            <i className="fas fa-arrow-left me-2"></i>
            Back to History
          </Link>
          <Button variant="primary">
            <i className="fas fa-download me-2"></i>
            Download Audio
          </Button>
        </div>
      </div>

      {result && (
        <>
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">{result.filename}</h4>
                <Badge bg={getSeverityClass(result.severity)} className="px-3 py-2">
                  {result.severity}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={6}>
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="card-title mb-0">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Threat Information
                      </h5>
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <strong>Threat Type</strong>
                        <span>{result.threat_type}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <strong>Confidence</strong>
                        <Badge bg="primary" pill>
                          {(result.confidence * 100).toFixed(1)}%
                        </Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <strong>Severity</strong>
                        <Badge bg={getSeverityClass(result.severity)}>
                          {result.severity}
                        </Badge>
                      </ListGroup.Item>
                      {result.urgent && (
                        <ListGroup.Item className="bg-danger text-white">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            <strong>URGENT ACTION REQUIRED</strong>
                          </div>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card>

                  {result.keywords && result.keywords.length > 0 && (
                    <Card className="mb-4">
                      <Card.Header>
                        <h5 className="card-title mb-0">
                          <i className="fas fa-tags me-2"></i>
                          Keywords
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex flex-wrap">
                          {result.keywords.map((keyword, index) => (
                            <Badge
                              bg="light"
                              text="dark"
                              className="keyword-badge"
                              key={index}
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                </Col>

                <Col lg={6}>
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="card-title mb-0">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Location Information
                      </h5>
                    </Card.Header>
                    {result.location_mentioned ? (
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <strong>Location Mentioned</strong>
                          <span>{result.location_mentioned}</span>
                        </ListGroup.Item>
                        {result.location_type && (
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <strong>Location Type</strong>
                            <span>{result.location_type}</span>
                          </ListGroup.Item>
                        )}
                        {result.location_confidence && (
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <strong>Location Confidence</strong>
                            <Badge bg="primary" pill>
                              {(result.location_confidence * 100).toFixed(1)}%
                            </Badge>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    ) : (
                      <Card.Body>
                        <p className="text-muted text-center mb-0">
                          No location information detected
                        </p>
                      </Card.Body>
                    )}
                  </Card>

                  {result.recommended_action && (
                    <Card className="mb-4">
                      <Card.Header>
                        <h5 className="card-title mb-0">
                          <i className="fas fa-tasks me-2"></i>
                          Recommended Action
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <p className="mb-0">{result.recommended_action}</p>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>

              <Card className="mb-4">
                <Card.Header>
                  <h5 className="card-title mb-0">
                    <i className="fas fa-file-alt me-2"></i>
                    Transcript
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="transcript-box">
                    {result.transcript}
                  </div>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header>
                  <h5 className="card-title mb-0">
                    <i className="fas fa-search me-2"></i>
                    Analysis
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="analysis-box">
                    {result.analysis}
                  </div>
                </Card.Body>
              </Card>

              {result.location_mentioned && (
                <Card>
                  <Card.Header>
                    <h5 className="card-title mb-0">
                      <i className="fas fa-map me-2"></i>
                      Location Map
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '400px' }}>
                      <MapComponent location={result.location_mentioned} />
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default ResultDetail;