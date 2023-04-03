import React from 'react';
import { AContainer, AHeader } from '../../theme-components';

const SaveCardScreen = ({navigation}) => {
  return (
    <>
      <AHeader  navigation={navigation} title="Saved Cards" back />
      <AContainer />
    </>
  );
};

export default SaveCardScreen;
