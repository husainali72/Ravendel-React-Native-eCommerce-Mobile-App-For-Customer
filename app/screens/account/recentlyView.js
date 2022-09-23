import React from 'react';
import { AContainer, AHeader } from '../../theme-components';

const RecentlyViewScreen = ({navigation}) => {
  return (
    <>
      <AHeader navigation={navigation}  title="Recently Viewed" back />
      <AContainer />
    </>
  );
};

export default RecentlyViewScreen;
