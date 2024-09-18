/// <reference types="vite/client" />

type ClientEnv = import('../server/types/env').Env;

interface ImportMetaEnv extends ClientEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
