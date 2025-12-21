/**
 * Chainhook: NFT Monitoring - simple-nft
 * 
 * Registra um chainhook que monitora todos os eventos do NFT `simple-nft`
 * da coleção SP1RSWVNQ7TW839J8V22E9JBHTW6ZQXSNR67HTZE9.nft na mainnet da Stacks.
 * 
 * Este hook monitora:
 * - Transferências (nft_transfer): de qualquer carteira para qualquer carteira
 * - Mints (nft_mint): eventos de criação de novos NFTs
 * - Burns (nft_burn): eventos de queima de NFTs
 * 
 * Requisitos:
 * - Configurar HIRO_API_KEY no arquivo .env
 * - Ter acesso à API de Chainhooks da Hiro
 * 
 * Referências:
 * - https://docs.hiro.so/en/tools/chainhooks/reference/filters#nft-transfer
 * - https://docs.hiro.so/en/tools/chainhooks/reference/filters#nft-mint
 * - https://docs.hiro.so/en/tools/chainhooks/reference/filters#nft-burn
 */

import { createChainhooksClient, DEPLOYER_ADDRESS } from './utils';

// Cria o cliente Chainhooks
const client = createChainhooksClient();

// Configuração do chainhook
const WEBHOOK_URL = 'https://webhook-test.com/52771ab55148dc5fa1e399c8e41d4c11';

// Asset identifier no formato: contract_address.contract_name::token_name
// Para NFTs, o contrato geralmente é "nft" e não o nome do contrato
const ASSET_IDENTIFIER = `${DEPLOYER_ADDRESS}.nft::simple-nft`;

// Registra e habilita o chainhook
try {
  console.log(`Registrando chainhook para monitorar eventos NFT: ${ASSET_IDENTIFIER}`);
  console.log('Eventos monitorados: transfer, mint, burn');
  
  const chainhook = await client.registerChainhook({
    version: '1',
    name: 'nft-monitoring-simple-nft',
    chain: 'stacks',
    network: 'mainnet',
    filters: {
      events: [
        {
          type: 'nft_transfer',
          asset_identifier: ASSET_IDENTIFIER,
        },
        {
          type: 'nft_mint',
          asset_identifier: ASSET_IDENTIFIER,
        },
        {
          type: 'nft_burn',
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
  console.log('Monitorando eventos NFT do asset:', ASSET_IDENTIFIER);
  console.log('Eventos: transfer, mint, burn');
} catch (error) {
  console.error('❌ Erro ao criar chainhook:', error);
  process.exit(1);
}

