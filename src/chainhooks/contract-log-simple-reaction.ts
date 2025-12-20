/**
 * Chainhook: Contract Log - simple-reactions
 * 
 * Registra um chainhook que monitora eventos de log/print do contrato `simple-reactions`
 * no endereço SP1RSWVNQ7TW839J8V22E9JBHTW6ZQXSNR67HTZE9 na mainnet da Stacks.
 * 
 * Este hook captura todos os logs do contrato, incluindo eventos como:
 * - like
 * - dislike
 * - clear-reaction
 * 
 * Requisitos:
 * - Configurar HIRO_API_KEY no arquivo .env
 * - Ter acesso à API de Chainhooks da Hiro
 * 
 * Referência: https://docs.hiro.so/en/tools/chainhooks/reference/filters#contract-log
 */

import { createChainhooksClient, CONTRACT_SIMPLE_REACTIONS } from './utils';

// Cria o cliente Chainhooks
const client = createChainhooksClient();

// Configuração do chainhook
const WEBHOOK_URL = 'https://webhook-test.com/52771ab55148dc5fa1e399c8e41d4c11';

// Registra e habilita o chainhook
try {
  console.log(`Registrando chainhook para monitorar logs do contrato ${CONTRACT_SIMPLE_REACTIONS}`);
  
  const chainhook = await client.registerChainhook({
    version: '1',
    name: 'contract-log-simple-reactions',
    chain: 'stacks',
    network: 'mainnet',
    filters: {
      events: [
        {
          type: 'contract_log',
          contract_identifier: CONTRACT_SIMPLE_REACTIONS,
        },
      ],
    },
    action: {
      type: 'http_post',
      url: WEBHOOK_URL,
    },
    options: {
      // Decodifica valores Clarity para facilitar o processamento
      decode_clarity_values: true,
      // Habilita o chainhook imediatamente após o registro
      enable_on_registration: true,
    },
  });

  console.log('✅ Chainhook criado com sucesso!');
  console.log('UUID:', chainhook.uuid);
  console.log('Monitorando logs do contrato:', CONTRACT_SIMPLE_REACTIONS);
  console.log('Eventos capturados: like, dislike, clear-reaction');
} catch (error) {
  console.error('❌ Erro ao criar chainhook:', error);
  process.exit(1);
}

