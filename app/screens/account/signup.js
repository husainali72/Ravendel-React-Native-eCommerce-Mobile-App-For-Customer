import React from 'react';
import {
  AText,
  AContainer,
  AHeader,
  AButton,
  AppLoader,
  TextInput,
  RadioButton,
} from '../../theme-components';
// import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { Formik, useFormik } from 'formik';
import { signupValidationSchema } from '../checkout/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { registerAction } from '../../store/action';

const SignupScreen = ({ navigation }) => {
  const loading = useSelector((state) => state.login.loading);

  const dispatch = useDispatch();
  const sendValues = (values) => {
    const registerValue = {
      first_name: values.firstname,
      last_name: values.lastname,
      email: values.email,
      password: values.password,
      phone: values.mobile,
      role: 'user',
    };
    dispatch(registerAction(registerValue, navigation));
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      mobile: '',
      password: '',
      confirm_password: '',
      policy: '',
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      sendValues(values);
      resetForm({ values: '' });
    },
  });
  return (
    <>
      {loading ? <AppLoader /> : null}
      <TextInput
        mt={30}
        padding={0}
        onchange={formik.handleChange('firstname')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter First name'}
        value={formik.values.firstname}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.firstname && formik.errors.firstname && (
        <AText color="red" xtrasmall>
          {formik.errors.firstname}
        </AText>
      )}

      <TextInput
        mt={10}
        padding={0}
        onchange={formik.handleChange('lastname')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Last name'}
        value={formik.values.lastname}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.lastname && formik.errors.lastname && (
        <AText color="red" xtrasmall>
          {formik.errors.lastname}{' '}
        </AText>
      )}

      <TextInput
        mt={10}
        padding={0}
        onchange={formik.handleChange('email')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Email'}
        value={formik.values.email}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.email && formik.errors.email && (
        <AText color="red" xtrasmall>
          {formik.errors.email}
        </AText>
      )}

      <TextInput
        mt={10}
        padding={0}
        onchange={formik.handleChange('mobile')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Phone No.'}
        value={formik.values.mobile}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.mobile && formik.errors.mobile && (
        <AText color="red" xtrasmall>
          {formik.errors.mobile}
        </AText>
      )}

      <TextInput
        mt={10}
        padding={0}
        onchange={formik.handleChange('password')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Password'}
        value={formik.values.password}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.password && formik.errors.password && (
        <AText color="red" xtrasmall>
          {formik.errors.password}
        </AText>
      )}

      <TextInput
        mt={10}
        padding={0}
        onchange={formik.handleChange('confirm_password')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Confirm Password'}
        value={formik.values.confirm_password}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.confirm_password && formik.errors.confirm_password && (
        <AText color="red" xtrasmall>
          {formik.errors.confirm_password}
        </AText>
      )}
      <RadioButton
        ml={10}
        mt={5}
        data={[{ key: true, text: 'I agree to terms and Policy' }]}
        fieldname="policy"
        onchange={formik.setFieldValue}
      />
      {formik.touched.policy && formik.errors.policy && (
        <AText color="red" xtrasmall>
          {formik.errors.policy}
        </AText>
      )}
      <AButton
        mt={'60px'}
        round
        onPress={formik.handleSubmit}
        title="Sign up"
        block
      />
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
