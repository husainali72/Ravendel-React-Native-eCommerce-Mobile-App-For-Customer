import React, { Fragment, useState } from 'react';
import { AText, AButton, AHeader } from '../../theme-components';
import { Formik } from 'formik';
import styled from 'styled-components/native';
import { Appbar, TextInput } from 'react-native-paper';
import { Modal, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { countryArray } from '../../utils/CountryData';
import { validationSchema } from '../checkout/validationSchema';
const AdressForm = ({
  initialFormValues,
  addForm,
  cancelAddForm,
  onStopScroll,
}) => {
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [countrySelectIndex, setCountrySelectIndex] = useState(1);

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
        <Appbar style={{ backgroundColor: '#fff' }}>
          <Appbar.BackAction onPress={cancelAddForm} />
          <Appbar.Content
            title={'Add new address'}
            style={{ alignItems: 'flex-start' }}
          />
        </Appbar>
        <CheckouWrapper
          nestedScrollEnabled={true}
          scrollEnabled={!openStateModal}>
          <Formik
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
                  label="Phone no."
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
                  returnKeyType="done"
                />
                {touched.landmark && errors.landmark && (
                  <AText color="red" xtrasmall>
                    {errors.landmark}
                  </AText>
                )}

                <DropDownPicker
                  open={openCountryModal}
                  value={values.country}
                  label="Country"
                  items={countryArray}
                  placeholder={'Country'}
                  setOpen={setOpenCountryModal}
                  onSelectItem={(item) => {
                    setCountrySelectIndex(item.id),
                      setFieldValue('country', item.value);
                  }}
                  style={styles.dropDownStyle}
                />
                {touched.country && errors.country && (
                  <AText color="red" xtrasmall>
                    {errors.country}
                  </AText>
                )}
                <DropDownPicker
                  open={openStateModal}
                  value={values.state}
                  placeholder={'State'}
                  autoScroll={true}
                  items={countryArray[countrySelectIndex - 1].state}
                  setOpen={setOpenStateModal}
                  setClo
                  onSelectItem={(item) => {
                    setFieldValue('state', item.value);
                  }}
                  style={styles.dropDownStyle}
                />
                {touched.state && errors.state && (
                  <AText color="red" xtrasmall>
                    {errors.state}
                  </AText>
                )}
                <TextInput
                  style={styles.textinputstyle}
                  label="City"
                  value={values.city}
                  onChangeText={handleChange('city')}
                  onBlur={() => setFieldTouched('city')}
                  returnKeyType="done"
                />
                {touched.city && errors.city && (
                  <AText color="red" xtrasmall>
                    {errors.city}
                  </AText>
                )}

                <BottomSpacer>
                  <AButton title="Cancel" onPress={cancelAddForm} />
                  <AButton
                    title="Next"
                    disabled={!isValid}
                    onPress={handleSubmit}
                  />
                </BottomSpacer>
              </Fragment>
            )}
          </Formik>
        </CheckouWrapper>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  textinputstyle: {
    marginTop: 5,
    marginBottom: 5,
  },
  dropDownStyle: {
    backgroundColor: '#E7E7E7',
    marginVertical: 7,
    borderWidth: 0,
    zIndex: 1,
  },
});
const CheckouWrapper = styled.ScrollView`
  padding: 10px;
  background: #fff;
`;

const BottomSpacer = styled.View`
  flex-direction: row;
  margin-bottom: 25px;
`;

export default AdressForm;
