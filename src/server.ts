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
// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));
// Servir node_modules para bibliotecas Stacks
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
// Servir bibliotecas Stacks do node_modules
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

// Rota para servir a página HTML
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

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

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

