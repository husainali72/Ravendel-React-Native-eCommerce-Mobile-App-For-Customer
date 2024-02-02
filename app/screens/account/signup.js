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
import { useFormik } from 'formik';
import { signupValidationSchema } from '../checkout/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { registerAction } from '../../store/action';
import { Checkbox } from 'react-native-paper';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

const SignupScreen = ({ navigation }) => {
  // const loading = useSelector((state) => state.login.loading);

  const dispatch = useDispatch();
  const openLink = () => {
    const url = 'https://demo1-ravendel.hbwebsol.com/abouts/terms&condition';

    // Use Linking to open the URL
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err),
    );
  };

  const sendValues = (values) => {
    const registerValue = {
      firstName: values.firstname,
      lastName: values.lastname,
      email: values.email,
      password: values.password,
      phone: values.mobile,
      company: values.company,
      // role: 'user',
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
      company: '',
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
      <TextInput
        color={'#000'}
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
        color={'#000'}
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
        color={'#000'}
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
        color={'#000'}
        mt={10}
        padding={0}
        keyboardtype={'numeric'}
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
        color={'#000'}
        mt={10}
        padding={0}
        onchange={formik.handleChange('company')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Company'}
        value={formik.values.company}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.company && formik.errors.company && (
        <AText color="red" xtrasmall>
          {formik.errors.company}
        </AText>
      )}
      <TextInput
        color={'#000'}
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
        color={'#000'}
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {Platform.OS === 'ios' ? (
          <View
            style={{
              borderColor: 'black',
              borderWidth: 1,
              width: 22,
              height: 22,
              backgroundColor: 'transparent',
              position: 'absolute',
              left: 7,
            }}
          />
        ) : null}
        {console.log(formik.values.policy, 'policy')}
        <Checkbox
          status={formik.values.policy ? 'checked' : 'unchecked'}
          onPress={() => formik.setFieldValue('policy', !formik.values.policy)}
        />
        <TouchableOpacity activeOpacity={0.5} onPress={() => openLink()}>
          <AText lineThrough small color="#9F9F9F">
            I agree to terms and policy
          </AText>
        </TouchableOpacity>
      </View>
      {/* <RadioButton
        ml={10}
        mt={5}
        data={[{ key: true, text: 'I agree to terms and Policy' }]}
        fieldname="policy"
        onchange={formik.setFieldValue}
      /> */}
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

export default SignupScreen;
