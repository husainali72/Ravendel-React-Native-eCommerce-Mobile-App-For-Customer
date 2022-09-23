import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createUploadLink} from 'apollo-upload-client';
import {ApolloLink} from 'apollo-link';

const httpLink = new createUploadLink({
  uri: `https://ravendel-backend.hbwebsol.com/graphql`,
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: '',
    },
  });
  // Call the next link in the middleware chain.
  return forward(operation);
});
 
const APclient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default APclient;
