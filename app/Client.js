import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  from,
  ApolloProvider,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken, isEmpty } from './utils/helper';

const httpLink = createHttpLink({
  // uri:`https://ravendel.herokuapp.com/graphql`,
  // uri: `http://192.168.1.31:8000/graphql`,
  uri: `https://demo1.ravendel.io/graphql`,
});
const authMiddleware = new ApolloLink(async (operation, forward) => {
  const token = await getToken();
  // console.log(token, 'token');
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: !isEmpty(token) ? token : '',
    },
  }));
  return forward(operation);
});
const APclient = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache(),
});
export default APclient;
