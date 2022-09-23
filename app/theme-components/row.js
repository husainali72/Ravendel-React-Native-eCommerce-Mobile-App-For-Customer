import React from 'react';
import styled from 'styled-components/native';

const ARow = styled.View`
  display: flex;
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  flex-wrap: ${props => (props.wrap ? 'wrap' : 'nowrap')};
  height: ${props => props.height ?? 'auto'};
  padding: ${props => props.padding ?? 5}px;

  ${({justifyContent}) => {
    switch (justifyContent) {
      case 'space-between':
        return `justify-content: space-between`;
      case 'space-evenly':
        return `justify-content: space-evenly`;
      case 'space-around':
        return `justify-content: space-around`;
      case 'center':
        return `justify-content: center`;
      case 'flex-end':
        return `justify-content: flex-end`;
      default:
        return `justify-content: flex-start`;
    }
  }}

  ${({alignItems}) => {
    switch (alignItems) {
      case 'center':
        return `align-items: center`;
      case 'flex-end':
        return `align-items: flex-end`;
      default:
        return `align-items: flex-start`;
    }
  }}
`;

const ContainerStyle = ({...props}) => {
  return <ARow {...props}>{props.children}</ARow>;
};

export default ContainerStyle;
