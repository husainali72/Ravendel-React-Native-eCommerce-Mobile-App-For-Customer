import React, { Fragment, useEffect, useState } from 'react';
import { AText, AButton, AppLoader, ZHeader } from '../../theme-components';
import { Formik } from 'formik';
import { validationSchema } from './validationSchema';
import styled from 'styled-components/native';
import { RadioButton, TextInput } from 'react-native-paper';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import {
  addAddressAction,
  updateAddressAction,
  userDetailsfetch,
} from '../../store/action';
import DropDownPicker from 'react-native-dropdown-picker';
import { countryArray } from '../../utils/CountryData';
import { AdressForm } from '../components';
import AIcon from 'react-native-vector-icons/AntDesign';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  GREYTEXT,
} from '../../utils/config';
import Colors from '../../constants/Colors';
const CheckoutScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [scrollenable, setScrollEnable] = useState(true);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [countrySelectIndex, setCountrySelectIndex] = useState(0);
  const { userDetails, loading } = useSelector((state) => state.customer);
  const [addressBook, setAddressBook] = useState();
  const [addressForm, setAddressForm] = useState(false);
  const { couponDiscount } = useSelector((state) => state.cart);
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
    _id: '',
  });
  var cartAmount = route?.params?.cartAmount;
  var cartProducts = route?.params?.cartProducts;
  var couponCode = route?.params?.couponCode;
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Shipping',
      headerTransparent: false,
      headerTintColor: '#000',
      headerRight: () => (
        <AText bold pr="10px">
          {formatCurrency(
            cartAmount - couponDiscount,
            currencyOptions,
            currencySymbol,
          )}
        </AText>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!isEmpty(userDetails.address_book)) {
      let address = userDetails.address_book;
      setAddressBook(address);
      setAddressForm(false);
      var found = address.find((item) => {
        return item.default_address == true;
      });
      if (!isEmpty(found)) {
        setaddressDefault(found._id);
      } else {
        setaddressDefault(address[0]._id);
      }
    } else {
      setAddressForm(true);
    }
  }, [isFocused, userDetails]);

  useEffect(() => {
    if (!isEmpty(userDetails)) {
      dispatch(userDetailsfetch(userDetails._id));
    }
  }, [isFocused]);
  const defaddress = !isEmpty(userDetails)
    ? userDetails.address_book.filter(({ _id }) => _id === addressDefault)
    : [];
  const onSubmit = (values) => {
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
        default_address: true,
      };

      setAddressForm(false);
      dispatch(addAddressAction(payload));
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
        default_address: true,
      };
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
      });
      setAddressForm(false);
      dispatch(updateAddressAction(payload));
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
      _id: values._id,
    });
    setAddressForm(true);
  };
  return (
    <>
      {loading ? <AppLoader /> : null}
      {(isEmpty(userDetails) && isEmpty(userDetails.address_book)) ||
      addressForm ? (
        <>
          <AdressForm
            navigation={navigation}
            addForm={onSubmit}
            onStopScroll={() => {
              setScrollEnable(!scrollenable);
            }}
            cancelAddForm={() => {
              setAddressForm(false);
            }}
            initialFormValues={initialFormValues}
          />
        </>
      ) : (
        <>
          <View style={styles.container}>
            <ZHeader navigation={navigation} name="Checkout" />
            <View style={styles.container2}>
              <View style={styles.step}>
                <View style={styles.circle} />
                <View
                  style={{
                    top: 5,
                    left: 5,
                    position: 'absolute',
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    backgroundColor: APP_PRIMARY_COLOR,
                  }}
                />
                <View style={styles.line} />
                <View
                  style={{
                    ...styles.label,
                    alignItems: 'flex-start',
                  }}>
                  <AText fonts={FontStyle.semiBold} color="black">
                    Address
                  </AText>
                </View>
              </View>
              <View style={styles.step}>
                <View style={styles.line} />
                <View style={styles.circle} />
                <View style={styles.line} />
                <View style={styles.label}>
                  <AText fonts={FontStyle.semiBold} color="black">
                    Shipping
                  </AText>
                </View>
              </View>
              <View style={styles.step}>
                <View style={styles.line} />

                <View style={styles.circle} />
                <View style={{ ...styles.label, alignItems: 'flex-end' }}>
                  <AText fonts={FontStyle.semiBold} color="black">
                    Order Detail
                  </AText>
                </View>
              </View>
            </View>
            <ScrollView
              style={{ marginHorizontal: 30, flex: 1 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              scrollEnabled={scrollenable}>
              <AddressWrapper>
                {userDetails.address_book.map((item, index) => (
                  <View style={styles.addresscard}>
                    <RadioButtonWrapper>
                      <AText
                        mr="8px"
                        color="black"
                        fonts={FontStyle.semiBold}
                        large>
                        {item.first_name}
                      </AText>
                      {item._id === addressDefault ? (
                        <AIcon
                          name="checkcircleo"
                          size={18}
                          color={APP_PRIMARY_COLOR}
                        />
                      ) : null}
                    </RadioButtonWrapper>
                    <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                      {item.phone}
                    </AText>
                    <AText color={GREYTEXT}>
                      {item.address_line1}, {item.address_line2}, {item.city}
                    </AText>
                    <AText mb="10px" color={GREYTEXT}>
                      {item.state}, {item.pincode}
                    </AText>

                    <AIcon
                      onPress={() => {
                        editFormValues(item);
                      }}
                      style={{ alignSelf: 'flex-end' }}
                      name="edit"
                      size={15}
                      color={'grey'}
                    />
                  </View>
                ))}
              </AddressWrapper>
              <AText large fonts={FontStyle.semiBold} color="black">
                Select Delivery Address
              </AText>
              <View style={styles.addaddresscard}>
                <AIcon
                  onPress={() => {
                    setAddressForm(true);
                  }}
                  style={{
                    height: 26,
                    width: 26,
                    borderRadius: 30,
                    backgroundColor: '#DCF0EF',
                  }}
                  name="pluscircleo"
                  size={25}
                  color={'black'}
                />
                <AText ml="20px" color="black" fonts={FontStyle.semiBold}>
                  Add a new address
                </AText>
              </View>
              <AButton
                ml="50px"
                mr="50px"
                onPress={() => {
                  navigation.navigate('ShippingMethod', {
                    screen: 'ShippingMethod',
                    shippingValue: defaddress,
                    cartAmount: cartAmount,
                    cartProducts: cartProducts,
                    couponCode: couponCode,
                  });
                }}
                round
                title="Next"
              />
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
    // paddingHorizontal: 30,
  },
  container2: {
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  step: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '33%',
  },

  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: APP_PRIMARY_COLOR,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: GREYTEXT,
    marginHorizontal: 5,
  },
  label: {
    fontFamily: 'SegoeUI-SemiBold',
    width: '100%',
    alignItems: 'center',
  },
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
  addresscard: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    marginVertical: 10,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#f7f7f7',
    // boxShadow: 0 0 5px #eee,
    borderRadius: 8,
    elevation: 3,
  },
  addaddresscard: {
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingVertical: 9,
    marginVertical: 10,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#f7f7f7',
    // boxShadow: 0 0 5px #eee,
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const AddressWrapper = styled.View`
  margin-bottom: 10px;
`;

const RadioButtonWrapper = styled.TouchableOpacity`
  // justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
  align-self: flex-end;
  flex-direction: row;
  width: 98%;
`;

export default CheckoutScreen;
