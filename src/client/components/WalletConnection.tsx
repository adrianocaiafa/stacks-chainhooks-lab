import React, { useState, useEffect } from 'react';
import { showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/transactions';
import './WalletConnection.css';

interface UserData {
  address?: string;
  profile?: any;
}

function WalletConnection() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const connectWallet = async () => {
    try {
      await showConnect({
        appDetails: {
          name: 'Chainhooks Lab',
          icon: window.location.origin + '/favicon.ico',
        },
        onFinish: (data) => {
          const address = data.profile?.stxAddress?.mainnet || data.profile?.stxAddress?.testnet;
          setUserData({ ...data, address });
          window.location.reload();
        },
      });
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      alert('Erro ao conectar carteira: ' + (error as Error).message);
    }
  };

  const disconnectWallet = () => {
    setUserData(null);
    window.location.reload();
  };

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

