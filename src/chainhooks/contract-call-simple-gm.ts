/**
 * Chainhook: Contract Call - simple-gm
 * 
 * Registra um chainhook que monitora chamadas à função `gm` do contrato `simple-gm`
 * no endereço SP1RSWVNQ7TW839J8V22E9JBHTW6ZQXSNR67HTZE9 na mainnet da Stacks.
 * 
 * Requisitos:
 * - Configurar HIRO_API_KEY no arquivo .env
 * - Ter acesso à API de Chainhooks da Hiro
 */

import { createChainhooksClient, CONTRACT_SIMPLE_GM } from './utils';

// Cria o cliente Chainhooks
const client = createChainhooksClient();

// Configuração do chainhook
const FUNCTION_NAME = 'gm';
const WEBHOOK_URL = 'https://webhook-test.com/52771ab55148dc5fa1e399c8e41d4c11';

// Registra e habilita o chainhook
try {
  console.log(`Registrando chainhook para monitorar: ${CONTRACT_SIMPLE_GM}::${FUNCTION_NAME}`);
  
  const chainhook = await client.registerChainhook({
    version: '1',
    name: 'my-first-chainhook',
    chain: 'stacks',
    network: 'mainnet',
    filters: {
      events: [
        {
          type: 'contract_call',
          contract_identifier: CONTRACT_SIMPLE_GM,
          function_name: FUNCTION_NAME,
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
} catch (error) {
  console.error('❌ Erro ao criar chainhook:', error);
  process.exit(1);
}

