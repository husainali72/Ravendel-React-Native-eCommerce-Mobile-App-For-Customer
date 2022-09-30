import React, { Fragment, useEffect, useState } from 'react';
import { AText, AButton, AppLoader, AHeader } from '../../theme-components';
import { Formik } from 'formik';
import { validationSchema } from '../checkout/validationSchema';
import styled from 'styled-components/native';
import { RadioButton, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addAddressAction, removeAddressAction, updateAddressAction, userDetailsfetch } from '../../store/action';

const SavedAddressScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused()
  const loading = useSelector(state => state.login.loading);
  const { userDetails } = useSelector(state => state.customer)
  const [addressBook, setAddressBook] = useState()
  const [addressForm, setAddressForm] = useState(false)
  const [addressDefault, setaddressDefault] = useState(0);
  const [initialFormValues, setInitialFormValues] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    _id: ''
  });


  useEffect(() => {
    if (!isEmpty(userDetails.address_book)) {
      let address = (userDetails.address_book)
      setAddressBook(address)
      setAddressForm(false)
      var found = address.find((item) => {
        return item.default_address == true;
      });
      if (!isEmpty(found)) {
        setaddressDefault(found._id)
      } else {
        setaddressDefault(address[0]._id)

      }
    } else {
      setAddressForm(true)

    }
  }, [isFocused, userDetails])

  useEffect(() => {
    if (!isEmpty(userDetails)) {
      dispatch(userDetailsfetch(userDetails._id))
    }
  }, [isFocused])

  const onSubmit = values => {
    if (isEmpty(initialFormValues._id)) {
      const payload = {
        id: userDetails._id,
        first_name: values.firstname,
        last_name: values.lastname,
        phone: values.phone,
        address_line1: values.address,
        address_line2: values.landmark,
        city: values.city,
        country: values.country,
        state: values.state,
        pincode: values.pincode,
        default_address: true
      }
      setAddressForm(false)
      dispatch(addAddressAction(payload))
    } else {
      const payload = {
        id: userDetails._id,
        _id: initialFormValues._id,
        first_name: values.firstname,
        last_name: values.lastname,
        phone: values.phone,
        address_line1: values.address,
        address_line2: values.landmark,
        city: values.city,
        country: values.country,
        state: values.state,
        pincode: values.pincode,
        default_address: true
      }
      setInitialFormValues({
        firstname: '',
        lastname: '',
        phone: '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
      })
      setAddressForm(false)
      dispatch(updateAddressActio(payload))

    }
  };
  const editFormValues = (values) => {
    setInitialFormValues({
      firstname: values.first_name,
      lastname: values.last_name,
      phone: values.phone,
      address: values.address_line1,
      landmark: values.address_line2,
      city: values.city,
      state: values.state,
      country: values.country,
      pincode: values.pincode,
      _id: values._id,
     
    })
    setAddressForm(true)
  }
  const updatedefaultaddress = (values) => {
    const payload={
      id: userDetails._id,
      _id: values._id,
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
      address_line1: values.address_line1,
      address_line2: values.address_line2,
      city: values.city,
      country: values.country,
      state: values.state,
      pincode: values.pincode,
      default_address: true
    }
    console.log(payload,'payload')
    dispatch(updateAddressAction(payload))
  }
  const deleteAddress = (id) => {
    const data = {
      id: userDetails._id,
      _id: id
    }
    console.log(data)
    dispatch(removeAddressAction(data))
  }
  return (
    <>
      {loading ? <AppLoader /> : null}
      <AHeader navigation={navigation} title="Saved Address" back />
      <CheckouWrapper>
        {(isEmpty(userDetails) && isEmpty(userDetails.address_book) || addressForm) ?
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

                <TextInput
                  style={styles.textinputstyle}
                  label="State"
                  value={values.state}
                  onChangeText={handleChange('state')}
                  onBlur={() => setFieldTouched('state')}
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
          :
          <>
            <AButton
              block
              onPress={() => { setAddressForm(true) }}
              title="+ Add new address" />
            <AddressWrapper>
              {userDetails.address_book.map((item, index) => (
                <AddressContentWrapper>
                  <RadioButtonWrapper
                    onPress={() => { updatedefaultaddress(item) }}>
                    <AText heavy large>{item.first_name}</AText>
                    <Icon name={'star'} color={item._id === addressDefault ? '#FFB400' : '#BDBDBD'} size={20} />
                  </RadioButtonWrapper>
                  <AText medium >{item.address_line1}, {item.address_line2}, {item.city}</AText>
                  <AText medium >{item.state}, {item.pincode}</AText>
                  <AText bold medium>{item.phone}, </AText>
                  <ButtonWrapper>
                    <EditRemoveButton
                      onPress={() => { editFormValues(item) }}>
                      <AText color='#fff' bold  >Edit</AText>
                    </EditRemoveButton>
                    <EditRemoveButton
                      onPress={() => { deleteAddress(item._id) }}>
                      <AText color='#fff' bold>Remove</AText>
                    </EditRemoveButton>
                  </ButtonWrapper>
                </AddressContentWrapper>
              ))
              }
            </AddressWrapper>

          </>
        }
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
const AddressWrapper = styled.View`
margin-top: 20px;
`;
const AddressContentWrapper = styled.View`
flex: 1;
margin-top: 10px;
margin-bottom: 10px;
border-radius: 10px;
background: #f7f7f7;
overflow: hidden;
position: relative;
border: 1px solid #f8f8f8;
box-shadow: 0 0 5px #eee;
elevation: 1;
padding:10px 12px;

`;
const EditRemoveButton = styled.TouchableOpacity`
  padding: 5px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-top: 10px;
`;
const ButtonWrapper = styled.TouchableOpacity`
align-items: center;
align-self: flex-start;
marginStart:10px;
flex-direction: row;
`;
const RadioButtonWrapper = styled.TouchableOpacity`
justify-content: space-between;
align-items: center;
align-self: flex-end;
flex-direction: row;
width:98%;
margin:5px;
`;
export default SavedAddressScreen;

