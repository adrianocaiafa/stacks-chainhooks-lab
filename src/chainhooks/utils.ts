/**
 * Utilitários compartilhados para criação de chainhooks
 */

import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Constantes compartilhadas
export const DEPLOYER_ADDRESS = 'SP1RSWVNQ7TW839J8V22E9JBHTW6ZQXSNR67HTZE9';
export const CONTRACT_SIMPLE_GM = `${DEPLOYER_ADDRESS}.simple-gm`;
export const CONTRACT_SIMPLE_REACTIONS = `${DEPLOYER_ADDRESS}.simple-reactions`;
export const CONTRACT_SIMPLE_TOKEN = `${DEPLOYER_ADDRESS}.simple-token`;

/**
 * Cria uma instância do cliente Chainhooks configurada para mainnet
 * @throws {Error} Se HIRO_API_KEY não estiver configurada
 */
export function createChainhooksClient(): ChainhooksClient {
  if (!process.env.HIRO_API_KEY) {
    throw new Error('HIRO_API_KEY não encontrada no arquivo .env');
  }

  return new ChainhooksClient({
    baseUrl: CHAINHOOKS_BASE_URL.mainnet,
    apiKey: process.env.HIRO_API_KEY,
  });
}

/**
 * Valida se a API key está configurada
 */
export function validateApiKey(): void {
  if (!process.env.HIRO_API_KEY) {
    throw new Error('HIRO_API_KEY não encontrada no arquivo .env');
  }
}

