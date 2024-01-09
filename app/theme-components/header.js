import React from 'react';
import { StatusBar } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { APP_PRIMARY_COLOR } from '../utils/config';

const AHeader = ({ navigation, headerColor, back, title }) => {
  return (
    <>
      <StatusBar backgroundColor={APP_PRIMARY_COLOR} />
      <Appbar
        style={{
          backgroundColor: headerColor ? headerColor : 'transparent',
        }}>
        {back ? (
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        ) : null}
        <Appbar.Content
          title={title}
          style={{ alignItems: back ? 'flex-start' : 'center' }}
        />
      </Appbar>
    </>
  );
};

export default AHeader;
