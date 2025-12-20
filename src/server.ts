import express from 'express';
import cors from 'cors';
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Carrega variáveis de ambiente
dotenv.config();

// Configuração para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Valida se a API key foi fornecida
if (!process.env.HIRO_API_KEY) {
  throw new Error('HIRO_API_KEY não encontrada no arquivo .env');
}

// Inicializa o cliente Chainhooks
const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.mainnet,
  apiKey: process.env.HIRO_API_KEY,
});

const app = express();
// Porta padrão: 3000, pode ser configurada via variável de ambiente PORT
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes - devem vir antes do static para não serem sobrescritas

// API: Listar todos os chainhooks com suporte a paginação
app.get('/api/chainhooks', async (req, res) => {
  try {
    const { offset = 0, limit = 60 } = req.query;
    // Limita o máximo de itens por página a 60 (limite da API)
    const limitValue = Math.min(Number(limit), 60);
    const offsetValue = Math.max(Number(offset), 0);
    
    const response = await client.getChainhooks({
      offset: offsetValue,
      limit: limitValue,
    });
    res.json({ success: true, data: response.results || [] });
  } catch (error: any) {
    console.error('Erro ao listar chainhooks:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erro ao listar chainhooks' 
    });
  }
});

// API: Deletar um chainhook
app.delete('/api/chainhooks/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    await client.deleteChainhook(uuid);
    res.json({ success: true, message: 'Chainhook deletado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar chainhook:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erro ao deletar chainhook' 
    });
  }
});

// API: Obter detalhes de um chainhook específico
app.get('/api/chainhooks/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const chainhook = await client.getChainhook(uuid);
    res.json({ success: true, data: chainhook });
  } catch (error: any) {
    console.error('Erro ao obter chainhook:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erro ao obter chainhook' 
    });
  }
});

// Endpoint para buscar interface do contrato (funções públicas)
app.get('/api/contracts/:address/:name/interface', async (req, res) => {
  try {
    const { address, name } = req.params;
    const network = (req.query.network as string) || 'mainnet';
    
    // API base URL da Stacks
    const apiBaseUrl = network === 'mainnet' 
      ? 'https://api.hiro.so'
      : 'https://api.testnet.hiro.so';
    
    const response = await fetch(`${apiBaseUrl}/v2/contracts/interface/${address}/${name}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar interface do contrato: ${response.statusText}`);
    }
    
    const contractInterface = await response.json();
    
    // Filtra apenas funções públicas (não read-only)
    const publicFunctions = (contractInterface.functions || []).filter(
      (fn: any) => fn.access === 'public' || fn.access === 'private'
    );
    
    res.json({ 
      success: true, 
      data: {
        functions: publicFunctions,
        contractInterface
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar interface do contrato:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erro ao buscar interface do contrato' 
    });
  }
});

// Inicia o servidor na porta especificada
// Servir arquivos estáticos do build do React (em produção)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/client')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/client/index.html'));
  });
}

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`🚀 Servidor API rodando em http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📱 Frontend React disponível em http://localhost:5173 (via Vite)`);
    console.log(`💡 Execute 'npm run dev' para rodar tudo junto!`);
  }
});

