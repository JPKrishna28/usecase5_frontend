import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Badge, Row, Col, ListGroup } from 'react-bootstrap';
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
    return <div className="text-center my-5">Loading result details...</div>;
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
      <h2 className="mb-4">Analysis Result</h2>

      {result && (
        <>
          <Card className="mb-4">
            <Card.Header>
              <h3>{result.filename}</h3>
              <div>
                <Badge bg={getSeverityClass(result.severity)} className="me-2">
                  {result.severity}
                </Badge>
                <small className="text-muted">
                  Analyzed on {new Date(result.created_at).toLocaleString()}
                </small>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>Threat Information</Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Threat Type:</strong> {result.threat_type}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Severity:</strong> {result.severity}
                      </ListGroup.Item>
                      {result.urgent && (
                        <ListGroup.Item className="bg-danger text-white">
                          <strong>Urgent Action Required</strong>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>Location Information</Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Location Mentioned:</strong> {result.location_mentioned || 'None'}
                      </ListGroup.Item>
                      {result.location_type && (
                        <ListGroup.Item>
                          <strong>Location Type:</strong> {result.location_type}
                        </ListGroup.Item>
                      )}
                      {result.location_confidence && (
                        <ListGroup.Item>
                          <strong>Location Confidence:</strong> {(result.location_confidence * 100).toFixed(1)}%
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card>
                </Col>
              </Row>

              <Card className="mb-3">
                <Card.Header>Transcript</Card.Header>
                <Card.Body>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{result.transcript}</p>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header>Analysis</Card.Header>
                <Card.Body>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{result.analysis}</p>
                </Card.Body>
              </Card>

              {result.keywords && result.keywords.length > 0 && (
                <Card className="mb-3">
                  <Card.Header>Keywords</Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-wrap">
                      {result.keywords.map((keyword, index) => (
                        <Badge
                          bg="secondary"
                          className="me-2 mb-2 p-2"
                          key={index}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}

              {result.recommended_action && (
                <Card className="mb-3">
                  <Card.Header>Recommended Action</Card.Header>
                  <Card.Body>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{result.recommended_action}</p>
                  </Card.Body>
                </Card>
              )}

              {result.location_mentioned && (
                <Card>
                  <Card.Header>Location Map</Card.Header>
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