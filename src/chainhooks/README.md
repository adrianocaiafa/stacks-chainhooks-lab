# Chainhooks

Este diretório contém scripts para registrar diferentes tipos de chainhooks na blockchain Stacks.

## Estrutura

Cada arquivo neste diretório representa um chainhook específico que monitora eventos na blockchain.

### Scripts Disponíveis

- **`contract-call-simple-gm.ts`**: Monitora chamadas à função `gm` do contrato `simple-gm`

## Como Usar

Execute os scripts usando npm:

```bash
# Registra o chainhook para monitorar o contrato simple-gm
npm run chainhook:simple-gm
```

## Requisitos

- Configurar `HIRO_API_KEY` no arquivo `.env` na raiz do projeto
- Ter acesso à API de Chainhooks da Hiro

## Adicionando Novos Chainhooks

Para adicionar um novo chainhook:

1. Crie um novo arquivo neste diretório seguindo o padrão: `[tipo]-[descrição].ts`
2. Use o arquivo `contract-call-simple-gm.ts` como exemplo
3. Adicione um script correspondente no `package.json`:
   ```json
   "chainhook:nome-descritivo": "tsx src/chainhooks/seu-arquivo.ts"
   ```

