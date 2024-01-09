import React from 'react';
import {
  AText,
  AButton,
  AppLoader,
  ARow,
  TextInput,
} from '../../theme-components';
// import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../checkout/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { LoginAction } from '../../store/action';
import { TouchableOpacity, View } from 'react-native';
import { APP_SECONDARY_COLOR } from '../../utils/config';
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.login.loading);
  const sendValues = (values) => {
    dispatch(LoginAction(values.email, values.password, navigation));
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      sendValues(values);
      resetForm({ values: '' });
    },
  });
  return (
    <>
      {loading ? <AppLoader /> : null}
      <ARow mb="10px" mt="30px">
        <TextInput
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
        {formik.errors.email && formik.touched.email ? (
          <AText xtrasmall ml={'10px'} color={'red'} pb={5}>
            {formik.errors.email}
          </AText>
        ) : null}
      </ARow>
      <ARow>
        <TextInput
          iconColor={'#9F9F9F'}
          bw={0}
          placeholder={'Enter Password'}
          padding={0}
          pb={10}
          onerror={false}
          secureTextEntry={true}
          icon={'eye-off'}
          value={formik.values.password}
          onchange={formik.handleChange('password')}
          hookuse
          placeholdercolor={'#ABA7A7'}
          inputBgColor="transparent"
        />
        {formik.errors.password && formik.touched.password ? (
          <AText xtrasmall ml={'10px'} color={'red'} pb={5}>
            {formik.errors.password}
          </AText>
        ) : null}
      </ARow>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ marginTop: 5 }}
          onPress={() => navigation.navigate('ResetPassword')}>
          <AText pl="12px" bold xtrasmall color={'#ABA7A7'}>
            Forgot password?
          </AText>
        </TouchableOpacity>
      </View>
      <AButton
        mt={'74px'}
        title={'Log in'}
        round
        heavy
        onPress={formik.handleSubmit}
      />
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
