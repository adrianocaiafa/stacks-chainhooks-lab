/**
 * Utilitários compartilhados para criação de chainhooks
 */

import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

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

