type ImportMetaEnvironment = {
  readonly VITE_CTP_PROJECT_KEY: string;
  readonly VITE_CTP_CLIENT_ID: string;
  readonly VITE_CTP_CLIENT_SECRET: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
