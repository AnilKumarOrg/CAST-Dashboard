// Project Configuration
// This file centralizes all configuration values for the CAST DataMart Dashboard

/// <reference types="vite/client" />

export interface AppConfig {
  // Application Info
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'staging';
  };
  
  // Server Configuration
  server: {
    frontend: {
      host: string;
      port: number;
    };
    backend: {
      host: string;
      port: number;
      url: string;
    };
  };
  
  // Database Configuration
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    schema: string;
    ssl: boolean;
  };
  
  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
    maxRetries: number;
  };
  
  // UI Configuration
  ui: {
    defaultRefreshInterval: number;
    maxApplicationsDisplay: number;
    theme: 'light' | 'dark' | 'auto';
  };
  
  // Feature Flags
  features: {
    authEnabled: boolean;
    ssoEnabled: boolean;
    exportEnabled: boolean;
    debugMode: boolean;
  };
}

// Default configuration values
const defaultConfig: AppConfig = {
  app: {
    name: 'CAST Executive Dashboard',
    version: '1.0.0',
    environment: 'development',
  },
  
  server: {
    frontend: {
      host: '::',
      port: 9999,
    },
    backend: {
      host: 'localhost',
      port: 8888,
      url: 'http://localhost:8888',
    },
  },
  
  database: {
    host: 'akulap4',
    port: 2284,
    name: 'postgres',
    user: 'operator',
    password: 'CastAIP',
    schema: 'datamart',
    ssl: false,
  },
  
  api: {
    baseUrl: 'http://localhost:8888',
    timeout: 30000,
    maxRetries: 3,
  },
  
  ui: {
    defaultRefreshInterval: 300000, // 5 minutes
    maxApplicationsDisplay: 50,
    theme: 'auto',
  },
  
  features: {
    authEnabled: false,
    ssoEnabled: false,
    exportEnabled: true,
    debugMode: false,
  },
};

// Environment variable overrides
const getConfigFromEnv = (): Partial<AppConfig> => {
  // Access Vite environment variables
  const env = import.meta.env;
  
  return {
    app: {
      name: env.VITE_APP_NAME || defaultConfig.app.name,
      version: env.VITE_APP_VERSION || defaultConfig.app.version,
      environment: (env.VITE_NODE_ENV as any) || defaultConfig.app.environment,
    },
    
    server: {
      frontend: {
        host: env.VITE_FRONTEND_HOST || defaultConfig.server.frontend.host,
        port: parseInt(env.PORT) || parseInt(env.VITE_FRONTEND_PORT) || defaultConfig.server.frontend.port,
      },
      backend: {
        host: env.VITE_BACKEND_HOST || defaultConfig.server.backend.host,
        port: parseInt(env.VITE_BACKEND_PORT) || defaultConfig.server.backend.port,
        url: env.VITE_API_URL || defaultConfig.server.backend.url,
      },
    },
    
    database: {
      host: env.VITE_DB_HOST || defaultConfig.database.host,
      port: parseInt(env.VITE_DB_PORT) || defaultConfig.database.port,
      name: env.VITE_DB_NAME || defaultConfig.database.name,
      user: env.VITE_DB_USER || defaultConfig.database.user,
      password: env.VITE_DB_PASSWORD || defaultConfig.database.password,
      schema: env.VITE_DB_SCHEMA || defaultConfig.database.schema,
      ssl: env.VITE_DB_SSL === 'true' || defaultConfig.database.ssl,
    },
    
    api: {
      baseUrl: env.VITE_API_URL || defaultConfig.api.baseUrl,
      timeout: parseInt(env.VITE_API_TIMEOUT) || defaultConfig.api.timeout,
      maxRetries: parseInt(env.VITE_API_MAX_RETRIES) || defaultConfig.api.maxRetries,
    },
    
    ui: {
      defaultRefreshInterval: parseInt(env.VITE_DEFAULT_REFRESH_INTERVAL) || defaultConfig.ui.defaultRefreshInterval,
      maxApplicationsDisplay: parseInt(env.VITE_MAX_APPLICATIONS_DISPLAY) || defaultConfig.ui.maxApplicationsDisplay,
      theme: (env.VITE_THEME as any) || defaultConfig.ui.theme,
    },
    
    features: {
      authEnabled: env.VITE_AUTH_ENABLED === 'true' || defaultConfig.features.authEnabled,
      ssoEnabled: env.VITE_SSO_ENABLED === 'true' || defaultConfig.features.ssoEnabled,
      exportEnabled: env.VITE_EXPORT_ENABLED !== 'false' && defaultConfig.features.exportEnabled,
      debugMode: env.VITE_DEBUG_MODE === 'true' || defaultConfig.features.debugMode,
    },
  };
};

// Deep merge utility function
const deepMerge = (target: any, source: any): any => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Final configuration - merges defaults with environment overrides
export const appConfig: AppConfig = deepMerge(defaultConfig, getConfigFromEnv());

// Validation function
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate required database fields
  if (!appConfig.database.host) errors.push('Database host is required');
  if (!appConfig.database.port) errors.push('Database port is required');
  if (!appConfig.database.name) errors.push('Database name is required');
  if (!appConfig.database.user) errors.push('Database user is required');
  
  // Validate server configuration
  if (!appConfig.server.frontend.port) errors.push('Frontend port is required');
  if (!appConfig.server.backend.port) errors.push('Backend port is required');
  if (!appConfig.server.backend.url) errors.push('Backend URL is required');
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper functions for common config access
export const getApiBaseUrl = () => appConfig.api.baseUrl;
export const getDatabaseConfig = () => appConfig.database;
export const getServerConfig = () => appConfig.server;
export const getUIConfig = () => appConfig.ui;
export const getFeatures = () => appConfig.features;

// Debug function to log configuration (for development)
export const logConfig = () => {
  if (appConfig.features.debugMode) {
    console.group('🔧 App Configuration');
    console.log('Environment:', appConfig.app.environment);
    console.log('Frontend Port:', appConfig.server.frontend.port);
    console.log('Backend URL:', appConfig.server.backend.url);
    console.log('Database:', `${appConfig.database.host}:${appConfig.database.port}/${appConfig.database.name}`);
    console.log('API Base URL:', appConfig.api.baseUrl);
    console.log('Features:', appConfig.features);
    console.groupEnd();
  }
};

export default appConfig;