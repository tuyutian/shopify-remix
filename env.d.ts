/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

import {API_VERSION} from "~/types/api";

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WEB_URL: string;
  readonly VITE_API_VERSION: API_VERSION;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
