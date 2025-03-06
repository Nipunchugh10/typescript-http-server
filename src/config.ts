 export interface ServerConfig {
  port: number;
  host?: string;
  staticDir?: string;
}

export const DEFAULT_CONFIG: ServerConfig = {
  port: 3000,
  host: 'localhost',
  staticDir: 'public'
};
