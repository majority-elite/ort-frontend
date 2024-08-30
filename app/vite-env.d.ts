/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
