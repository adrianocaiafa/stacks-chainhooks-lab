/**
 * Chainhook: Contract Deploy
 * 
 * Registra um chainhook que monitora todos os deploys de contratos na mainnet da Stacks.
 * Opcionalmente, pode filtrar por um deployer específico usando o campo `sender`.
 * 
 * Requisitos:
 * - Configurar HIRO_API_KEY no arquivo .env
 * - Ter acesso à API de Chainhooks da Hiro
 * 
 * Referência: https://docs.hiro.so/en/tools/chainhooks/reference/filters#contract-deploy
 */

import { createChainhooksClient, DEPLOYER_ADDRESS } from './utils';

// Cria o cliente Chainhooks
const client = createChainhooksClient();

// Configuração do chainhook
const WEBHOOK_URL = 'https://webhook-test.com/52771ab55148dc5fa1e399c8e41d4c11';

// Registra e habilita o chainhook
try {
  console.log(`Registrando chainhook para monitorar deploys do deployer ${DEPLOYER_ADDRESS}`);
  
  const chainhook = await client.registerChainhook({
    version: '1',
    name: 'contract-deploy-monitor',
    chain: 'stacks',
    network: 'mainnet',
    filters: {
      events: [
        {
          type: 'contract_deploy',
          sender: DEPLOYER_ADDRESS,
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
  console.log('Monitorando deploys do deployer:', DEPLOYER_ADDRESS);
} catch (error) {
  console.error('❌ Erro ao criar chainhook:', error);
  process.exit(1);
}

