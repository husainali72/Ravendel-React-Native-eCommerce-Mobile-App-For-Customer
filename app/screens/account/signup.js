import React from 'react';
import { AText, AContainer, AHeader, AButton, AppLoader } from '../../theme-components';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { Formik } from 'formik';
import { signupValidationSchema } from '../checkout/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { registerAction } from '../../store/action';


const SignupScreen = ({ navigation }) => {
  const loading = useSelector(state => state.login.loading);

  const dispatch =useDispatch()
  const sendValues=(values)=>{
    const registerValue={
      first_name:values.firstname,
      last_name:values.lastname,
      email:values.email,
      password:values.password,
      phone:values.mobile,
      role:"user"
    } 
    dispatch(registerAction(registerValue,navigation))
  }
  return (
    <>
      {loading  ? <AppLoader /> : null}
      <LoginContainer>
        <LinearGradient
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
            <Formik
              initialValues={{
                firstname: "",
                lastname:"",
                email: "",
                mobile: "",
                password: "",
                confirm_password: "",
           
              }}
              validationSchema={signupValidationSchema}
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
                <AText mb="5px">Firstname</AText>
                <CustomInput
                 onChangeText={(text) => setFieldValue("firstname", text)}
                 autoCapitalize="none" 
                 />
                  {touched.firstname && errors.firstname && (
                  <AText color="red" xtrasmall>
                    {errors.firstname}
                  </AText>
                )}
              </InputWrapper>
              <InputWrapper>
                <AText mb="5px">Lastname</AText>
                <CustomInput
                 onChangeText={(text) => setFieldValue("lastname", text)}
                 autoCapitalize="none" 
                 />
                  {touched.lastname && errors.lastname && (
                  <AText color="red" xtrasmall>
                    {errors.lastname}
                  </AText>
                )}
              </InputWrapper>
              <InputWrapper>
                <AText mb="5px">Email</AText>
                <CustomInput
                 type="email" 
                 keyboardType={'email-address'}
                 onChangeText={(text) => setFieldValue("email", text)} />
                  {touched.email && errors.email && (
                  <AText color="red" xtrasmall>
                    {errors.email}
                  </AText>
                )}
              </InputWrapper>
              <InputWrapper>
                <AText mb="5px">Mobile No</AText>
                <CustomInput
                 type="number" 
                 maxLength={15}
                 onChangeText={(text) => setFieldValue("mobile", text)} />
                  {touched.mobile && errors.mobile && (
                  <AText color="red" xtrasmall>
                    {errors.mobile}
                  </AText>
                )}
              </InputWrapper>
              <InputWrapper>
                <AText mb="5px">Password</AText>
                <CustomInput 
                maxLength={30}
                 onChangeText={(text) => setFieldValue("password", text)}
                secureTextEntry={true} />
                 {touched.password && errors.password && (
                  <AText color="red" xtrasmall>
                    {errors.password}
                  </AText>
                )}
              </InputWrapper>
              <InputWrapper>
                <AText mb="5px">Confirm Password</AText>
                <CustomInput 
                maxLength={30}
                 onChangeText={(text) => setFieldValue("confirm_password", text)}
                secureTextEntry={true} />
                 {touched.confirm_password && errors.confirm_password && (
                  <AText color="red" xtrasmall>
                    {errors.confirm_password}
                  </AText>
                )}
              </InputWrapper>

              <AButton
                onPress={submitForm}
                title="Sign up" block />
               </>
              )}
            </Formik>
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

const LoginContainer = styled.ScrollView`
  flex: 1;
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

export default SignupScreen;
