/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOCATIONIQ_KEY: string;
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
