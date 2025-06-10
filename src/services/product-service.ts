import type { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import type { Product, ProductData } from '@commercetools/platform-sdk';
import apiRoot from '../services/сlient-credentials-flow';

const projectKey = 'rss-ecom';

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
        Object.assign(queryArguments, {
          'text.en-US': searchParameters,
          fuzzy: true,
        });
      }

      const filterQueries = [
        filters?.categories?.length
          ? `categories.id:${filters.categories.map(id => `"${id}"`).join(',')}`
          : undefined,
        filters?.brands?.length
          ? `variants.attributes.brand:"${filters.brands.join('","')}"`
          : undefined,
        filters?.sportTypes?.length
          ? `variants.attributes.sport-type:"${filters.sportTypes.join('","')}"`
          : undefined,
      ].filter((item): item is string => item !== undefined);

      if (filterQueries.length > 0) {
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
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .products()
    .withId({ ID: id })
    .get()
    .execute();
  const product: Product = response.body;
  const currentData: ProductData = product.masterData.current;
  return currentData;
}
