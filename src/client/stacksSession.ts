import { UserSession, AppConfig } from '@stacks/connect';

// Cria uma única instância compartilhada de AppConfig e UserSession
// para que todos os componentes usem a mesma sessão
export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

