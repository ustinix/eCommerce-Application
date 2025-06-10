import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = 'rss-ecom';

class CommercetoolsClient {
  private static instance: ReturnType<typeof createApiBuilderFromCtpClient>;

  public static getInstance() {
    if (!CommercetoolsClient.instance) {
      const client = new ClientBuilder()
        .withClientCredentialsFlow({
          host: import.meta.env.VITE_CTP_AUTH_URL,
          projectKey,
          credentials: {
            clientId: import.meta.env.VITE_CTP_CLIENT_ID,
            clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
          },
          scopes: [`view_products:${projectKey}`],
        })
        .withHttpMiddleware({
          host: import.meta.env.VITE_CTP_API_URL,
        })
        .build();

      CommercetoolsClient.instance = createApiBuilderFromCtpClient(client);
    }
    return CommercetoolsClient.instance;
  }
}

export default CommercetoolsClient.getInstance();
