import React from 'react';
import styled from 'styled-components/native';

const AContainer = styled.ScrollView`
  flex: 1;
  background-color: #fff;
  padding: ${props => (props.withoutPadding ? '0' : '10px')};
`;

const ContainerStyle = (props) => {

  return (
    <AContainer {...props}>
      {props.children}
    </AContainer>
  );
};

export default ContainerStyle;
