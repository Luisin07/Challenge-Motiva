import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Ordens from './components/Ordens';
import Criticos from './components/Criticos';
import FaunaFlora from './components/FaunaFlora';
import './App.css';

function App() {
  const [pagina, setPagina] = useState('dashboard');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          🌿 GreenWatch — Motiva
        </div>
        <div className="navbar-links">
          <button onClick={() => setPagina('dashboard')} className={pagina === 'dashboard' ? 'ativo' : ''}>Dashboard</button>
          <button onClick={() => setPagina('criticos')} className={pagina === 'criticos' ? 'ativo' : ''}>Trechos Críticos</button>
          <button onClick={() => setPagina('ordens')} className={pagina === 'ordens' ? 'ativo' : ''}>Ordens de Serviço</button>
          <button onClick={() => setPagina('fauna')} className={pagina === 'fauna' ? 'ativo' : ''}>Fauna e Flora</button>
        </div>
      </nav>
      <main className="main-content">
        {pagina === 'dashboard' && <Dashboard />}
        {pagina === 'criticos' && <Criticos />}
        {pagina === 'ordens' && <Ordens />}
        {pagina === 'fauna' && <FaunaFlora />}
      </main>
    </div>
  );
}

export default App;