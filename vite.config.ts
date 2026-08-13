import react from '@vitejs/plugin-react';
import { statSync } from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import type { Plugin } from 'vite';

// https://vitejs.dev/config/
const clientSrcDir = path.resolve(__dirname, 'src/librechat-client');
const webSrcDir = path.resolve(__dirname, 'src');

export default defineConfig({
  root: __dirname,
  base: '/',
  server: {
    host: '127.0.0.1',
    port: 3090,
    strictPort: false,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    {
      name: 'workspace-tilde-resolver',
      enforce: 'pre',
      resolveId(id, importer) {
        if (!id.startsWith('~/')) {
          return null;
        }

        const relativePath = id.slice(2);
        if (importer?.includes('/src/librechat-client/')) {
          const basePath = path.resolve(clientSrcDir, relativePath);
          return resolveWithExtensions(basePath);
        }

        const basePath = path.resolve(webSrcDir, relativePath);
        return resolveWithExtensions(basePath);
      },
    },
    react(),
    sourcemapExclude({ excludeNodeModules: true }),
    compression({
      threshold: 10240,
    }),
  ],
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    sourcemap: false,
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('node_modules')) {
            if (normalizedId.includes('i18next') || normalizedId.includes('react-i18next')) {
              return 'i18n';
            }
            if (normalizedId.includes('date-fns')) {
              return 'date-utils';
            }
            if (normalizedId.includes('@dicebear')) {
              return 'avatars';
            }
            if (normalizedId.includes('react-hook-form')) {
              return 'forms';
            }
            if (normalizedId.includes('react-router-dom')) {
              return 'routing';
            }
            if (normalizedId.includes('react-markdown')) {
              return 'markdown';
            }
            if (normalizedId.includes('@radix-ui')) {
              return 'radix-ui';
            }
            if (normalizedId.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (normalizedId.includes('@headlessui')) {
              return 'headlessui';
            }
            if (normalizedId.includes('zod')) {
              return 'validation';
            }
            return 'vendor';
          }
          if (normalizedId.includes('/src/locales/')) {
            return 'locales';
          }
          return null;
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.[0] && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.names[0])) {
            return 'assets/fonts/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
      onwarn(warning, warn) {
        if (warning.message.includes('Error when using sourcemap')) {
          return;
        }
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('no babel-plugin-flow-react-proptypes')
        ) {
          return;
        }
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 4000,
  },
  resolve: {
    alias: {
      '@librechat/client': path.resolve(__dirname, 'src/librechat-client/index.ts'),
      'librechat-data-provider': path.resolve(__dirname, 'src/librechat-data-provider/index.ts'),
      'librechat-data-provider/react-query': path.resolve(
        __dirname,
        'src/librechat-data-provider/react-query/index.ts',
      ),
      $fonts: path.resolve(__dirname, 'src/assets/fonts'),
    },
  },
});

function resolveWithExtensions(basePath: string) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.json`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
    path.join(basePath, 'index.jsx'),
  ];

  for (const candidate of candidates) {
    try {
      const stat = statSync(candidate);
      if (stat.isFile()) {
        return candidate;
      }
    } catch {
      // continue
    }
  }

  return basePath;
}

interface SourcemapExclude {
  excludeNodeModules?: boolean;
}

function sourcemapExclude(opts?: SourcemapExclude): Plugin {
  return {
    name: 'sourcemap-exclude',
    transform(code: string, id: string) {
      if (opts?.excludeNodeModules && id.includes('node_modules')) {
        return {
          code,
          map: { mappings: '' },
        };
      }
    },
  };
}
