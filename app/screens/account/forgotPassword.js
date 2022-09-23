import React from 'react';
import { AText, AButton } from '../../theme-components';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

const ForgotPasswordScreen = ({ navigation }) => {
  return (
    <>
      <LoginContainer>
        <LinearGradient
          colors={['#EB3349', '#F45C43']}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LoginInner>
            <AText uppercase color="#fff" center mb="20px" large>
              Forgot Password
            </AText>
            <InputWrapper>
              <AText type="email" color="#eee" mb="5px">
                Email
              </AText>
              <CustomInput autoCapitalize="none" />
            </InputWrapper>

            <AButton title="Send Email" block bgColor="#fff" color="#000" />
          </LoginInner>
        </LinearGradient>
      </LoginContainer>
    </>
  );
};

const LoginContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const LoginInner = styled.View`
  width: 90%;
  padding: 20px;
`;

const CustomInput = styled.TextInput`
  height: 40px;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  border-radius: 5px;
`;
const InputWrapper = styled.View`
  margin-bottom: 15px;
  padding: 0 5px;
`;
const FormBottom = styled.View`
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`;
const FormLink = styled.TouchableOpacity``;

export default ForgotPasswordScreen;
