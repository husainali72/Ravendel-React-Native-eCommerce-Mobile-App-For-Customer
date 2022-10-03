import { ApolloClient, InMemoryCache,ApolloLink,createHttpLink,from, ApolloProvider, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken, isEmpty } from './utils/helper';

const httpLink = createHttpLink({
  uri:`https://ravendel.herokuapp.com/graphql`,
});
const authMiddleware = new ApolloLink(async(operation, forward) => {
    const token = await getToken();
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: !isEmpty(token)?token: ''
    }
  }));
  return forward(operation);
})
const APclient = new ApolloClient({
  link: from([
    authMiddleware,
    httpLink
  ]),
  cache: new InMemoryCache(),
});
export default APclient;
