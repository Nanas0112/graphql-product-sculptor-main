
import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { mockProducts, mockCategories } from './mockData';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

// Reactive variables to store our data
export const productsVar = makeVar([...mockProducts]);
export const categoriesVar = makeVar([...mockCategories]);

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            read() {
              return productsVar();
            }
          },
          categories: {
            read() {
              return categoriesVar();
            }
          }
        }
      }
    }
  }),
  typeDefs,
  resolvers
});
