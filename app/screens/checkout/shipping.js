import React, { Fragment } from 'react';
import { AText, AButton } from '../../theme-components';
import { Formik } from 'formik';
import validationSchema from './validationSchema';
import initialFormValues from './initialFormValue';
import styled from 'styled-components/native';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const CheckoutScreen = ({ navigation, route }) => {
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Shipping',
      headerTransparent: false,
      headerTintColor: '#000',
      headerRight: () => (
        <AText bold pr="10px">
          ${cartAmount}
        </AText>
      ),
    });
  }, [navigation]);

  const onSubmit = values => {
    navigation.navigate('PaymentMethod', { shippingValue: values, cartAmount: cartAmount, cartProducts: cartProducts });
  };

  return (
    <>
      <CheckouWrapper>
        <Formik
          initialValues={initialFormValues}
          onSubmit={values => onSubmit(values)}
          validationSchema={validationSchema}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            isValid,
            handleSubmit,
          }) => (
              <Fragment>
                <TextInput
                  style={styles.textinputstyle}
                  label="First Name"
                  value={values.firstname}
                  onChangeText={handleChange('firstname')}
                  onBlur={() => setFieldTouched('firstname')}
                />
                {touched.firstname && errors.firstname && (
                  <AText color="red" xtrasmall>
                    {errors.firstname}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="Last Name"
                  value={values.lastname}
                  onChangeText={handleChange('lastname')}
                  onBlur={() => setFieldTouched('lastname')}
                />
                {touched.lastname && errors.lastname && (
                  <AText color="red" xtrasmall>
                    {errors.lastname}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="E-mail"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                />
                {touched.email && errors.email && (
                  <AText color="red" xtrasmall>
                    {errors.email}
                  </AText>
                )}
                <TextInput
                  style={styles.textinputstyle}
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  secureTextEntry={true}
                />
                {touched.password && errors.password && (
                  <AText color="red" xtrasmall>
                    {errors.password}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="Confirm Password"
                  value={values.confirm_password}
                  onChangeText={handleChange('confirm_password')}
                  onBlur={() => setFieldTouched('confirm_password')}
                  secureTextEntry={true}
                />
                {touched.confirm_password && errors.confirm_password && (
                  <AText color="red" xtrasmall>
                    {errors.confirm_password}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="Phone"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={() => setFieldTouched('phone')}
                  keyboardType={'number-pad'}
                  returnKeyType="done"
                />
                {touched.phone && errors.phone && (
                  <AText color="red" xtrasmall>
                    {errors.phone}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="Pincode"
                  value={values.pincode}
                  onChangeText={handleChange('pincode')}
                  onBlur={() => setFieldTouched('pincode')}
                  keyboardType={'number-pad'}
                  returnKeyType="done"
                />
                {touched.pincode && errors.pincode && (
                  <AText color="red" xtrasmall>
                    {errors.pincode}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="Address"
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={() => setFieldTouched('address')}
                  keyboardType={'number-pad'}
                  returnKeyType="done"
                />
                {touched.address && errors.address && (
                  <AText color="red" xtrasmall>
                    {errors.address}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="Landmark"
                  value={values.landmark}
                  onChangeText={handleChange('landmark')}
                  onBlur={() => setFieldTouched('landmark')}
                  keyboardType={'number-pad'}
                  returnKeyType="done"
                />
                {touched.landmark && errors.landmark && (
                  <AText color="red" xtrasmall>
                    {errors.landmark}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="City"
                  value={values.city}
                  onChangeText={handleChange('city')}
                  onBlur={() => setFieldTouched('city')}
                  keyboardType={'number-pad'}
                  returnKeyType="done"
                />
                {touched.city && errors.city && (
                  <AText color="red" xtrasmall>
                    {errors.city}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="State"
                  value={values.state}
                  onChangeText={handleChange('state')}
                  onBlur={() => setFieldTouched('state')}
                  keyboardType={'number-pad'}
                  returnKeyType="done"
                />
                {touched.state && errors.state && (
                  <AText color="red" xtrasmall>
                    {errors.state}
                  </AText>
                )}

                <TextInput
                  style={styles.textinputstyle}
                  label="Country"
                  value={values.country}
                  onChangeText={handleChange('country')}
                  onBlur={() => setFieldTouched('country')}
                  keyboardType={'number-pad'}
                  returnKeyType="done"
                />
                {touched.country && errors.country && (
                  <AText color="red" xtrasmall>
                    {errors.country}
                  </AText>
                )}

                <AButton
                  title="Next"
                  disabled={!isValid}
                  onPress={handleSubmit}
                  block
                />
                <BottomSpacer />
              </Fragment>
            )}
        </Formik>
      </CheckouWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  textinputstyle: {
    marginTop: 5,
    marginBottom: 5,
  },
});

const CheckouWrapper = styled.ScrollView`
  padding: 10px;
  background: #fff;
`;
const BottomSpacer = styled.View`
  height: 25px;
`;
export default CheckoutScreen;
