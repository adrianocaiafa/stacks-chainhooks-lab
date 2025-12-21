# Chainhooks

Este diretório contém scripts para registrar diferentes tipos de chainhooks na blockchain Stacks.

## Estrutura

Cada arquivo neste diretório representa um chainhook específico que monitora eventos na blockchain.

### Scripts Disponíveis

- **`contract-call-simple-gm.ts`**: Monitora chamadas à função `gm` do contrato `simple-gm`
- **`contract-deploy.ts`**: Monitora deploys de contratos na mainnet (opcionalmente filtra por deployer)
- **`contract-log-simple-reaction.ts`**: Monitora logs/prints do contrato `simple-reactions` (like, dislike, clear-reaction)
- **`ft-transfer-simple-token.ts`**: Monitora transferências FT do token `simple-token` (de qualquer carteira para qualquer)
- **`ft-mint-simple-token.ts`**: Monitora eventos de mint (criação) do token `simple-token`
- **`ft-burn-simple-token.ts`**: Monitora eventos de burn (queima) do token `simple-token`

## Como Usar

Execute os scripts usando npm:

```bash
# Registra o chainhook para monitorar o contrato simple-gm
npm run chainhook:simple-gm

# Registra o chainhook para monitorar deploys de contratos
npm run chainhook:deploy

# Registra o chainhook para monitorar logs do contrato simple-reactions
npm run chainhook:simple-reaction-logs

# Registra chainhooks para monitorar eventos FT do simple-token
npm run chainhook:ft-transfer  # Transferências
npm run chainhook:ft-mint      # Mints (criação)
npm run chainhook:ft-burn      # Burns (queima)
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

