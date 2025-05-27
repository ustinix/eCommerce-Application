import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ProductPagedQueryResponse } from '@commercetools/platform-sdk';

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
  })
  .withHttpMiddleware({
    host: import.meta.env.VITE_CTP_API_URL,
  })
  .build();

const apiRoot = createApiBuilderFromCtpClient(client);

export default {
  async getProducts(limit = 100, offset = 0): Promise<ProductProjectionPagedQueryResponse> {
    try {
      const response = await apiRoot
        .withProjectKey({ projectKey })
        .productProjections()
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
