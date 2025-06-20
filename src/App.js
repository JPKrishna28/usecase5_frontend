import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import ResultDetail from './pages/ResultDetail';
import Upload from './pages/Upload';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navigation />
        <main className="container flex-grow-1 my-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/results/:id" element={<ResultDetail />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;