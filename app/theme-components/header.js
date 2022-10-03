import React from 'react';
import { StatusBar } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

const AHeader = props => {
  return (
    <>
      <StatusBar backgroundColor="#000" />
      <Appbar style={{ backgroundColor: props.headerColor ? props.headerColor : '#fff' }}>
        {props.back ? (
          <Appbar.BackAction onPress={() => props.navigation.goBack(null)} />
        ) : null}
        <Appbar.Content
          title={props.title}
          style={{ alignItems: props.back ? 'flex-start' : 'center' }}
        />
      </Appbar>
    </>
  );
};

export default AHeader;
