import React, { useState } from 'react';
import {
  AText,
  AContainer,
  AButton,
  ZHeader,
  TextInput,
} from '../../theme-components';
import styled from 'styled-components/native';
import URL from '../../utils/baseurl';
import { DataTable, Divider, RadioButton } from 'react-native-paper';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { checkoutDetailsAction } from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { ProductPriceText } from '../components';
import LinearGradient from 'react-native-linear-gradient';

import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  GREYTEXT,
} from '../../utils/config';

const CheckoutScreen = ({ navigation, route }) => {
  var shippingValue = route.params.shippingValue;
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  var couponCode = route.params.couponCode;
  var paymentMethod = route.params.paymentMethod;
  var defaultaddress = route.params.shippingValue[0];
  // console.log(cartProducts, 'cart');
  const dispatch = useDispatch();
  const { cartId } = useSelector((state) => state.cart);
  const userDetails = useSelector((state) => state.customer.userDetails);
  const { checkoutSuccess } = useSelector((state) => state.checkoutDetail);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [productArr, setProductArr] = useState([]);
  const [checked, setChecked] = React.useState('Cod');
  const { couponDiscount } = useSelector((state) => state.cart);
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  const isFocused = useIsFocused();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Order Summary',
      headerTransparent: false,
      headerTintColor: '#000',
      headerRight: () => (
        <AText bold pr="10px">
          {formatCurrency(cartAmount, currencyOptions, currencySymbol)}
        </AText>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setproducts();
    console.log(totalcost);
  }, [isFocused]);
  let totalcost = 0;
  cartProducts.map((val) => {
    totalcost = totalcost + val.pricing.sellprice;
  });
  const setproducts = () => {
    var products = [];
    cartProducts.map((val) => {
      products.push({
        product_id: val._id,
        qty: val.cartQty,
        name: val.name,
        cost: val.pricing.sellprice,
        feature_image: val.feature_image,
        tax_class: val.tax_class,
        shipping_class: val.shipping.shipping_class,
      });
      // console.log(val.pricing.sellprice);
      totalcost = totalcost + val.pricing.sellprice;
      // console.log(totalcost);
    });
    setProductArr(products);
  };
  console.log(shippingValue);
  const checkoutDetails = () => {
    const payload = {
      customer_id: userDetails._id,
      billing: {
        order_notes: '',
        zip: shippingValue[0].pincode,
        state: shippingValue[0].state,
        city: shippingValue[0].city,
        address_line2: shippingValue[0].address_line2,
        address: shippingValue[0].address_line1,
        phone: userDetails.phone || '1234',
        company: '',
        email: userDetails.email,
        lastname: userDetails.last_name,
        firstname: userDetails.first_name,
        country: shippingValue[0].country,
        payment_method: 'Cash On Delivery',
        transaction_id: '',
      },
      shipping: {
        order_notes: '',
        zip: shippingValue[0].pincode,
        state: shippingValue[0].state,
        city: shippingValue[0].city,
        address_line2: shippingValue[0].address_line2,
        address: shippingValue[0].address_line1,
        phone: shippingValue[0].phone || '1234',
        company: '',
        email: shippingValue[0].email,
        lastname: shippingValue[0].last_name,
        firstname: shippingValue[0].first_name,
        country: shippingValue[0].country,
        payment_method: 'Cash On Delivery',
        transaction_id: '',
      },
      products: productArr,
      subtotal: cartAmount.toString(),
      shipping_amount: !isEmpty(deliveryCharges)
        ? deliveryCharges.toString()
        : '',
      tax_amount: !isEmpty(taxAmount) ? taxAmount.toString() : '',
      discount_amount: !isEmpty(couponDiscount)
        ? couponDiscount.toString()
        : '',
      coupon_code: !isEmpty(couponCode) ? couponCode : '',
      grand_total: !isEmpty(cartAmount) ? cartAmount.toString() : '',
      checkoutDate: new Date().toString(),
      shippingAddress: true,
    };
    console.log('oioi');
    dispatch(checkoutDetailsAction(payload, cartId, navigation));
  };
  return (
    <>
      <LinearGradient
        colors={[APP_SECONDARY_COLOR, 'white']}
        style={styles.container}>
        <ScrollView>
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
              <View style={styles.line} />
              <View style={styles.label}>
                <AText fonts={FontStyle.semiBold} color="black">
                  Shipping
                </AText>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.line} />
              <View style={styles.activedot} />
              <View style={styles.circle} />
              <View style={{ ...styles.label, alignItems: 'flex-end' }}>
                <AText fonts={FontStyle.semiBold} color="black">
                  Order Detail
                </AText>
              </View>
            </View>
          </View>
          <AddressWrapper>
            {/* {userDetails.address_book.map((item, index) => ( */}
            <AText color="black" fonts={FontStyle.semiBold} large>
              Billing Details
            </AText>
            <View style={styles.addresscard}>
              <RadioButtonWrapper>
                <AText mr="8px" color="black" fonts={FontStyle.semiBold} large>
                  {defaultaddress.first_name}
                </AText>
              </RadioButtonWrapper>
              <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                {defaultaddress.phone}
              </AText>
              <AText color={GREYTEXT}>
                {defaultaddress.address_line1}, {defaultaddress.address_line2},{' '}
                {defaultaddress.city}
              </AText>
              <AText mb="10px" color={GREYTEXT}>
                {defaultaddress.state}, {defaultaddress.pincode}
              </AText>
            </View>
            {/* ))} */}
            <AText color="black" fonts={FontStyle.semiBold} large>
              Shipping Method
            </AText>
            <View style={styles.addresscard}>
              <RadioButtonWrapper>
                <AText mr="8px" color="black" fonts={FontStyle.semiBold} large>
                  Free Shipping
                </AText>
              </RadioButtonWrapper>
              <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                $0.00 (3-10 Business Days)
              </AText>
            </View>
          </AddressWrapper>
          <AText ml="30px" color="black" fonts={FontStyle.semiBold} large>
            Order Summary
          </AText>
          {cartProducts.map((product) => (
            <ItemWrapper key={product.id}>
              <ItemImage
                source={{
                  uri: !isEmpty(product.feature_image)
                    ? URL + product.feature_image
                    : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                }}
              />
              <ItemDescription>
                <AText medium heavy>
                  {product.name.length > 20
                    ? product.name.substring(0, 20) + '...'
                    : product.name}
                </AText>
                <AttributedWrapper>
                  <AText small light>
                    Qty:{' '}
                    <AText small heavy>
                      {product.cartQty}
                    </AText>
                  </AText>
                </AttributedWrapper>
              </ItemDescription>
              <ItemDescription2>
                <PriceQtyWrapper>
                  <AText>{'₹' + product.pricing.price}</AText>
                  {/* <ProductPriceText
                    fontsizesmall={true}
                    Pricing={product.pricing}
                    DontshowPercentage={true}
                    showInMulipleLine={'column-reverse'}
                    fontColor={'#DB3022'}
                  /> */}
                </PriceQtyWrapper>
              </ItemDescription2>
            </ItemWrapper>
          ))}
          <AText ml="30px" color="black" fonts={FontStyle.semiBold} large>
            Payment Mode
          </AText>
          <View style={styles.addresscard2}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                color={APP_PRIMARY_COLOR}
                value="Cod"
                status={checked === 'Cod' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Cod')}
              />
              <AText style={{ color: 'black' }}>Cash on Delivery</AText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                color={APP_PRIMARY_COLOR}
                value="Stripe"
                status={checked === 'Stripe' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Stripe')}
              />
              <AText style={{ color: 'black' }}>Stripe</AText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                color={APP_PRIMARY_COLOR}
                value="Paypal"
                status={checked === 'Paypal' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Paypal')}
              />
              <AText style={{ color: 'black' }}>Paypal</AText>
            </View>
          </View>
          <AText ml="30px" color="black" fonts={FontStyle.semiBold} large>
            Coupon Code
          </AText>
          <View style={styles.addresscard2}>
            <TextInput bw={0} pb={15} placeholder={'Enter Coupon Code'} />
            <View style={{ width: '60%', alignSelf: 'center', marginTop: 10 }}>
              <AButton
                small
                title="Apply Coupon"
                round
                onPress={() => {
                  alert('YOYO');
                }}
              />
            </View>
          </View>
          <AText ml="30px" color="black" fonts={FontStyle.semiBold} large>
            Cart Total
          </AText>
          <Shippingwrapper>
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>Cart Total</DataTable.Cell>
                <DataTable.Cell numeric>
                  <AText capitalize>{'₹' + totalcost}</AText>
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Taxes</DataTable.Cell>
                <DataTable.Cell numeric>
                  {taxAmount === 0 ? 'Free' : taxAmount}
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Shipping</DataTable.Cell>
                <DataTable.Cell numeric>Free Shipping</DataTable.Cell>
              </DataTable.Row>

              {couponDiscount > 0 && (
                <DataTable.Row>
                  <DataTable.Cell>
                    Coupon code
                    <AText bold>
                      {!isEmpty(couponCode) && ' (' + couponCode + ')'}
                    </AText>{' '}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <AText color={'green'}>
                      -{' '}
                      {formatCurrency(
                        couponDiscount,
                        currencyOptions,
                        currencySymbol,
                      )}
                    </AText>
                  </DataTable.Cell>
                </DataTable.Row>
              )}
              <Divider style={{ backgroundColor: 'black' }} />
              <DataTable.Row>
                <DataTable.Cell>Total</DataTable.Cell>
                <DataTable.Cell numeric>
                  {'₹'}
                  {totalcost + deliveryCharges - couponDiscount}
                  {formatCurrency(
                    totalcost + deliveryCharges - couponDiscount,
                    currencyOptions,
                    currencySymbol,
                  )}
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Shippingwrapper>
          <BottomSpacer />
          <View style={{ width: '60%', alignSelf: 'center' }}>
            <AButton
              title="Place Order"
              round
              onPress={() => {
                checkoutDetails();
              }}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const Shippingwrapper = styled.View`
  padding: 10px;
  background: white;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-horizontal: 30px;
`;
const PriceWrapper = styled.View``;

const AddressWrapper = styled.View`
  margin-bottom: 10px;
  margin-horizontal: 30px;
`;

const RadioButtonWrapper = styled.TouchableOpacity`
  // justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
  align-self: flex-end;
  flex-direction: row;
  width: 98%;
`;
const BottomSpacer = styled.View`
  margin-bottom: 25px;
`;
const ItemWrapper = styled.TouchableOpacity`
  flex: 1;
  margin-horizontal: 30px;
  padding-horizontal: 5px;
  padding-vertical: 5px;
  flex-direction: row;
  justify-content: space-between;
  height: 75px;
  // margin-top: 10px;
  // margin-bottom: 10px;
  border-radius: 10px;
  background: white;
  overflow: hidden;
  position: relative;
  border: 1px solid #f7f7f7;
  box-shadow: 0 0 5px #eee;
  elevation: 1;
`;
const ItemImage = styled.ImageBackground`
  width: 60px;
  height: 60px;
  resize-mode: cover;
`;
const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
`;
const ItemDescription2 = styled.View`
  flex: 1;
  padding: 10px;
  align-items: flex-end;
  justify-content: center;
`;
const AttributedWrapper = styled.View`
  margin-bottom: 5px;
  margin-top: 5px;
  flex-direction: row;
`;
const PriceQtyWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    paddingBottom: 20,
    // paddingHorizontal: 30,
  },
  activedot: {
    top: 5,
    right: 5,
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
  addresscard2: {
    marginHorizontal: 30,
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
export default CheckoutScreen;
