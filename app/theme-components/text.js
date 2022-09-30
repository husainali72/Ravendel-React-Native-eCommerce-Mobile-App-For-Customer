import React from 'react';
import styled from 'styled-components/native';

const AText = styled.Text`
  letter-spacing: 0.5px;
  color: ${props => props.color ?? '#3a3a3a'};
  margin-bottom: ${props => props.mb ?? '0px'};
  margin-top: ${props => props.mt ?? '0px'};
  margin-left: ${props => props.ml ?? '0px'};
  margin-right: ${props => props.mr ?? '0px'};
  padding-bottom: ${props => props.pb ?? '0px'};
  padding-top: ${props => props.pt ?? '0px'};
  padding-left: ${props => props.pl ?? '0px'};
  padding-right: ${props => props.pr ?? '0px'};
  text-decoration-line: ${props =>
    props.lineThrough ? 'line-through' : 'none'};

 
  
  ${({ title, large, medium, small, xtrasmall }) => {
    switch (true) {
      case title:
        return `font-size: 32px`;
      case large:
        return `font-size: 18px`;
      case medium:
        return `font-size: 16px`;
      case small:
        return `font-size: 12px`;
      case xtrasmall:
        return `font-size: 10px`;
      default:
        return `font-size: 14px`;
    }
  }}

  ${({ bold, heavy, light }) => {
    switch (true) {
      case heavy:
        return `font-weight: 700`;
      case bold:
        return `font-weight: 600`;
      case light:
        return `font-weight: 200`;
      default:
        return `font-weight: 400`;
    }
  }}

  ${({ center, right }) => {
    switch (true) {
      case center:
        return `text-align: center`;
      case right:
        return `text-align: right`;
      default:
        `text-align: left`;
    }
  }}

  ${({ uppercase,capitalize }) => {
    switch (true) {
      case uppercase:
        return `text-transform: uppercase`;
      case capitalize:
        return `text-transform: capitalize`;
      default:
        `text-transform: inherit`;
    }
  }}
`;

const TextStyle = ({ ...props }) => {
  return <AText {...props}>{props.children}</AText>;
};

export default TextStyle;
