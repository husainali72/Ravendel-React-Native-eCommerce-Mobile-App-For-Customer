import React from 'react';
import styled from 'styled-components/native';
import AText from './text';

const AButton = styled.TouchableOpacity`
  letter-spacing: 0.5px;
  color: ${props => props.color ?? '#fff'};
  background-color: ${props => props.bgColor ?? '#3a3a3a'};
  border-radius: ${props => (props.radius ? props.radius : props.round ? '25px' : '3px')};
  min-width: 100px;
  text-align: center;
  margin: ${props => props.margin ?? '5px auto'} ;
  width: ${props => (props.block ? '95%' : 'auto')}
    ${({ large, medium, small }) => {
    switch (true) {
      case large:
        return `font-size: 18px; padding: 18px 24px`;
      case medium:
        return `font-size: 16px; padding: 14px 18px`;
      case small:
        return `font-size: 10px; padding: 5px 10px`;
      default:
        return `font-size: 14px; padding: 10px 15px`;
    }
  }};
`;

const ButtonStyle = ({ ...props }) => {
  return (
    <AButton {...props}>
      <AText color={props.color ?? '#fff'} center uppercase>
        {props.title}
      </AText>
    </AButton>
  );
};

export default ButtonStyle;
