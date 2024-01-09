/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import store from './app/store';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';
import APclient from './app/Client';
import { NavigationContainer } from '@react-navigation/native';
// import Navigation from './app/navigation';
import DrawerNavigator from './app/navigation/DrawerNavigator';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { LogBox } from 'react-native';

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
  LogBox.ignoreLogs(['Node of type rule not supported as an inline style']);
  return (
    <>
      <Provider store={store}>
        <ApolloProvider client={APclient}>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <DrawerNavigator />
            </NavigationContainer>
          </PaperProvider>
        </ApolloProvider>
      </Provider>
    </>
  );
};

export default App;
