import React, { useState, useEffect } from 'react';
import './ChainhookItem.css';

interface Chainhook {
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

interface ContractFunction {
  name: string;
  access: string;
  args: Array<{ name: string; type: string }>;
}

interface ChainhookItemProps {
  chainhook: Chainhook;
  onDelete: (uuid: string) => void;
  onCallFunction: (contractIdentifier: string, functionName: string, network: string) => void;
}

function ChainhookItem({ chainhook, onDelete, onCallFunction }: ChainhookItemProps) {
  const { definition, status } = chainhook;
  const name = definition.name || 'Sem nome';
  const isEnabled = status.enabled !== false;
  const statusText = status.status || 'unknown';
  const occurrenceCount = status.occurrence_count || 0;
  const evaluatedBlocks = status.evaluated_block_count || 0;
  const events = definition.filters?.events || [];

  const contractCallEvents = events.filter((e) => e.type === 'contract_call');
  const firstContractCall = contractCallEvents[0];
  
  // Buscar funções públicas quando o evento for contract_log
  const contractLogEvents = events.filter((e) => e.type === 'contract_log');
  const firstContractLog = contractLogEvents[0];
  const [publicFunctions, setPublicFunctions] = useState<ContractFunction[]>([]);
  const [loadingFunctions, setLoadingFunctions] = useState(false);

  useEffect(() => {
    const loadContractFunctions = async () => {
      if (!firstContractLog?.contract_identifier) return;
      
      try {
        setLoadingFunctions(true);
        const [contractAddress, contractName] = firstContractLog.contract_identifier.split('.');
        const network = definition.network || 'mainnet';
        
        const response = await fetch(
          `/api/contracts/${contractAddress}/${contractName}/interface?network=${network}`
        );
        
        if (!response.ok) {
          throw new Error('Erro ao buscar funções do contrato');
        }
        
        const result = await response.json();
        if (result.success && result.data.functions) {
          setPublicFunctions(result.data.functions);
        } else if (!result.success) {
          console.warn('Contrato não encontrado ou sem funções públicas:', result.error);
        }
      } catch (error) {
        console.error('Erro ao carregar funções do contrato:', error);
        // Não define erro de estado para não quebrar a UI, apenas loga
      } finally {
        setLoadingFunctions(false);
      }
    };

    if (firstContractLog) {
      loadContractFunctions();
    }
  }, [firstContractLog, definition.network]);

  const handleDelete = () => {
    if (
      confirm(
        `Tem certeza que deseja deletar o chainhook "${name}"?\n\nUUID: ${chainhook.uuid}\n\nEsta ação não pode ser desfeita.`
      )
    ) {
      onDelete(chainhook.uuid);
    }
  };

  return (
    <div className="chainhook-item">
      <div className="chainhook-info">
        <h3>
          {name}
          {isEnabled ? (
            <span className="badge badge-enabled">Ativo</span>
          ) : (
            <span className="badge badge-disabled">Inativo</span>
          )}
          <span className="badge badge-status">{statusText}</span>
        </h3>
        <p>
          <strong>Rede:</strong> {definition.network || 'N/A'}
        </p>
        <p>
          <strong>Cadeia:</strong> {definition.chain || 'N/A'}
        </p>
        {events.length > 0 && (
          <div className="events-section">
            <p>
              <strong>Eventos ({events.length}):</strong>
            </p>
            {events.map((event, index) => (
              <div key={index} className="event-details">
                <p>
                  <strong>Tipo:</strong> {event.type}
                </p>
                {event.contract_identifier && (
                  <p>
                    <strong>Contrato:</strong>{' '}
                    <code className="code-block">{event.contract_identifier}</code>
                  </p>
                )}
                {event.function_name && (
                  <p>
                    <strong>Função:</strong> <code className="code-block">{event.function_name}</code>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {occurrenceCount > 0 && (
          <p>
            <strong>Ocorrências:</strong> {occurrenceCount}
          </p>
        )}
        {evaluatedBlocks > 0 && (
          <p>
            <strong>Blocos avaliados:</strong> {evaluatedBlocks.toLocaleString()}
          </p>
        )}
        <div className="chainhook-uuid">UUID: {chainhook.uuid}</div>
      </div>
      <div className="chainhook-actions">
        {/* Botão para contract_call */}
        {firstContractCall && firstContractCall.contract_identifier && firstContractCall.function_name && (
          <button
            className="btn btn-success"
            onClick={() =>
              onCallFunction(firstContractCall.contract_identifier!, firstContractCall.function_name!, definition.network || 'mainnet')
            }
          >
            ⚡ Chamar {firstContractCall.function_name}
          </button>
        )}
        
        {/* Botões para contract_log - exibe funções públicas do contrato */}
        {firstContractLog && firstContractLog.contract_identifier && (
          <div className="contract-functions-section">
            {loadingFunctions ? (
              <p className="loading-functions">Carregando funções...</p>
            ) : publicFunctions.length > 0 ? (
              publicFunctions.map((fn) => (
                <button
                  key={fn.name}
                  className="btn btn-success"
                  onClick={() =>
                    onCallFunction(firstContractLog.contract_identifier!, fn.name, definition.network || 'mainnet')
                  }
                >
                  ⚡ Chamar {fn.name}
                </button>
              ))
            ) : null}
          </div>
        )}
        
        <button className="btn btn-danger" onClick={handleDelete}>
          🗑️ Deletar
        </button>
      </div>
    </div>
  );
}

export default ChainhookItem;

