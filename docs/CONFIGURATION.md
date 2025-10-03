# Configuration Management

This project uses a centralized configuration system to manage all application settings.

## Configuration Architecture

### 1. Central Configuration File: `config/app.config.ts`

This is the main configuration file that:
- Defines the complete configuration structure with TypeScript interfaces
- Sets default values for all settings
- Merges environment variable overrides
- Provides validation and helper functions
- Centralizes all hardcoded values

### 2. Environment Variables: `.env`

The `.env` file now only contains environment-specific overrides. All default values are defined in `config/app.config.ts`.

### 3. Configuration Structure

```typescript
interface AppConfig {
  app: {
    name: string;           // Application name
    version: string;        // Version number
    environment: string;    // development/production/staging
  };
  
  server: {
    frontend: {
      host: string;         // Frontend server host
      port: number;         // Frontend server port
    };
    backend: {
      host: string;         // Backend server host
      port: number;         // Backend server port
      url: string;          // Full backend URL
    };
  };
  
  database: {
    host: string;           // Database host
    port: number;          // Database port
    name: string;          // Database name
    user: string;          // Database user
    password: string;      // Database password
    schema: string;        // Database schema
    ssl: boolean;          // SSL enabled
  };
  
  api: {
    baseUrl: string;       // API base URL
    timeout: number;       // Request timeout
    maxRetries: number;    // Max retry attempts
  };
  
  ui: {
    defaultRefreshInterval: number;    // Auto-refresh interval
    maxApplicationsDisplay: number;    // Max apps to display
    theme: string;                     // UI theme
  };
  
  features: {
    authEnabled: boolean;      // Authentication enabled
    ssoEnabled: boolean;       // SSO enabled
    exportEnabled: boolean;    // Export functionality
    debugMode: boolean;        // Debug logging
  };
}
```

## Usage Examples

### 1. Using Configuration in Components

```typescript
import { getDatabaseConfig, getApiBaseUrl } from '../config/app.config';

// Get database configuration
const dbConfig = getDatabaseConfig();
console.log(`Connecting to: ${dbConfig.host}:${dbConfig.port}`);

// Get API base URL
const apiUrl = getApiBaseUrl();
fetch(`${apiUrl}/api/data`);
```

### 2. Using Configuration in Services

```typescript
import { appConfig } from '../config/app.config';

// Access any configuration section
const timeout = appConfig.api.timeout;
const debugMode = appConfig.features.debugMode;
```

### 3. Environment Overrides

Set environment variables in `.env` to override defaults:

```bash
# Override frontend port
PORT=3000

# Override backend URL
VITE_API_URL=http://production-server:8080

# Enable debug mode
VITE_DEBUG_MODE=true
```

## Configuration Validation

The configuration system includes validation:

```typescript
import { validateConfig } from '../config/app.config';

const validation = validateConfig();
if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
}
```

## Development vs Production

### Development
- Uses `config/app.config.ts` defaults
- Loads `.env` overrides
- Debug logging enabled
- Local database connections

### Production
- Environment variables override defaults
- Debug logging disabled
- Production database connections
- Optimized settings

## Migration from Old System

### Before (scattered configuration):
```typescript
// Multiple places with hardcoded values
const host = import.meta.env.VITE_DB_HOST || 'localhost';
const port = 8080; // hardcoded in vite.config.ts
const apiUrl = 'http://localhost:3003'; // hardcoded in components
```

### After (centralized configuration):
```typescript
// Single source of truth
import { appConfig } from '../config/app.config';
const host = appConfig.database.host;
const port = appConfig.server.frontend.port;
const apiUrl = appConfig.api.baseUrl;
```

## Benefits

1. **Single Source of Truth**: All configuration in one place
2. **Type Safety**: TypeScript interfaces prevent configuration errors
3. **Environment Flexibility**: Easy to override for different environments
4. **Validation**: Built-in validation prevents runtime errors
5. **Documentation**: Self-documenting configuration structure
6. **Maintainability**: Easy to find and update configuration values

## Files Updated

- `config/app.config.ts` - New centralized configuration
- `vite.config.ts` - Now uses centralized config
- `src/lib/api-config.ts` - Updated to use centralized config
- `src/components/dashboard/DatabaseConnection.tsx` - Updated
- `src/services/cast-database.ts` - Updated
- `src/App.tsx` - Added configuration validation
- `.env` - Simplified to only contain overrides

## Future Enhancements

1. **Runtime Configuration**: Load configuration from external sources
2. **Configuration UI**: Admin interface to modify settings
3. **Environment Templates**: Pre-configured settings for different environments
4. **Configuration Encryption**: Secure sensitive configuration values