import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import Header from './components/layout/Header';
import Builder from './pages/Builder';

function App() {
  console.log('App component rendering');

  return (
    <ResumeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Builder />} />
          </Routes>
        </div>
      </Router>
    </ResumeProvider>
  );
}

export default App;
