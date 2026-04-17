import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Ordens from './components/Ordens';
import Criticos from './components/Criticos';
import FaunaFlora from './components/FaunaFlora';
import Conformidade from './components/Conformidade';
import Resumo from './components/Resumo';
import './App.css';

function App() {
  const [pagina, setPagina] = useState('dashboard');
  const [violacoes, setViolacoes] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/conformidade')
      .then(r => r.json())
      .then(d => setViolacoes(d.violacoes_iminentes));
  }, []);

  const btn = (id, label, badge) => (
    <button onClick={() => setPagina(id)} className={pagina === id ? 'ativo' : ''} style={{position:'relative'}}>
      {label}
      {badge > 0 && (
        <span style={{
          position:'absolute', top:-6, right:-6,
          background:'#ef4444', color:'#fff',
          borderRadius:'50%', width:18, height:18,
          fontSize:11, fontWeight:700,
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">🌿 GreenWatch — Motiva</div>
        <div className="navbar-links">
          {btn('dashboard', 'Dashboard', 0)}
          {btn('criticos', 'Trechos Críticos', 0)}
          {btn('ordens', 'Ordens de Serviço', 0)}
          {btn('fauna', 'Fauna e Flora', 0)}
          {btn('conformidade', 'Conformidade', violacoes)}
          {btn('resumo', 'Resumo Executivo', 0)}
        </div>
      </nav>
      <main className="main-content">
        {pagina === 'dashboard' && <Dashboard />}
        {pagina === 'criticos' && <Criticos />}
        {pagina === 'ordens' && <Ordens />}
        {pagina === 'fauna' && <FaunaFlora />}
        {pagina === 'conformidade' && <Conformidade />}
        {pagina === 'resumo' && <Resumo />}
      </main>
    </div>
  );
}

export default App;