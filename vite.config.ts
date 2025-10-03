import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  // Configuration with fallback values
  const frontendHost = env.VITE_FRONTEND_HOST || "::";
  const frontendPort = parseInt(env.PORT) || parseInt(env.VITE_FRONTEND_PORT) || 9999;
  const backendUrl = env.VITE_API_URL || "http://localhost:8888";

  return {
    server: {
      host: frontendHost,
      port: frontendPort,
      proxy: {
        // Proxy API requests to the backend during development
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
