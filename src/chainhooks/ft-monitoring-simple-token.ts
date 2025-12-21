/**
 * Chainhook: FT Monitoring - simple-token
 * 
 * Registra um chainhook que monitora todos os eventos do token fungível `simple-token`
 * do contrato SP1RSWVNQ7TW839J8V22E9JBHTW6ZQXSNR67HTZE9.simple-token na mainnet da Stacks.
 * 
 * Este hook monitora:
 * - Transferências (ft_transfer): de qualquer carteira para qualquer carteira
 * - Mints (ft_mint): eventos de criação de novos tokens
 * - Burns (ft_burn): eventos de queima de tokens
 * 
 * Requisitos:
 * - Configurar HIRO_API_KEY no arquivo .env
 * - Ter acesso à API de Chainhooks da Hiro
 * 
 * Referências:
 * - https://docs.hiro.so/en/tools/chainhooks/reference/filters#ft-transfer
 * - https://docs.hiro.so/en/tools/chainhooks/reference/filters#ft-mint
 * - https://docs.hiro.so/en/tools/chainhooks/reference/filters#ft-burn
 */

import { createChainhooksClient, DEPLOYER_ADDRESS } from './utils';

// Cria o cliente Chainhooks
const client = createChainhooksClient();

// Configuração do chainhook
const WEBHOOK_URL = 'https://webhook-test.com/52771ab55148dc5fa1e399c8e41d4c11';

// Asset identifier no formato: contract_address.contract_name::token_name
// Para fungible tokens, o contrato geralmente é "ft" e não o nome do contrato
const ASSET_IDENTIFIER = `${DEPLOYER_ADDRESS}.ft::simple-token`;

// Registra e habilita o chainhook
try {
  console.log(`Registrando chainhook para monitorar eventos FT: ${ASSET_IDENTIFIER}`);
  console.log('Eventos monitorados: transfer, mint, burn');
  
  const chainhook = await client.registerChainhook({
    version: '1',
    name: 'ft-monitoring-simple-token',
    chain: 'stacks',
    network: 'mainnet',
    filters: {
      events: [
        {
          type: 'ft_transfer',
          asset_identifier: ASSET_IDENTIFIER,
        },
        {
          type: 'ft_mint',
          asset_identifier: ASSET_IDENTIFIER,
        },
        {
          type: 'ft_burn',
          asset_identifier: ASSET_IDENTIFIER,
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
  console.log('Monitorando eventos FT do asset:', ASSET_IDENTIFIER);
  console.log('Eventos: transfer, mint, burn');
} catch (error) {
  console.error('❌ Erro ao criar chainhook:', error);
  process.exit(1);
}

