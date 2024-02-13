import React, { useEffect, useState } from 'react';
import {
  AText,
  AContainer,
  AHeader,
  AppLoader,
  AButton,
  ARow,
  ZHeader,
} from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  productsAction,
  orderHistoryAction,
  AppSettingAction,
} from '../../store/action';
import { formatCurrency, isEmpty } from '../../utils/helper';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import URL from '../../utils/baseurl';
import { useIsFocused } from '@react-navigation/native';
import { Modal, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { APP_PRIMARY_COLOR, APP_SECONDARY_COLOR } from '../../utils/config';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import NavigationConstants from '../../navigation/NavigationConstants';

const OrderScreen = ({ navigation }) => {
  const { userDetails, isLoggin } = useSelector((state) => state.customer);
  const { orderList, loading } = useSelector((state) => state.orders);
  const { Loading, products } = useSelector((state) => state.products);
  const loadingproduct = useSelector((state) => state.products.loading);
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [cartProducts, setCartProduct] = useState([]);

  useEffect(() => {
    if (!isEmpty(userDetails)) {
      const payload = {
        user_id: userDetails._id,
      };
      dispatch(orderHistoryAction(payload));
    }
  }, [isFocused]);

  useEffect(() => {
    ListProducts();
  }, [products, orderList]);

  const ListProducts = () => {
    setCartProduct([...orderList]);
  };
  return (
    <>
      {loadingproduct || loading ? <AppLoader /> : null}
      <View style={styles.container}>
        <Header navigation={navigation} title="Orders" />
        <ScrollView>
          <>
            {cartProducts && cartProducts.length ? (
              <>
                {cartProducts.map((prod, index) => (
                  <OrderWrapper key={index}>
                    <AttributedWrapper>
                      <ProfileDetailWrapper>
                        <AText bold>Order ID:</AText>
                        <AText ml={'33px'} color={'#6E6E6E'}>
                          {' '}
                          {prod.order_number}{' '}
                        </AText>
                      </ProfileDetailWrapper>
                      <ProfileDetailWrapper>
                        <AText bold>Order Date:</AText>
                        <AText ml={'14px'} color={'#6E6E6E'}>
                          {' '}
                          {moment(prod.date).format('LL')}
                        </AText>
                      </ProfileDetailWrapper>
                      <ProfileDetailWrapper>
                        <AText bold>Total Price:</AText>
                        <AText ml={'19px'} color={'#6E6E6E'}>
                          {currencySymbol + prod.grand_total}
                          {formatCurrency(
                            prod.grand_total,
                            currencyOptions,
                            currencySymbol,
                          )}{' '}
                        </AText>
                      </ProfileDetailWrapper>
                    </AttributedWrapper>
                    <ItemWrapper>
                      <AttributedWrapper>
                        <ProfileDetailWrapper>
                          <OrderStatusColumnWrapper>
                            <AText bold>Payment Status: </AText>
                            <OrderStatusWrapper
                              mr={'10px 7px 0px 0px'}
                              color={
                                prod.payment_status == 'confirmed'
                                  ? '#AADFA0'
                                  : prod.payment_status == 'pending'
                                  ? '#FFE4E7'
                                  : '#FFE4E7'
                              }>
                              <AText
                                center
                                color={
                                  prod.payment_status == 'confirmed'
                                    ? '#377F19'
                                    : prod.payment_status == 'pending'
                                    ? '#F90006'
                                    : '#F90006'
                                }
                                uppercase
                                bold>
                                {prod.payment_status}
                              </AText>
                            </OrderStatusWrapper>
                          </OrderStatusColumnWrapper>

                          <OrderStatusColumnWrapper>
                            <AText bold>Shipping Status: </AText>
                            <OrderStatusWrapper
                              mr={'10px 0px 0px 5px'}
                              color={
                                prod.shipping_status == 'inprogress'
                                  ? '#E3FCFF'
                                  : prod.shipping_status == 'shipped'
                                  ? '#B3E8E5'
                                  : prod.shipping_status == 'delivered'
                                  ? '#AADFA0'
                                  : '#F2EBE9'
                              }>
                              <AText
                                center
                                color={
                                  prod.shipping_status == 'inprogress'
                                    ? '#037081'
                                    : prod.shipping_status == 'shipped'
                                    ? '#308F9D'
                                    : prod.shipping_status == 'delivered'
                                    ? '#377F19'
                                    : '#7D3F67'
                                }
                                uppercase
                                bold>
                                {prod.shipping_status == 'outfordelivery'
                                  ? 'Out for delivery'
                                  : prod.shipping_status}
                              </AText>
                            </OrderStatusWrapper>
                          </OrderStatusColumnWrapper>
                        </ProfileDetailWrapper>
                      </AttributedWrapper>
                      <AttributedWrapper></AttributedWrapper>
                    </ItemWrapper>
                    <AButton
                      round
                      bgColor={APP_PRIMARY_COLOR}
                      onPress={() =>
                        navigation.navigate(
                          NavigationConstants.ORDER_DETAIL_SCREEN,
                          {
                            orderDetails: prod,
                            productIndex: 0,
                          },
                        )
                      }
                      title="View order"
                    />
                  </OrderWrapper>
                ))}
              </>
            ) : (
              <EmptyWrapper>
                <AText heavy large center mb="10px">
                  Your have no orders for now
                </AText>
                <AButton
                  title="Shop Now"
                  onPress={() =>
                    navigation.navigate(NavigationConstants.SHOP_SCREEN)
                  }
                />
              </EmptyWrapper>
            )}
          </>
        </ScrollView>
      </View>
    </>
  );
};

const OrderWrapper = styled.View`
  // flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 15px 10px;
  background:white;
  margin-vertical:5px;
  margin-horizontal:30px;
  border-radius: 10px;
  position: relative;
  border: 1px solid #f7f7f7;
  shadow-color: #000,
  shadow-opacity: 0.25px;
  shadow-radius: 3.84px;
  elevation: 5px;
`;
//
const OrderStatusWrapper = styled.View`
  background: ${(props) => props.color ?? '#f7f7f7'};
  position: relative;
  border-radius: 8px;
  padding: 7px 7px;
  width: 95%;
  align-self: center;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin: ${(props) => props.mr ?? '10px 7px'};
`;
const OrderStatusColumnWrapper = styled.View`
  // background: #f7f7f7;
  width: 50%;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
`;
const EmptyWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 300px;
`;
const ItemWrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
`;
const ProfileDetailWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  align-self: center;
  align-items: center;
  padding: 5px;
`;
const AttributedWrapper = styled.View`
  margin-bottom: 5px;
  margin-top: 5px;
  flex-direction: column;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
    // paddingHorizontal: 30,
  },
});
export default OrderScreen;
