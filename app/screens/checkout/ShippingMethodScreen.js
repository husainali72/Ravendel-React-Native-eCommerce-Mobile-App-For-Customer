import React from 'react';
import { AText, AButton, ZHeader } from '../../theme-components';
import styled from 'styled-components/native';
import { RadioButton } from 'react-native-paper';
import PaypalImage from '../../assets/images/paypal.png';
import CreditCardImage from '../../assets/images/credit-card.png';
import CashondelieveryImage from '../../assets/images/cash-on-delievery.png';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';

import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  GREYTEXT,
} from '../../utils/config';
import { useIsFocused } from '@react-navigation/native';
import { addAddressAction } from '../../store/action';
import { AdressForm } from '../components';
import Colors from '../../constants/Colors';

const ShippingMethodScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { loading } = useSelector((state) => state.customer);
  const [addressForm, setAddressForm] = React.useState(false);
  const [scrollenable, setScrollEnable] = React.useState(true);
  const [initialFormValues, setInitialFormValues] = React.useState({
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
  const shippingValue = route.params.shippingValue;
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  var couponCode = route.params.couponCode;
  var defaultaddress = route.params.shippingValue[0];
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
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

  const changeValue = (val) => {
    setPaymentMethod(val);
  };
  return (
    <>
      {addressForm ? (
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
        <View style={styles.container}>
          <ZHeader navigation={navigation} name="Checkout" />
          <View style={styles.container2}>
            <View style={styles.step}>
              <View style={styles.circle} />

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
              <View style={styles.activedot} />
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
          <View style={{ marginHorizontal: 30, flex: 1 }}>
            <AddressWrapper>
              {/* {userDetails.address_book.map((item, index) => ( */}
              <AText color="black" fonts={FontStyle.semiBold} large>
                Billing Details
              </AText>
              <View style={styles.addresscard}>
                <RadioButtonWrapper>
                  <AText
                    mr="8px"
                    color="black"
                    fonts={FontStyle.semiBold}
                    large>
                    {defaultaddress.first_name}
                  </AText>
                </RadioButtonWrapper>
                <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                  {defaultaddress.phone}
                </AText>
                <AText color={GREYTEXT}>
                  {defaultaddress.address_line1}, {defaultaddress.address_line2}
                  , {defaultaddress.city}
                </AText>
                <AText mb="10px" color={GREYTEXT}>
                  {defaultaddress.state}, {defaultaddress.pincode}
                </AText>
                <AIcon
                  onPress={() => {
                    editFormValues(defaultaddress);
                  }}
                  style={{ alignSelf: 'flex-end' }}
                  name="edit"
                  size={15}
                  color={'grey'}
                />
              </View>
              {/* ))} */}
              <AText color="black" fonts={FontStyle.semiBold} large>
                Shipping Method
              </AText>
              <View style={styles.addresscard}>
                <RadioButtonWrapper>
                  <AText
                    mr="8px"
                    color="black"
                    fonts={FontStyle.semiBold}
                    large>
                    Free Shipping
                  </AText>
                </RadioButtonWrapper>
                <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                  $0.00 (3-10 Business Days)
                </AText>
              </View>
            </AddressWrapper>

            <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
              <AButton
                disabled={paymentMethod === '' ? true : false}
                title="Next"
                round
                onPress={() =>
                  navigation.navigate('Checkout', {
                    paymentMethod: paymentMethod,
                    cartAmount: cartAmount,
                    shippingValue: shippingValue,
                    cartProducts: cartProducts,
                    couponCode: couponCode,
                  })
                }
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const MainWrapper = styled.View`
  flex: 1;
  padding: 20px;
`;
const PaymentMethodImage = styled.Image`
  height: 175px;
  width: 100%;
  margin-bottom: 25px;
`;

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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
    // paddingHorizontal: 30,
  },
  activedot: {
    top: 5,
    left: '45%',
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: APP_PRIMARY_COLOR,
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
});
export default ShippingMethodScreen;
