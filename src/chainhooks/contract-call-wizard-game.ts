/**
 * Chainhook: Contract Call - wizard-game
 * 
 * Registra um chainhook que monitora chamadas de funções específicas do contrato `wizard-game`
 * (SP1RSWVNQ7TW839J8V22E9JBHTW6ZQXSNR67HTZE9.wizard-game) na mainnet da Stacks.
 * 
 * Este hook monitora as seguintes funções:
 * - cast-spell: Lança uma magia no jogo
 * - set-wizard-card: Define uma carta de mago
 * - set-wizard-token: Define o token do mago
 * - spend-mana-for-xp: Gasta mana para ganhar experiência
 * - withdraw-mana: Retira mana
 * 
 * Requisitos:
 * - Configurar HIRO_API_KEY no arquivo .env
 * - Ter acesso à API de Chainhooks da Hiro
 * 
 * Referências:
 * - https://docs.hiro.so/en/tools/chainhooks/reference/filters#contract-call
 */

import { createChainhooksClient, DEPLOYER_ADDRESS } from './utils';

// Cria o cliente Chainhooks
const client = createChainhooksClient();

// Configuração do chainhook
const WEBHOOK_URL = 'https://webhook-test.com/52771ab55148dc5fa1e399c8e41d4c11';
const CONTRACT_IDENTIFIER = `${DEPLOYER_ADDRESS}.wizard-game`;

// Funções a serem monitoradas
const FUNCTIONS_TO_MONITOR = [
  'cast-spell',
  'set-wizard-card',
  'set-wizard-token',
  'spend-mana-for-xp',
  'withdraw-mana',
];

// Registra e habilita o chainhook
try {
  console.log(`Registrando chainhook para monitorar chamadas ao contrato: ${CONTRACT_IDENTIFIER}`);
  console.log('Funções monitoradas:', FUNCTIONS_TO_MONITOR.join(', '));
  
  const chainhook = await client.registerChainhook({
    version: '1',
    name: 'contract-call-wizard-game',
    chain: 'stacks',
    network: 'mainnet',
    filters: {
      events: FUNCTIONS_TO_MONITOR.map((functionName) => ({
        type: 'contract_call',
        contract_identifier: CONTRACT_IDENTIFIER,
        function_name: functionName,
      })),
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
  console.log('Monitorando contrato:', CONTRACT_IDENTIFIER);
  console.log('Funções monitoradas:', FUNCTIONS_TO_MONITOR.join(', '));
} catch (error) {
  console.error('❌ Erro ao criar chainhook:', error);
  process.exit(1);
}

