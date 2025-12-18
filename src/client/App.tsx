import React from 'react';
import ChainhooksList from './components/ChainhooksList';
import WalletConnection from './components/WalletConnection';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>🔗 Chainhooks Manager</h1>
            <p>Gerencie seus chainhooks da Stacks Blockchain</p>
            <p className="subtitle">Interface web para visualizar e gerenciar seus chainhooks</p>
          </div>
          <WalletConnection />
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          🔄 Atualizar Lista
        </button>
      </div>

      <ChainhooksList />
    </div>
  );
}

export default App;
