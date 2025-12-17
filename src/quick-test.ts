/**
 * Quick Test - Validação do Chainhooks Client
 * 
 * Este arquivo testa a criação de um chainhook usando o @hirosystems/chainhooks-client
 * Certifique-se de ter configurado a HIRO_API_KEY no arquivo .env
 */

import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Valida se a API key foi fornecida
if (!process.env.HIRO_API_KEY) {
  throw new Error('HIRO_API_KEY não encontrada no arquivo .env');
}

// Configura o cliente Chainhooks para testnet
const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet, // ou CHAINHOOKS_BASE_URL.mainnet para mainnet
  apiKey: process.env.HIRO_API_KEY,
});

// Register and enable a chainhook
try {
  const chainhook = await client.registerChainhook({
  version: '1',
  name: 'my-first-chainhook',
  chain: 'stacks',
  network: 'testnet',
  filters: {
    events: [
      {
        type: 'contract_call',
        // Substitua pelo identificador do contrato real que deseja monitorar
        contract_identifier: 'SP...XYZ.counter',
        // Substitua pelo nome da função que deseja monitorar
        function_name: 'increment',
      },
    ],
  },
  action: {
    type: 'http_post',
    // URL do webhook que receberá as notificações do chainhook
    url: 'https://example.com/webhooks',
  },
  options: {
    // Decodifica valores Clarity para facilitar o processamento
    decode_clarity_values: true,
    // Habilita o chainhook imediatamente após o registro
    enable_on_registration: true,
  },
});

  console.log('Chainhooks created:', chainhook.uuid);
} catch (error) {
  console.error('Erro ao criar chainhook:', error);
  process.exit(1);
}

