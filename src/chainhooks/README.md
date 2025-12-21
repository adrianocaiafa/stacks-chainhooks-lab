# Chainhooks

Este diretório contém scripts para registrar diferentes tipos de chainhooks na blockchain Stacks.

## Estrutura

Cada arquivo neste diretório representa um chainhook específico que monitora eventos na blockchain.

### Scripts Disponíveis

- **`contract-call-simple-gm.ts`**: Monitora chamadas à função `gm` do contrato `simple-gm`
- **`contract-call-wizard-game.ts`**: Monitora chamadas às funções `cast-spell`, `set-wizard-card`, `set-wizard-token`, `spend-mana-for-xp`, `withdraw-mana` do contrato `wizard-game`
- **`contract-deploy.ts`**: Monitora deploys de contratos na mainnet (opcionalmente filtra por deployer)
- **`contract-log-simple-reaction.ts`**: Monitora logs/prints do contrato `simple-reactions` (like, dislike, clear-reaction)
- **`ft-monitoring-simple-token.ts`**: Monitora todos os eventos FT do token `simple-token` (transfer, mint, burn)
- **`ft-monitoring-wizard-token.ts`**: Monitora todos os eventos FT do token `wizard-token` (transfer, mint, burn)
- **`nft-monitoring-simple-nft.ts`**: Monitora todos os eventos NFT da coleção `simple-nft` (transfer, mint, burn)

## Como Usar

Execute os scripts usando npm:

```bash
# Registra o chainhook para monitorar o contrato simple-gm
npm run chainhook:simple-gm

# Registra o chainhook para monitorar múltiplas funções do contrato wizard-game
npm run chainhook:wizard-game

# Registra o chainhook para monitorar deploys de contratos
npm run chainhook:deploy

# Registra o chainhook para monitorar logs do contrato simple-reactions
npm run chainhook:simple-reaction-logs

# Registra chainhook para monitorar todos os eventos FT do simple-token (transfer, mint, burn)
npm run chainhook:ft-monitoring

# Registra chainhook para monitorar todos os eventos FT do wizard-token (transfer, mint, burn)
npm run chainhook:ft-wizard

# Registra chainhook para monitorar todos os eventos NFT do simple-nft (transfer, mint, burn)
npm run chainhook:nft-monitoring
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

