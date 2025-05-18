/* eslint-disable @typescript-eslint/consistent-type-definitions */
interface ImportMetaEnvironment {
  readonly VITE_CTP_PROJECT_KEY: string;
  readonly VITE_CTP_CLIENT_ID: string;
  readonly VITE_CTP_CLIENT_SECRET: string;
  readonly VITE_CTP_CLIENT_PROJECT_KEY: string;
  readonly VITE_CTP_AUTH_URL: string;
  readonly VITE_CTP_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
