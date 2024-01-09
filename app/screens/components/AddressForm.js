import React, { Fragment, useState } from 'react';
import { AText, AButton, AHeader, ZHeader } from '../../theme-components';
import { Formik, useFormik } from 'formik';
import styled from 'styled-components/native';
import { Appbar, TextInput } from 'react-native-paper';
import { Modal, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { countryArray } from '../../utils/CountryData';
import { validationSchema } from '../checkout/validationSchema';
import LinearGradient from 'react-native-linear-gradient';
import { APP_SECONDARY_COLOR, FontStyle } from '../../utils/config';
const AdressForm = ({
  initialFormValues,
  addForm,
  cancelAddForm,
  onStopScroll,
  navigation,
}) => {
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [countrySelectIndex, setCountrySelectIndex] = useState(1);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      onSubmit(values);
      setSubmitting(false);
      resetForm({});
    },
  });

  const onSubmit = (values) => {
    const FormValue = {
      firstname: values.firstname,
      lastname: values.lastname,
      phone: values.phone,
      address: values.address,
      landmark: values.landmark,
      city: values.city,
      country: values.country,
      state: values.state,
      pincode: values.pincode,
    };
    addForm(FormValue);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        animationInTiming={1500}>
        <LinearGradient
          colors={[APP_SECONDARY_COLOR, 'white']}
          style={{ flex: 1 }}>
          <ZHeader navigation={navigation} name={'Add New Address'} />
          <CheckouWrapper
            nestedScrollEnabled={true}
            scrollEnabled={!openStateModal}>
            {/* <Formik
            initialValues={initialFormValues}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              onSubmit(values);
              setSubmitting(false);
              resetForm({});
            }}
            validationSchema={validationSchema}>
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              setFieldValue,
              touched,
              isValid,
              handleSubmit,
            }) => ( */}
            <Fragment>
              <TextInput
                style={styles.textinputstyle}
                label="First Name"
                value={formik.values.firstname}
                onChangeText={formik.handleChange('firstname')}
                onBlur={() => formik.setFieldTouched('firstname')}
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <AText color="red" xtrasmall>
                  {formik.errors.firstname}
                </AText>
              )}

              <TextInput
                style={styles.textinputstyle}
                label="Last Name"
                value={formik.values.lastname}
                onChangeText={formik.handleChange('lastname')}
                onBlur={() => formik.setFieldTouched('lastname')}
              />
              {formik.touched.lastname && formik.errors.lastname && (
                <AText color="red" xtrasmall>
                  {formik.errors.lastname}
                </AText>
              )}

              <TextInput
                style={styles.textinputstyle}
                label="Phone no."
                value={formik.values.phone}
                onChangeText={formik.handleChange('phone')}
                onBlur={() => formik.setFieldTouched('phone')}
                keyboardType={'number-pad'}
                returnKeyType="done"
              />
              {formik.touched.phone && formik.errors.phone && (
                <AText color="red" xtrasmall>
                  {formik.errors.phone}
                </AText>
              )}

              <TextInput
                style={styles.textinputstyle}
                label="Pincode"
                value={formik.values.pincode}
                onChangeText={formik.handleChange('pincode')}
                onBlur={() => formik.setFieldTouched('pincode')}
                keyboardType={'number-pad'}
                returnKeyType="done"
              />
              {formik.touched.pincode && formik.errors.pincode && (
                <AText color="red" xtrasmall>
                  {formik.errors.pincode}
                </AText>
              )}

              <TextInput
                style={styles.textinputstyle}
                label="Address"
                value={formik.values.address}
                onChangeText={formik.handleChange('address')}
                onBlur={() => formik.setFieldTouched('address')}
                returnKeyType="done"
              />
              {formik.touched.address && formik.errors.address && (
                <AText color="red" xtrasmall>
                  {formik.errors.address}
                </AText>
              )}

              <TextInput
                style={styles.textinputstyle}
                label="Landmark"
                value={formik.values.landmark}
                onChangeText={formik.handleChange('landmark')}
                onBlur={() => formik.setFieldTouched('landmark')}
                returnKeyType="done"
              />
              {formik.touched.landmark && formik.errors.landmark && (
                <AText color="red" xtrasmall>
                  {formik.errors.landmark}
                </AText>
              )}

              <DropDownPicker
                open={openCountryModal}
                value={formik.values.country}
                label="Country"
                items={countryArray}
                placeholder={'Country'}
                setOpen={setOpenCountryModal}
                onSelectItem={(item) => {
                  setCountrySelectIndex(item.id),
                    formik.setFieldValue('country', item.value);
                }}
                style={styles.dropDownStyle}
              />
              {formik.touched.country && formik.errors.country && (
                <AText color="red" xtrasmall>
                  {formik.errors.country}
                </AText>
              )}
              <DropDownPicker
                searchable={true}
                open={openStateModal}
                value={formik.values.state}
                placeholder={'State'}
                autoScroll={true}
                items={countryArray[countrySelectIndex - 1].state}
                setOpen={setOpenStateModal}
                onSelectItem={(item) => {
                  formik.setFieldValue('state', item.value);
                }}
                style={styles.dropDownStyle}
              />
              {formik.touched.state && formik.errors.state && (
                <AText color="red" xtrasmall>
                  {formik.errors.state}
                </AText>
              )}
              <TextInput
                style={styles.textinputstyle}
                label="City"
                value={formik.values.city}
                onChangeText={formik.handleChange('city')}
                onBlur={() => formik.setFieldTouched('city')}
                returnKeyType="done"
              />
              {formik.touched.city && formik.errors.city && (
                <AText color="red" xtrasmall>
                  {formik.errors.city}
                </AText>
              )}

              <BottomSpacer>
                <AButton
                  width="40%"
                  borderColor="transparent"
                  round
                  title="Cancel"
                  bgColor={'red'}
                  onPress={cancelAddForm}
                />
                <AButton
                  width="40%"
                  borderColor="transparent"
                  round
                  title="Next"
                  disabled={!formik.isValid}
                  onPress={formik.handleSubmit}
                />
              </BottomSpacer>
            </Fragment>
          </CheckouWrapper>
        </LinearGradient>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  textinputstyle: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'transparent',
    // borderBottomWidth:0.5
    borderColor: APP_SECONDARY_COLOR,
  },
  dropDownStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 0.5,
    marginVertical: 7,
    borderWidth: 0,
    zIndex: 1,
  },
});
const CheckouWrapper = styled.ScrollView`
  padding-horizontal: 30px;
  padding-top: 30px;
  // background: #fff;
`;

const BottomSpacer = styled.View`
  padding-bottom: 20px;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 25px;
  align-items: center;
`;

export default AdressForm;
