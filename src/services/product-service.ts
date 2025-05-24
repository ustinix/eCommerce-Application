import {
  createApiBuilderFromCtpClient,
  ProductPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

const projectKey = 'rss-ecom';

const client = new ClientBuilder()
  .withClientCredentialsFlow({
    host: import.meta.env.VITE_CTP_AUTH_URL,
    projectKey,
    credentials: {
      clientId: import.meta.env.VITE_CTP_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
    },
    scopes: [`view_products:${projectKey}`],
    fetch: globalThis.fetch.bind(globalThis),
  })
  .withHttpMiddleware({
    host: import.meta.env.VITE_CTP_API_URL,
    fetch: globalThis.fetch.bind(globalThis),
  })
  .build();

const apiRoot = createApiBuilderFromCtpClient(client);

export default {
  async getProducts(limit = 20, offset = 0): Promise<ProductPagedQueryResponse> {
    try {
      const response = await apiRoot
        .withProjectKey({ projectKey })
        .products()
        .get({
          queryArgs: {
            limit,
            offset,
          },
        })
        .execute();
      return response.body;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
};
