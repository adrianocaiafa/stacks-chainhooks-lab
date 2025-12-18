import { useState, useEffect } from 'react';
import { showConnect, showContractCall } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/transactions';
import ChainhookList from './components/ChainhookList';
import WalletSection from './components/WalletSection';
import './index.css';

interface Chainhook {
  uuid: string;
  definition: {
    name?: string;
    network?: string;
    chain?: string;
    filters?: {
      events?: Array<{
        type: string;
        contract_identifier?: string;
        function_name?: string;
      }>;
    };
  };
  status?: {
    enabled?: boolean;
    status?: string;
    occurrence_count?: number;
    evaluated_block_count?: number;
  };
}

interface UserData {
  address?: string;
  profile?: any;
}

function App() {
  const [chainhooks, setChainhooks] = useState<Chainhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadChainhooks();
  }, []);

  const loadChainhooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/chainhooks');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao carregar chainhooks');
      }

      setChainhooks(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar chainhooks');
      setChainhooks([]);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      await showConnect({
        appDetails: {
          name: 'Chainhooks Lab',
          icon: window.location.origin + '/favicon.ico',
        },
        onFinish: (data) => {
          const userDataWithAddress = {
            ...data,
            address: data.profile?.stxAddress?.mainnet || data.profile?.stxAddress?.testnet,
          };
          setUserData(userDataWithAddress);
        },
      });
    } catch (err: any) {
      console.error('Erro ao conectar carteira:', err);
      alert('Erro ao conectar carteira: ' + err.message);
    }
  };

  const disconnectWallet = () => {
    setUserData(null);
  };

  const callContractFunction = async (
    contractIdentifier: string,
    functionName: string,
    network: string
  ) => {
    if (!userData) {
      alert('Por favor, conecte sua carteira primeiro!');
      await connectWallet();
      return;
    }

    try {
      const isMainnet = network === 'mainnet';
      const contractAddress = contractIdentifier.split('.')[0];
      const contractName = contractIdentifier.split('.')[1];

      await showContractCall({
        contractAddress,
        contractName,
        functionName,
        functionArgs: [],
        network: isMainnet ? StacksMainnet : StacksTestnet,
        onFinish: (data) => {
          console.log('Transação enviada:', data);
          alert(
            `Transação enviada com sucesso!\nTX ID: ${data.txId || data}\n\nO chainhook será ativado quando a transação for confirmada.`
          );
          loadChainhooks();
        },
        onCancel: () => {
          console.log('Transação cancelada pelo usuário');
        },
      });
    } catch (err: any) {
      console.error('Erro ao chamar função do contrato:', err);
      alert('Erro ao chamar função: ' + err.message);
    }
  };

  const deleteChainhook = async (uuid: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar o chainhook "${name}"?\n\nUUID: ${uuid}\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/chainhooks/${uuid}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao deletar chainhook');
      }

      loadChainhooks();
    } catch (err: any) {
      setError('Erro ao deletar: ' + err.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>🔗 Chainhooks Manager</h1>
            <p>Gerencie seus chainhooks da Stacks Blockchain</p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              Interface web para visualizar e gerenciar seus chainhooks
            </p>
          </div>
          <WalletSection
            userData={userData}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>
      </div>

      {error && (
        <div className="error">
          <strong>Erro:</strong> {error}
        </div>
      )}

      <div className="actions">
        <button className="btn btn-primary" onClick={loadChainhooks}>
          🔄 Atualizar Lista
        </button>
        {loading && <div style={{ color: '#666' }}>Carregando...</div>}
      </div>

      <ChainhookList
        chainhooks={chainhooks}
        loading={loading}
        userData={userData}
        onCallFunction={callContractFunction}
        onDelete={deleteChainhook}
      />
    </div>
  );
}

export default App;

