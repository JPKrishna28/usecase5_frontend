import React, { useState, useRef } from 'react';
import { Form, Button, Card, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { uploadAudio, getAudioStatus } from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const fileExtension = droppedFile.name.split('.').pop().toLowerCase();

      if (['wav', 'mp3', 'm4a', 'aac', 'ogg', 'flac'].includes(fileExtension)) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('File type not supported. Please upload WAV, MP3, M4A, AAC, OGG, or FLAC files.');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
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
      <h2 className="page-title">Upload Audio File</h2>

      {error && (
        <Alert variant="danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <div
              className={`upload-box mb-4 ${isDragActive ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".wav,.mp3,.m4a,.aac,.ogg,.flac"
                style={{ display: 'none' }}
                disabled={isUploading || isProcessing}
              />
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h4>Drop audio file here or click to browse</h4>
              <p className="text-muted mb-0">
                Supported formats: WAV, MP3, M4A, AAC, OGG, FLAC
              </p>
              {file && (
                <div className="mt-3 p-3 bg-light rounded">
                  <i className="fas fa-file-audio me-2"></i>
                  <span>{file.name}</span>
                  <span className="text-muted ms-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            {isUploading && (
              <div className="mb-4">
                <h5>
                  <i className="fas fa-upload me-2"></i>
                  Uploading file...
                </h5>
                <ProgressBar
                  now={uploadProgress}
                  label={`${uploadProgress}%`}
                  variant="primary"
                  animated={uploadProgress < 100}
                  className="mt-2"
                />
              </div>
            )}

            {isProcessing && (
              <div className="mb-4">
                <h5>
                  <i className="fas fa-cogs me-2"></i>
                  Processing audio file...
                </h5>
                <p className="text-muted small">
                  Your file is being analyzed for potential threats. This might take a few moments.
                </p>
                <ProgressBar animated now={100} variant="info" className="mt-2" />
              </div>
            )}

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button
                variant="primary"
                type="submit"
                disabled={!file || isUploading || isProcessing}
                size="lg"
              >
                {isUploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Uploading...
                  </>
                ) : isProcessing ? (
                  <>
                    <i className="fas fa-cog fa-spin me-2"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload me-2"></i>
                    Upload & Analyze
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header>
          <h5 className="card-title mb-0">
            <i className="fas fa-info-circle me-2"></i>
            About Audio Threat Detection
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="text-center">
                <i className="fas fa-microphone fa-2x mb-3 text-primary"></i>
                <h5>Audio Processing</h5>
                <p className="text-muted">
                  We convert your audio to a standardized format for accurate analysis.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="text-center">
                <i className="fas fa-language fa-2x mb-3 text-primary"></i>
                <h5>Transcription</h5>
                <p className="text-muted">
                  Audio is transcribed to text using state-of-the-art speech recognition.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="fas fa-brain fa-2x mb-3 text-primary"></i>
                <h5>AI Analysis</h5>
                <p className="text-muted">
                  Advanced AI models detect and classify potential threats in the content.
                </p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Upload;