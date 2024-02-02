import React, { useEffect, useState } from 'react';
import {
  AText,
  AContainer,
  AHeader,
  AppLoader,
  AButton,
  ARow,
} from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  productsAction,
  removeFromCartAction,
  updateCartAction,
  applyCouponAction,
  checkStorageAction,
} from '../../store/action';
import { formatCurrency, getToken, isEmpty } from '../../utils/helper';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import URL from '../../utils/baseurl';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import {
  REMOVE_ALL_CART_PRODUCT,
  UPDATE_CART_PRODUCT,
} from '../../store/action/checkoutAction';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  COUPON_REMOVED,
  REMOVE_ITEM_IN_CART,
} from '../../store/action/cartAction';
import { ProductPriceText } from '../components';
import { APP_SECONDARY_COLOR, FontStyle } from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import Header from '../components/Header';

const CartScreen = ({ navigation }) => {
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: 'Cart',
  //     headerTransparent: false,
  //     headerTintColor: '#000',
  //     headerRight: () => {
  //       !isEmpty(cartItems) && cartItems.length > 0 &&
  //         <AText bold pr="10px">
  //           <AButton
  //             title={
  //               (<MaterialIcons name="cart-remove" size={22} />)
  //             }
  //             onPress={() => clearCart()}
  //           />
  //         </AText>
  //     }

  //   });
  // }, [navigation]);
  const { userDetails, isLoggin } = useSelector((state) => state.customer);
  const cartItems = useSelector((state) => state.cart.products);
  const { cartId, couponDiscount, loading } = useSelector(
    (state) => state.cart,
  );
  const { Loading, products } = useSelector((state) => state.products);
  const loadingproduct = useSelector((state) => state.products.loading);
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [cartProducts, setCartProduct] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const [delievery, setDelievery] = useState(0);
  const [coupontotal, setCouponTotal] = useState(0);
  const [couponModal, setCouponModal] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  useEffect(() => {
    dispatch(productsAction());
    fetchCart();
  }, [isFocused]);

  const fetchCart = () => {
    if (isEmpty(userDetails)) {
      dispatch(checkStorageAction());
    } else {
      dispatch(checkStorageAction(userDetails._id));
    }
    ListProducts();
  };

  useEffect(() => {
    ListProducts();
  }, [products, cartItems]);

  useEffect(() => {
    cartSubTotal();
  }, [cartProducts, couponDiscount]);

  const ListProducts = () => {
    if (!isEmpty(products)) {
      setCartProduct([]);
      var filteredProducts = [];
      if (!isEmpty(cartItems) && cartItems.length > 0) {
        cartItems.map((item) => {
          products.filter((product) => {
            if (product._id === item.product_id) {
              filteredProducts.push({ ...product, cartQty: item.qty });
            }
          });
        });
      }
      setCartProduct([...filteredProducts]);
    } else {
      dispatch(productsAction());
    }
  };

  const cartSubTotal = () => {
    var subtotalVar = 0;
    if (cartProducts && cartProducts.length) {
      cartProducts.map((item) => {
        if (item.pricing.sellprice) {
          var sellPrice = item.pricing.sellprice * item.cartQty;
          subtotalVar = subtotalVar + sellPrice;
        } else {
          var totalPrice = item.pricing.price * item.cartQty;
          subtotalVar = subtotalVar + totalPrice;
        }
      });
    }
    if (!isEmpty(couponDiscount) && couponDiscount > 0) {
      setCouponApplied(true);
      let subto = subtotalVar - couponDiscount;
      if (subto < 0) {
        setCouponTotal(0);
      } else {
        setCouponTotal(subtotalVar - couponDiscount);
      }
    }
    setSubTotal(subtotalVar);
  };

  const removeCartItem = async (removedItem) => {
    removedItem.cart = false;
    let filteredProduct = cartProducts.filter(
      (item) => item._id !== removedItem._id,
    );
    let filterCartItem = cartItems.filter(
      (item) => item.product_id !== removedItem._id,
    );
    try {
      if (cartProducts.length > 1) {
        if (isLoggin) {
          const cartData = {
            id: cartId,
            product_id: removedItem._id,
          };
          dispatch(removeFromCartAction(cartData, userDetails._id));
        } else {
          await AsyncStorage.setItem(
            'cartproducts',
            JSON.stringify(filterCartItem),
          );
        }
      } else {
        clearCart();
      }
      setCartProduct(filteredProduct);
      dispatch({
        type: REMOVE_ITEM_IN_CART,
        payload: filterCartItem,
      });
      ListProducts();
    } catch (error) {
      console.log('Something went Wrong!!!!');
    }
  };
  const increaseItemQty = async (item) => {
    var cartitem = [];
    cartItems.map((cart) => {
      if (cart.product_id === item._id) {
        cartitem.push({
          product_id: cart.product_id,
          product_title: cart.product_title,
          qty: cart.qty + 1,
        });
      } else {
        cartitem.push(cart);
      }
    });
    if (isLoggin) {
      var cartpro = [];
      cartitem.map((cart) => {
        cartpro.push({
          product_id: cart.product_id,
          product_image: cart.product_image,
          product_title: cart.product_title,
          qty: cart.qty,
        });
      });
      var cartData = {
        id: cartId,
        products: cartpro,
      };
      dispatch(updateCartAction(cartData, userDetails._id));
    } else {
      try {
        await AsyncStorage.setItem('cartproducts', JSON.stringify(cartitem));
      } catch (error) {
        console.log('Something went Wrong!!!!');
      }
    }
    dispatch({
      type: UPDATE_CART_PRODUCT,
      payload: cartitem,
    });
  };

  const decreaseItemQty = async (item) => {
    if (item.cartQty <= 1) {
      return;
    }
    var cartitem = [];
    cartItems.map((cart) => {
      if (cart.product_id === item._id) {
        cartitem.push({
          product_id: cart.product_id,
          product_title: cart.product_title,
          qty: cart.qty - 1,
        });
      } else {
        cartitem.push(cart);
      }
    });
    if (isLoggin) {
      var cartpro = [];
      cartitem.map((cart) => {
        cartpro.push({
          product_id: cart.product_id,
          product_image: cart.product_image,
          product_title: cart.product_title,
          qty: cart.qty,
        });
      });
      var cartData = {
        id: cartId,
        products: cartpro,
      };
      dispatch(updateCartAction(cartData, userDetails._id));
    } else {
      try {
        await AsyncStorage.setItem('cartproducts', JSON.stringify(cartitem));
      } catch (error) {
        console.log('Something went Wrong!!!!');
      }
    }
    dispatch({
      type: UPDATE_CART_PRODUCT,
      payload: cartitem,
    });
  };
  const clearCart = async () => {
    dispatch({
      type: REMOVE_ALL_CART_PRODUCT,
    });
    if (isLoggin) {
      const cartData = {
        id: cartId,
        products: [],
      };
      dispatch(updateCartAction(cartData, userDetails._id));
    }

    ListProducts();
  };
  const ApplyCoupon = () => {
    let cartpro = [];
    cartItems.map((cart) => {
      cartpro.push({
        product_id: cart.product_id,
        total: cart.total,
        qty: cart.qty,
      });
    });
    const payload = {
      coupon_code: couponCode,
      cart: cartpro,
    };
    setCouponModal(false);
    dispatch(applyCouponAction(payload));
  };

  const removeCoupon = () => {
    dispatch({
      type: COUPON_REMOVED,
    });
    setCouponApplied(false);
    setCouponCode('');
    setCouponTotal(0);
  };
  return (
    <>
      {loadingproduct || loading ? <AppLoader /> : null}
      <Header navigation={navigation} title={'My Cart'} />
      <View style={styles.container}>
        <>
          {cartProducts && cartProducts.length ? (
            <>
              {cartProducts.map((product) => (
                <TouchableOpacity
                  style={styles.productitem}
                  key={product.id}
                  onPress={() =>
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'CateGories',
                            state: {
                              routes: [
                                {
                                  name: 'SingleProduct',
                                  params: {
                                    productID: product._id,
                                    productUrl: product.url,
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      }),
                    )
                  }>
                  <ItemImage
                    source={{
                      uri: !isEmpty(product.feature_image)
                        ? URL + product.feature_image
                        : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                    }}
                  />
                  <ItemDescription>
                    <View>
                      <AText fonts={FontStyle.semiBold} large heavy>
                        {product.name.length > 20
                          ? product.name.substring(0, 20) + '...'
                          : product.name}
                      </AText>
                      <AText fonts={FontStyle.semiBold} medium color="#1FAD08">
                        ${product.pricing.sellprice + '.00'}
                      </AText>
                    </View>
                    <PriceQtyWrapper>
                      <QtyWrapper>
                        <QtyButton
                          onPress={() => {
                            product.cartQty === 1
                              ? removeCartItem(product)
                              : decreaseItemQty(product);
                          }}>
                          <AText color="#fff">
                            <AIcon
                              color={'#72787e'}
                              name="minussquare"
                              size={16}
                            />
                          </AText>
                        </QtyButton>
                        <AText center medium bold ml="10px" mr="10px">
                          {product.cartQty}
                        </AText>
                        <QtyButton onPress={() => increaseItemQty(product)}>
                          <AText color="#fff">
                            <AIcon
                              color={'#72787e'}
                              name="plussquare"
                              size={16}
                            />
                          </AText>
                        </QtyButton>
                      </QtyWrapper>
                      <ProductPriceText
                        fontsizesmall={true}
                        Pricing={product.pricing}
                        DontshowPercentage={true}
                        showInMulipleLine={'column-reverse'}
                        fontColor={'#DB3022'}
                      />
                    </PriceQtyWrapper>
                  </ItemDescription>
                  <RemoveItem onPress={() => removeCartItem(product)}>
                    <AText color="#fff">
                      <Icon color={'#72787e'} name="close" size={12} />
                    </AText>
                  </RemoveItem>
                </TouchableOpacity>
              ))}
              {cartProducts && cartProducts.length > 0 ? (
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 26,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: 8,
                  }}>
                  <AText color="gray" small fonts={FontStyle.semiBold}>
                    {cartProducts.length}{' '}
                    {cartProducts.length > 1 ? 'Items' : 'Item'} in your cart
                  </AText>
                  <AText color="gray" small fonts={FontStyle.semiBold}>
                    Clear
                  </AText>
                </View>
              ) : null}
              <AInputFeild
                type="text"
                value={couponCode}
                onChangeText={(text) => setCouponCode(text)}
                placeholder="Enter coupon code"
              />
              {couponApplied && <AText>Coupon Applied successfully</AText>}
              <View style={{ width: '40%', alignSelf: 'flex-end' }}>
                <AButton
                  onPress={() => ApplyCoupon()}
                  round
                  block
                  title="Apply Coupon"
                  small
                  semi
                />
              </View>
            </>
          ) : (
            <EmptyWrapper>
              <AText heavy large center mb="10px">
                Your cart is currently empty.
              </AText>
              <AButton
                title="Shop Now"
                onPress={() => navigation.navigate('CateGories')}
              />
            </EmptyWrapper>
          )}
          {cartProducts && cartProducts.length ? (
            <>
              {/* <CouponWrapper
                onPress={() =>
                  couponApplied
                    ? removeCoupon()
                    : (setCouponCode(''), setCouponModal(true))
                }>
                <ARow row>
                  <MaterialIcons name="brightness-percent" size={25} />
                  {couponApplied ? (
                    <AText left ml="7px" mt={-5} medium>
                      Coupon applied {couponCode} {`\n`}
                      <AText left small color={'#009A68'}>
                        Coupon saving{' '}
                        {formatCurrency(
                          couponDiscount,
                          currencyOptions,
                          currencySymbol,
                        )}
                      </AText>
                    </AText>
                  ) : (
                    <AText ml="5px" center medium>
                      Apply Coupon
                    </AText>
                  )}
                </ARow>
                <AText medium heavy>
                  {couponApplied ? 'Remove' : 'Select'}
                </AText>
              </CouponWrapper> */}
              <CheckoutWrapper>
                <View style={{ width: '100%', marginBottom: 25 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <AText fonts={FontStyle.semiBold}>Items</AText>
                    <AText color="gray">$1139.99</AText>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderBottomWidth: 0.5,
                      paddingBottom: 15,
                    }}>
                    <AText fonts={FontStyle.semiBold}>Discount</AText>
                    <AText color="gray">7%</AText>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 5,
                    }}>
                    <AText fonts={FontStyle.semiBold}>Grand Total</AText>
                    <AText color="gray">$914.00</AText>
                  </View>
                </View>
                {/* <PriceTotal>
                  <PriceWrapper>
                    <AText
                      right
                      lineThrough={couponApplied}
                      small={couponApplied}
                      heavy={!couponApplied}
                      color={couponApplied ? '#7b7b7b' : '#000000'}>
                      {formatCurrency(
                        subtotal + delievery,
                        currencyOptions,
                        currencySymbol,
                      )}
                    </AText>
                    {couponApplied ? (
                      <AText medium heavy>
                        {formatCurrency(
                          coupontotal,
                          currencyOptions,
                          currencySymbol,
                        )}
                      </AText>
                    ) : null}
                  </PriceWrapper>
                </PriceTotal> */}
                <AButton
                  title="Proceed to Checkout"
                  round
                  mb="30px"
                  onPress={() => {
                    !isEmpty(cartId)
                      ? navigation.navigate('MyCart', {
                          screen: 'Shipping',
                          cartAmount: subtotal,
                          cartProducts: cartProducts,
                          couponCode: couponCode,
                        })
                      : navigation.navigate('AccountWrapper', {
                          screen: 'LoginSignUp',
                          initial: false,
                        });
                  }}
                />
              </CheckoutWrapper>
            </>
          ) : null}
        </>
      </View>

      {/*---------- Add coupon Modal---------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={couponModal}
        animationInTiming={1500}>
        {/* <ModalWrapper /> */}
        <ModalConatiner>
          <ModalHeader>
            <View style={{ width: '80%' }}>
              <AText center medium heavy>
                Apply Coupon
              </AText>
            </View>
            {/* <ModalClose> */}
            <View style={{ width: '5%' }}>
              <Icon
                onPress={() => {
                  setCouponModal(false);
                }}
                name="close"
                size={22}
                color="#000"
                style={{ textAlign: 'right' }}
              />
            </View>
            {/* </ModalClose> */}
          </ModalHeader>
          <ModalBody>
            <AInputFeild
              type="text"
              value={couponCode}
              onChangeText={(text) => setCouponCode(text)}
              placeholder="Please enter a valid coupon code"
            />
            {couponApplied && <AText>Coupan Applied successfully</AText>}

            <AButton onPress={() => ApplyCoupon()} round block title="Submit" />
          </ModalBody>
        </ModalConatiner>
      </Modal>
    </>
  );
};
const ItemContainer = styled.ScrollView`
  flex: 0.75;
  padding-bottom: 20px;
  background-color: #fff;
`;
const ModalConatiner = styled.ScrollView`
  background: #f7f7f7;
  height: 350px;
  flex: 1;
  flex-direction: column;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  box-shadow: 15px 5px 15px #000;
  elevation: 15;
`;
const ModalClose = styled.TouchableOpacity`
  background: #fff;
  width: 25px;
  height: 25px;
  border-radius: 25px;
  position: absolute;
  top: 15px;
  right: 15px;
  align-items: center;
  justify-content: center;
`;
const ModalHeader = styled.View`
  height: 50px;
  background: #dadada;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const ModalBody = styled.View`
  padding: 20px;
  height: 100%;
  position: relative;
