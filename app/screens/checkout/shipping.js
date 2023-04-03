import React, { Fragment, useEffect, useState } from 'react';
import { AText, AButton, AppLoader } from '../../theme-components';
import { Formik } from 'formik';
import { validationSchema } from './validationSchema';
import styled from 'styled-components/native';
import { RadioButton, TextInput } from 'react-native-paper';
import { Modal, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import { addAddressAction, updateAddressAction, userDetailsfetch } from '../../store/action';
import DropDownPicker from 'react-native-dropdown-picker';
import { countryArray } from '../../utils/CountryData';
import { AdressForm } from '../components';
const CheckoutScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused()
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [scrollenable, setScrollEnable] = useState(true);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [countrySelectIndex, setCountrySelectIndex] = useState(0)
  const { userDetails, loading } = useSelector(state => state.customer)
  const [addressBook, setAddressBook] = useState()
  const [addressForm, setAddressForm] = useState(false)
  const { couponDiscount } = useSelector(state => state.cart);
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
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  var couponCode = route.params.couponCode;
  const { currencyOptions, currencySymbol } = useSelector(state => state.settings);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Shipping',
      headerTransparent: false,
      headerTintColor: '#000',
      headerRight: () => (
        <AText bold pr="10px">
          {formatCurrency(cartAmount - couponDiscount, currencyOptions, currencySymbol)}
        </AText>
      ),
    });
  }, [navigation]);

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
      dispatch(updateAddressAction(payload))

    }
    // navigation.navigate('PaymentMethod', { shippingValue: values, cartAmount: cartAmount, cartProducts: cartProducts });
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
      _id: values._id
    })
    setAddressForm(true)
  }
  return (
    <>
      {loading ? <AppLoader /> : null}
      {(isEmpty(userDetails) && isEmpty(userDetails.address_book) || addressForm) ?
        <>

          <AdressForm
            addForm={onSubmit}
            onStopScroll={() => {  setScrollEnable(!scrollenable) }}
            cancelAddForm={() => { setAddressForm(false) }}
            initialFormValues={initialFormValues}
          />
        </>
        :
        <CheckouWrapper nestedScrollEnabled={true} scrollEnabled={scrollenable} >
          <AddressWrapper>
            <AButton
              block
              onPress={() => { setAddressForm(true) }}
              title="+ Add new address" />
            {userDetails.address_book.map((item, index) => (
              <SingleAddressWrapper>
                <RadioButtonWrapper>
                  <AText heavy large>{item.first_name}</AText>
                  <RadioButton value={item._id} onPress={() => setaddressDefault(item._id)} status={item._id === addressDefault ? 'checked' : 'unchecked'} />
                </RadioButtonWrapper>
                <AText medium >{item.address_line1}, {item.address_line2}, {item.city}</AText>
                <AText medium >{item.state}, {item.pincode}</AText>
                <AText bold medium>{item.phone}, </AText>
                <EditAddress
                  onPress={() => { editFormValues(item) }}>
                  <AText>Edit</AText>
                </EditAddress>
                {item._id == addressDefault &&
                  <AButton
                    onPress={() => {
                      navigation.navigate('PaymentMethod',
                        {
                          shippingValue: item,
                          cartAmount: cartAmount,
                          cartProducts: cartProducts,
                          couponCode: couponCode
                        });
                    }}
                    title="Deliver to this address" />
                }
              </SingleAddressWrapper>
            ))
            }
          </AddressWrapper>
        </CheckouWrapper>
      }
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
    zIndex: 1
  }
});

const CheckouWrapper = styled.ScrollView`
  padding: 25px 10px 150px;
  flex:1;
  background: #fff;
`;
const BottomSpacer = styled.View`
  height: 25px;
`;
const AddressWrapper = styled.View`
  margin-bottom:25px;
  background: #fff;
`;
const SingleAddressWrapper = styled.View`
  padding:5px;
  margin:10px;
  background: #fff;
  border: 1px solid #f7f7f7;
  box-shadow: 0 0 5px #eee;
  elevation: 1;
`;
const EditAddress = styled.TouchableOpacity`
  padding: 5px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-top: 10px;
  width:50px;
`;
const RadioButtonWrapper = styled.TouchableOpacity`
  justify-content: space-between;
  align-items: center;
  align-self: flex-end;
  flex-direction: row;
  width:98%
`;

export default CheckoutScreen;
