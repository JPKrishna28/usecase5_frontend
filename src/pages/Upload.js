import React, { useState } from 'react';
import { Form, Button, Card, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { uploadAudio, getAudioStatus } from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulated upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await uploadAudio(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        setIsUploading(false);
        setIsProcessing(true);

        // Poll for processing status
        await pollProcessingStatus(response.data.audio_id);
      } else {
        setError(response.data.error);
        setIsUploading(false);
      }
    } catch (err) {
      setError('Error uploading file: ' + (err.response?.data?.error || err.message));
      setIsUploading(false);
    }
  };

  const pollProcessingStatus = async (audioId) => {
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes (with 2 second interval)

    const checkStatus = async () => {
      try {
        attempts++;
        const statusResponse = await getAudioStatus(audioId);

        if (statusResponse.data.success) {
          if (statusResponse.data.processed) {
            setIsProcessing(false);
            navigate(`/results/${statusResponse.data.result_id}`);
            return true;
          } else if (attempts >= maxAttempts) {
            setError('Processing is taking longer than expected. Please check the history page later.');
            setIsProcessing(false);
            return true;
          }
        } else {
          setError(statusResponse.data.error);
          setIsProcessing(false);
          return true;
        }

        return false;
      } catch (err) {
        setError('Error checking processing status');
        setIsProcessing(false);
        return true;
      }
    };

    const check = async () => {
      const isDone = await checkStatus();
      if (!isDone) {
        setTimeout(check, 2000);
      }
    };

    await check();
  };

  return (
    <div>
      <h2 className="mb-4">Upload Audio File</h2>

      {error && (
        <Alert variant="danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Audio File</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".wav,.mp3,.m4a,.aac,.ogg,.flac"
                disabled={isUploading || isProcessing}
              />
              <Form.Text className="text-muted">
                Supported formats: WAV, MP3, M4A, AAC, OGG, FLAC
              </Form.Text>
            </Form.Group>

            {isUploading && (
              <div className="mb-3">
                <p>Uploading file...</p>
                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
              </div>
            )}

            {isProcessing && (
              <div className="mb-3">
                <p>Processing audio file...</p>
                <ProgressBar animated now={100} />
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              disabled={!file || isUploading || isProcessing}
            >
              {isUploading ? 'Uploading...' : isProcessing ? 'Processing...' : 'Upload'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Upload;