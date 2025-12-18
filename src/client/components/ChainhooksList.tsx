import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { showContractCall } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network-v6';
import ChainhookItem from './ChainhookItem';
import './ChainhooksList.css';

export interface Chainhook {
  uuid: string;
  definition: {
    name: string;
    network: string;
    chain: string;
    filters?: {
      events?: Array<{
        type: string;
        contract_identifier?: string;
        function_name?: string;
      }>;
    };
  };
  status: {
    enabled: boolean;
    status: string;
    occurrence_count?: number;
    evaluated_block_count?: number;
  };
}

export interface ChainhooksListHandle {
  reload: () => void;
}

const ChainhooksList = forwardRef<ChainhooksListHandle>((_props, ref) => {
  const [chainhooks, setChainhooks] = useState<Chainhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChainhooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chainhooks');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao carregar chainhooks');
      }

      setChainhooks(result.data || []);
    } catch (err) {
      console.error('Erro ao carregar chainhooks:', err);
      setError((err as Error).message || 'Erro desconhecido ao carregar chainhooks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    try {
      const response = await fetch(`/api/chainhooks/${uuid}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao deletar chainhook');
      }

      loadChainhooks();
    } catch (err) {
      alert('Erro ao deletar chainhook: ' + (err as Error).message);
    }
  };

  const handleCallFunction = async (
    contractIdentifier: string,
    functionName: string,
    network: string
  ) => {
    try {
      const isMainnet = network === 'mainnet';
      const contractAddress = contractIdentifier.split('.')[0];
      const contractName = contractIdentifier.split('.')[1];

      await showContractCall({
        contractAddress,
        contractName,
        functionName,
        functionArgs: [],
        network: isMainnet ? new StacksMainnet() : new StacksTestnet(),
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
    } catch (error) {
      console.error('Erro ao chamar função do contrato:', error);
      alert('Erro ao chamar função: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="chainhooks-list">
        <div className="loading">Carregando chainhooks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chainhooks-list">
        <div className="error">
          <strong>Erro:</strong> {error}
        </div>
      </div>
    );
  }

  if (chainhooks.length === 0) {
    return (
      <div className="chainhooks-list">
        <div className="empty-state">
          <h2>Nenhum chainhook encontrado</h2>
          <p>Você ainda não criou nenhum chainhook.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chainhooks-list">
      {chainhooks.map((chainhook) => (
        <ChainhookItem
          key={chainhook.uuid}
          chainhook={chainhook}
          onDelete={handleDelete}
          onCallFunction={handleCallFunction}
        />
      ))}
    </div>
  );
});

ChainhooksList.displayName = 'ChainhooksList';

export default ChainhooksList;

