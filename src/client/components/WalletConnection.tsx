import React, { useState, useEffect } from 'react';
import { showConnect, UserSession, AppConfig } from '@stacks/connect';
import './WalletConnection.css';

interface UserData {
  address?: string;
  profile?: any;
}

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function WalletConnection() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se já existe uma sessão ativa
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet;
      setUserData({ profile: userData.profile, address });
    }
    setLoading(false);
  }, []);

  const connectWallet = async () => {
    try {
      await showConnect({
        appDetails: {
          name: 'Chainhooks Lab',
          icon: window.location.origin + '/favicon.ico',
        },
        onFinish: () => {
          const userData = userSession.loadUserData();
          const address = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet;
          setUserData({ profile: userData.profile, address });
        },
        onCancel: () => {
          console.log('Conexão cancelada');
        },
        userSession,
      });
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      alert('Erro ao conectar carteira: ' + (error as Error).message);
    }
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(null);
  };

  if (loading) {
    return <div className="wallet-section">Carregando...</div>;
  }

  return (
    <div className="wallet-section">
      {userData?.address ? (
        <div className="wallet-info">
          <p>
            <strong>Conectado:</strong>{' '}
            <span className="wallet-address">
              {userData.address.length > 20
                ? userData.address.substring(0, 10) + '...' + userData.address.substring(userData.address.length - 8)
                : userData.address}
            </span>
          </p>
          <button className="btn btn-secondary" onClick={disconnectWallet}>
            Desconectar
          </button>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={connectWallet}>
          🔐 Conectar Carteira
        </button>
      )}
    </div>
  );
}

export default WalletConnection;

