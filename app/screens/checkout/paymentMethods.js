import React from 'react';
import { AText, AButton } from '../../theme-components';
import styled from 'styled-components/native';
import { RadioButton, Text } from 'react-native-paper';
import PaypalImage from '../../assets/images/paypal.png';
import CreditCardImage from '../../assets/images/credit-card.png';
import CashondelieveryImage from '../../assets/images/cash-on-delievery.png';

const PaymentMethodScreen = ({ navigation, route }) => {
  const shippingValue = route.params.shippingValue;
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  const [paymentMethod, setPaymentMethod] = React.useState('cash');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Payment Method',
      headerTransparent: false,
      headerTintColor: '#000',
      headerRight: () => (
        <AText bold pr="10px">
          ${cartAmount}
        </AText>
      ),
    });
  }, [navigation]);

  const changeValue = val => {
    setPaymentMethod(val);
  };
  return (
    <>
      <MainWrapper>
        {paymentMethod === 'paypal' ? (
          <PaymentMethodImage source={PaypalImage} />
        ) : null}
        {paymentMethod === 'credit' ? (
          <PaymentMethodImage source={CreditCardImage} />
        ) : null}
        {paymentMethod === 'cash' ? (
          <PaymentMethodImage source={CashondelieveryImage} />
        ) : null}

        <RadioButton.Group
          onValueChange={val => changeValue(val)}
          value={paymentMethod}>
          <RadioButton.Item label="Credit" value="credit" />
          <RadioButton.Item label="Cash on Delievery" value="cash" />
          <RadioButton.Item label="Paypal" value="paypal" />
        </RadioButton.Group>
      </MainWrapper>
      <AButton
        disabled={paymentMethod === '' ? true : false}
        title="Next"
        block
        onPress={() => navigation.navigate('Checkout', {
          paymentMethod: paymentMethod,
          cartAmount: cartAmount,
          shippingValue: shippingValue,
          cartProducts: cartProducts,
        })}
      />
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

export default PaymentMethodScreen;
