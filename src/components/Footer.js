import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-5 py-3 bg-light">
      <div className="container text-center">
        <span className="text-muted">© 2025 Audio Threat Detector. All rights reserved.</span>
        <div className="mt-2">
          <small className="text-muted">
            Current User: JPKrishna28 |
            Current Time: {new Date().toLocaleString()}
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;