`;
const AInputFeild = styled.TextInput`
  border-color: gray;
  border-bottom-width: 1px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 10px;
`;
const PriceTotal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding: 2px 10px;
`;
const CheckoutWrapper = styled.View`
  position: absolute;
  bottom: 0;
  left: 30;
  right: 0;
  background-color: transparent;
  padding-top: 5px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const EmptyWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 300px;
`;
const PriceWrapper = styled.View``;
const ItemWrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  height: 105px;
  margin-top: 60px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  position: relative;
  border: 1px solid #f7f7f7;
  box-shadow: 0 0 5px #eee;
`;
const RemoveItem = styled.TouchableOpacity`
  padding: 4px;
  background: white;
  width: 25px;
  height: 25px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
  position: absolute;
  right: 0;
`;
const ItemImage = styled.ImageBackground`
  width: 90px;
  height: 105px;
  resize-mode: cover;
`;
const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
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
const QtyWrapper = styled.View`
  height: 30px;
  overflown: hidden;
  // width: 110px;
  margin: 10px 0px;
  background: white;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  // border-width: 0.5px;
`;
const QtyButton = styled.TouchableOpacity`
  background: white;
  height: 100%;
  // width: 25px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;
const CouponWrapper = styled.TouchableOpacity`
  position: absolute;
  bottom: 130;
  left: 0;
  right: 0;
  background: #eee;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  flex-direction: row;
  padding: 10px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 30,
    backgroundColor: Colors.whiteColor,
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    justifyContent: 'space-between',
    left: 0,
    right: 0,
    marginTop: 10,
    paddingHorizontal: 30,
    zIndex: 10,
  },
  productitem: {
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 105,
    marginTop: 20,
    // marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f7f7f7',
  },
});
export default CartScreen;
