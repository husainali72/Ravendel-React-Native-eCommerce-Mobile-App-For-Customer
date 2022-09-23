import React from 'react';
import { AText, AContainer, AHeader, AButton } from '../../theme-components';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

const SignupScreen = ({ navigation }) => {
  return (
    <>
      <LoginContainer>
        <LinearGradient
          // colors={['#EB3349', '#F45C43']}
          colors={['#eee', '#eee']}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LoginInner>
            <AText uppercase color="#000" center mb="20px" large>
              Sign Up
            </AText>
            <InputWrapper>
              <AText mb="5px">Username</AText>
              <CustomInput autoCapitalize="none" />
            </InputWrapper>
            <InputWrapper>
              <AText mb="5px">Email</AText>
              <CustomInput type="email" secureTextEntry={true} />
            </InputWrapper>
            <InputWrapper>
              <AText mb="5px">Mobile No</AText>
              <CustomInput type="number" secureTextEntry={true} />
            </InputWrapper>
            <InputWrapper>
              <AText mb="5px">Password</AText>
              <CustomInput secureTextEntry={true} />
            </InputWrapper>
            <InputWrapper>
              <AText mb="5px">Confirm Password</AText>
              <CustomInput secureTextEntry={true} />
            </InputWrapper>

            <AButton title="Sign up" block />

            <FormBottom>
              <FormLink
                onPress={() =>
                  navigation.navigate('Login', {
                    initial: false,
                  })
                }>
                <AText>Already Signup?</AText>
              </FormLink>
            </FormBottom>
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

export default SignupScreen;
