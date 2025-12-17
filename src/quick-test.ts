import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Valida se a API key foi fornecida
if (!process.env.HIRO_API_KEY) {
  throw new Error('HIRO_API_KEY não encontrada no arquivo .env');
}

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet, // or CHAINHOOKS_BASE_URL.mainnet
  apiKey: process.env.HIRO_API_KEY,
});

// Register and enable a chainhook
const chainhook = await client.registerChainhook({
  version: '1',
  name: 'my-first-chainhook',
  chain: 'stacks',
  network: 'testnet',
  filters: {
    events: [
      {
        type: 'contract_call',
        contract_identifier: 'SP...XYZ.counter',
        function_name: 'increment',
      },
    ],
  },
  action: {
    type: 'http_post',
    url: 'https://example.com/webhooks',
  },
  options: {
    decode_clarity_values: true,
    enable_on_registration: true,
  },
});

console.log('Chainhooks created:', chainhook.uuid);

