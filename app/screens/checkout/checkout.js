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
import { checkoutDetailsAction } from "../../store/action/checkoutAction";
import { useDispatch } from 'react-redux';

const CheckoutScreen = ({ navigation, route }) => {
  var shippingValue = route.params.shippingValue;
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  var paymentMethod = route.params.paymentMethod;
  const checkoutDispatch = useDispatch();
  const [deliveryCharges, setDeliveryCharges] = useState(0);

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

  return (
    <>
      <AContainer>
        <AText large heavy>Shipping Details</AText>
        <Shippingwrapper>
          <AText medium bold color="#000">{shippingValue.firstname + ' ' + shippingValue.lastname}</AText>
          <AText mt="10px">{`${shippingValue.address}, ${shippingValue.city}`}</AText>
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
                <Text style={{ textTransform: 'capitalize' }}>
                  {paymentMethod}
                </Text>
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

            <DataTable.Row>
              <DataTable.Cell>Delivery Charges</DataTable.Cell>
              <DataTable.Cell numeric>{deliveryCharges === 0 ? "Free" : deliveryCharges}</DataTable.Cell>
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
            {product.feature_image ? (
              <ItemImage
                source={{
                  uri: URL + product.feature_image.medium,
                }}
              />
            ) : (
                <ItemImage
                  source={{
                    uri:
                      'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                  }}
                />
              )}

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
                <AText small light ml="10px">
                  Color:{' '}
                  <AText small heavy>
                    Black
                  </AText>
                </AText>

                <AText small light ml="10px">
                  Size:{' '}
                  <AText small heavy>
                    L
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
          Alert.alert(
            'Success',
            'Congratulations! Your order has been placed successfully.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.navigate('Cart');
                  checkoutDispatch(checkoutDetailsAction([]));
                },
                style: 'cancel',
              },
            ],
            { cancelable: false },
          );
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
