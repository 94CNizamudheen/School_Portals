interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly NODE_ENV: 'development' | 'production' | 'test';
 
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}