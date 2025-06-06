import type { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type { Product, ProductData } from '@commercetools/platform-sdk';

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
  async getProducts(
    limit = 100,
    offset = 0,
    sort?: string[],
    currency = 'USD',
    searchParameters?: string,
    filters?: {
      categories?: string[];
      brands?: string[];
      sportTypes?: string[];
    },
  ): Promise<ProductProjectionPagedSearchResponse> {
    try {
      const queryArguments: {
        limit: number;
        offset: number;
        sort?: string[];
        priceCurrency: string;
        staged: boolean;
        priceCountry: string;
        'filter.query'?: string[];
        'text.en-US'?: string;
        fuzzy?: boolean;
      } = {
        limit,
        offset,
        sort: sort || undefined,
        priceCurrency: currency,
        staged: true,
        priceCountry: 'US',
      };

      if (searchParameters) {
        queryArguments['text.en-US'] = searchParameters;
        queryArguments.fuzzy = true;
      }

      if (filters?.categories?.length || filters?.brands?.length || filters?.sportTypes?.length) {
        const filterQueries: string[] = [];

        if (filters?.categories?.length) {
          filterQueries.push(`categories.id:${filters.categories.map(id => `"${id}"`).join(',')}`);
        }

        if (filters?.brands?.length) {
          filterQueries.push(`variants.attributes.brand:"${filters.brands.join('","')}"`);
        }

        if (filters?.sportTypes?.length) {
          filterQueries.push(`variants.attributes.sport-type:"${filters.sportTypes.join('","')}"`);
        }

        queryArguments['filter.query'] = filterQueries;
      }

      const response = await apiRoot
        .withProjectKey({ projectKey })
        .productProjections()
        .search()
        .get({
          queryArgs: queryArguments,
        })
        .execute();
      return response.body;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
};
export async function getProductById(id: string): Promise<ProductData> {
  const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
  const response = await apiRoot.products().withId({ ID: id }).get().execute();
  const product: Product = response.body;
  console.log('product', response.body);
  const currentData: ProductData = product.masterData.current;
  return currentData;
}
