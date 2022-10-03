import React, { useState } from 'react';
import {
  AText,
  AContainer,
  AButton,
} from '../../theme-components';
import styled from 'styled-components/native';
import URL from '../../utils/baseurl';
import { DataTable, Text } from 'react-native-paper';
import { Alert } from 'react-native';
import { checkoutDetailsAction } from "../../store/action";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { isEmpty } from '../../utils/helper';

const CheckoutScreen = ({ navigation, route }) => {
  var shippingValue = route.params.shippingValue;
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  var paymentMethod = route.params.paymentMethod;
  const dispatch = useDispatch();
  const { cartId } = useSelector(state => state.cart);
  const userDetails = useSelector(state => state.customer.userDetails);
  const { checkoutSuccess } = useSelector(state => state.checkoutDetail)
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [productArr, setProductArr] = useState([])
  const { couponDiscount } = useSelector(state => state.cart);
  const isFocused = useIsFocused();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Order Summary',
      headerTransparent: false,
      headerTintColor: '#000',
      headerRight: () => (
        <AText bold pr="10px">
          ${cartAmount}
        </AText>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setproducts()
  }, [isFocused])

  const setproducts = () => {
    var products = []
    cartProducts.map((val) => {
      products.push({
        'product_id': val._id,
        'qty': val.cartQty,
        'name': val.name,
        'cost': val.pricing.sellprice,
        'feature_image': val.feature_image.medium
      })
    })
    setProductArr(products)
  }
  const checkoutDetails = () => {
    const payload = {
      customer_id: userDetails._id,
      billing: {
        order_notes: "",
        zip: shippingValue.pincode,
        state: shippingValue.state,
        city: shippingValue.city,
        address_line2: shippingValue.address_line2,
        address: shippingValue.address_line1,
        phone: userDetails.phone || "1234",
        company: "",
        email: userDetails.email,
        lastname: userDetails.last_name,
        firstname: userDetails.first_name,
        country: shippingValue.country,
        payment_method: "Cash On Delivery",
        transaction_id: ""
      },
      shipping: {
        order_notes: "",
        zip: shippingValue.pincode,
        state: shippingValue.state,
        city: shippingValue.city,
        address_line2: shippingValue.address_line2,
        address: shippingValue.address_line1,
        phone: shippingValue.phone || "1234",
        company: "",
        email: shippingValue.email,
        lastname: shippingValue.last_name,
        firstname: shippingValue.first_name,
        country: shippingValue.country,
        payment_method: "Cash On Delivery",
        transaction_id: ""
      },
      products: productArr,
      subtotal: cartAmount.toString(),
      shipping_amount: !isEmpty(deliveryCharges) ? deliveryCharges.toString() : '',
      tax_amount: !isEmpty(taxAmount) ? taxAmount.toString() : '',
      discount_amount: !isEmpty(couponDiscount) ? couponDiscount.toString() : '',
      grand_total: !isEmpty(cartAmount) ? cartAmount.toString() : '',
      checkoutDate: new Date().toString(),
      shippingAddress: true,
    }
    dispatch(checkoutDetailsAction(payload, cartId, navigation));
  }


  return (
    <>
      <AContainer>
        <AText large heavy>Shipping Details</AText>
        <Shippingwrapper>
          <AText medium bold color="#000">{shippingValue.first_name + ' ' + shippingValue.last_name}</AText>
          <AText mt="10px">{`${shippingValue.address_line1},${shippingValue.address_line2}, ${shippingValue.city}`}</AText>
          <AText>{`${shippingValue.state}, ${shippingValue.pincode}`}</AText>
          <AText>{`${shippingValue.country}`}</AText>
          <AText mt="10px">{shippingValue.phone}</AText>
          <AText>{shippingValue.email}</AText>
        </Shippingwrapper>

        <AText large heavy>Price Details</AText>
        <Shippingwrapper>
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>Payment</DataTable.Cell>
              <DataTable.Cell numeric>
                <AText capitalize>{paymentMethod}</AText>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Items ({cartProducts.length})</DataTable.Cell>
              <DataTable.Cell numeric>${cartAmount}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Delivery Charges</DataTable.Cell>
              <DataTable.Cell numeric>Free</DataTable.Cell>
            </DataTable.Row>

            {couponDiscount > 0 &&
              <DataTable.Row>
                <DataTable.Cell>Discounts</DataTable.Cell>
                <DataTable.Cell numeric>{couponDiscount}</DataTable.Cell>
              </DataTable.Row>
            }

            <DataTable.Row>
              <DataTable.Cell>Taxes</DataTable.Cell>
              <DataTable.Cell numeric>{taxAmount === 0 ? "Free" : taxAmount}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Amount Payable</DataTable.Cell>
              <DataTable.Cell numeric>${cartAmount + deliveryCharges}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Shippingwrapper>

        <AText large heavy>
          Products
        </AText>
        {cartProducts.map(product => (
          <ItemWrapper key={product.id}>
            <ItemImage
              source={{
                uri: !isEmpty(product.feature_image) ? URL + product.feature_image.medium : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
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

              <PriceQtyWrapper>
                <PriceWrapper>
                  <AText
                    right
                    lineThrough={product.pricing.sellprice ? true : false}
                    small={product.pricing.sellprice ? true : false}
                    heavy={product.pricing.sellprice ? false : true}
                    color={product.pricing.sellprice ? '#7b7b7b' : '#000000'}>
                    ${(product.pricing.price * product.cartQty).toFixed(2)}
                  </AText>
                  {product.pricing.sellprice ? (
                    <AText heavy color="#DB3022" right>
                      ${(product.pricing.sellprice * product.cartQty).toFixed(2)}
                    </AText>
                  ) : null}
                </PriceWrapper>
              </PriceQtyWrapper>
            </ItemDescription>
          </ItemWrapper>
        ))}
        <BottomSpacer />
      </AContainer>
      <AButton
        title="Place Order"
        block
        onPress={() => {
          checkoutDetails()
        }}
      />
    </>
  );
};

const Shippingwrapper = styled.View`
  padding: 10px;
  background: #f7f7f7;
  margin-top: 10px;
  margin-bottom: 20px;
`;
const PriceWrapper = styled.View``;
const BottomSpacer = styled.View`
  margin-bottom: 25px;
`;
const ItemWrapper = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  height: 105px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f7f7f7;
  overflow: hidden;
  position: relative;
  border: 1px solid #f7f7f7;
  box-shadow: 0 0 5px #eee;
  elevation: 1;
`;
const ItemImage = styled.ImageBackground`
  width: 90px;
  height: 105px;
  resize-mode: cover;
`;
const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
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

export default CheckoutScreen;
