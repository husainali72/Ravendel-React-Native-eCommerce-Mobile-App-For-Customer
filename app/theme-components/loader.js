import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, Modal } from 'react-native';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const AView = styled.View`
  flex: 1;
  height: ${windowHeight}px;
  width: ${windowWidth}px;
  background-color: 'rgba(0,0,0,0.6)';
  justify-content: center;
  align-items: center;
`;
const ALoader = styled.ActivityIndicator``;
const AText = styled.Text`
  color: #fff;
  margin-top: 10px;
`;

const AppLoader = () => {
  return (
    <Modal transparent={true} animationType={'none'}>
      <AView>
        <ALoader size="large" color="#fff" />
        <AText>Success is loading. Keep patience!!!</AText>
      </AView>
    </Modal>
  );
};

export default AppLoader;
