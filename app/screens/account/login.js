import React from 'react';
import { AText, AButton, AppLoader } from '../../theme-components';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { Formik } from 'formik';
import { loginValidationSchema } from '../checkout/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { LoginAction } from '../../store/action';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.login.loading);
  const sendValues=(values)=>{
    dispatch(LoginAction(values.email,values.password,navigation))
  }
  return (
    <>
        {loading  ? <AppLoader /> : null}
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
              Sign IN
            </AText>
            <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginValidationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(false);
              sendValues(values);
               
            }}
            >
               {({
                submitForm,
                isSubmitting,
                touched,
                errors,
                setFieldValue,
                values,
                handleChange,
              }) => (
            <>
            <InputWrapper>
              <AText mb="5px">Email</AText>
              <CustomInput 
                onChangeText={(text) => setFieldValue("email", text)}
              autoCapitalize="none" />
              {touched.email && errors.email && (
                  <AText color="red" xtrasmall>
                    {errors.email}
                  </AText>
                )}
            </InputWrapper>
            <InputWrapper>
              <AText mb="5px">Password</AText>
              <CustomInput
                onChangeText={(text) => setFieldValue("password", text)}
               secureTextEntry={true} />
              {touched.password && errors.password && (
                  <AText color="red" xtrasmall>
                    {errors.password}
                  </AText>
                )}
            </InputWrapper>
            <AButton
            onPress={submitForm}
             title="Sign In" 
             block />
            </>
              )}
            </Formik>

         

            <FormBottom>
              <FormLink
                onPress={() =>
                  navigation.navigate('Signup', {
                    initial: false,
                  })
                }>
                <AText>Join Us</AText>
              </FormLink>
              <FormLink
                onPress={() =>
                  navigation.navigate('ForgotPassword', {
                    initial: false,
                  })
                }>
                <AText>Forgot Password?</AText>
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
  color: #000;
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

export default LoginScreen;
