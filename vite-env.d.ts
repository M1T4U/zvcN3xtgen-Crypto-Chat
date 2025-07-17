/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string;
  // add more VITE_ variables if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
