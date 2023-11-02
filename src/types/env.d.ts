/// <reference types="vite/client" />

interface ImportMetaEnv {
  // readonly VITE_URL: string;
  readonly VITE_INSTANCE_ADDRESS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
