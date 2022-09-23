import 'react-native-gesture-handler';
import React from 'react';
import store from './app/store';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';
import APclient from './app/Client';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './app/navigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// XMLHttpRequest = GLOBAL.originalXMLHttpRequest
//   ? GLOBAL.originalXMLHttpRequest
//   : GLOBAL.XMLHttpRequest;

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#000',
    accent: '#000',
  },
};

const App = () => {
  return (
    <>
      <Provider store={store}>
        <ApolloProvider client={APclient}>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <Navigation />
            </NavigationContainer>
          </PaperProvider>
        </ApolloProvider>
      </Provider>
    </>
  );
};

export default App;
