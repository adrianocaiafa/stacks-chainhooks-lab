/**
 * Chainhook: FT Mint - simple-token
 * 
 * Registra um chainhook que monitora eventos de mint (criação) do token fungível `simple-token`
 * do contrato SP1RSWVNQ7TW839J8V22E9JBHTW6ZQXSNR67HTZE9.simple-token na mainnet da Stacks.
 * 
 * Este hook captura eventos de expansão de supply ou entradas de bridge.
 * 
 * Requisitos:
 * - Configurar HIRO_API_KEY no arquivo .env
 * - Ter acesso à API de Chainhooks da Hiro
 * 
 * Referência: https://docs.hiro.so/en/tools/chainhooks/reference/filters#ft-mint
 */

import { createChainhooksClient, CONTRACT_SIMPLE_TOKEN } from './utils';

// Cria o cliente Chainhooks
const client = createChainhooksClient();

// Configuração do chainhook
const WEBHOOK_URL = 'https://webhook-test.com/52771ab55148dc5fa1e399c8e41d4c11';

// Asset identifier no formato: contract_address.contract_name::token_name
const ASSET_IDENTIFIER = `${CONTRACT_SIMPLE_TOKEN}::simple-token`;

// Registra e habilita o chainhook
try {
  console.log(`Registrando chainhook para monitorar mints FT: ${ASSET_IDENTIFIER}`);
  
  const chainhook = await client.registerChainhook({
    version: '1',
    name: 'ft-mint-simple-token',
    chain: 'stacks',
    network: 'mainnet',
    filters: {
      events: [
        {
          type: 'ft_mint',
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
  console.log('Monitorando mints FT do asset:', ASSET_IDENTIFIER);
} catch (error) {
  console.error('❌ Erro ao criar chainhook:', error);
  process.exit(1);
}

