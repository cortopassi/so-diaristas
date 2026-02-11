
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Dashboard from './pages/Dashboard';
import RegisterProfessional from './pages/RegisterProfessional';
import RegisterClient from './pages/RegisterClient';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/busca" element={<SearchResults />} />
            <Route path="/painel" element={<Dashboard />} />
            <Route path="/cadastro-profissional" element={<RegisterProfessional />} />
            <Route path="/cadastro-cliente" element={<RegisterClient />} />
            <Route path="/acesso" element={<Login />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <AIAssistant />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
