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
  REMOVE_ITEM_IN_CART,
  applyCouponAction,
  COUPON_REMOVED,
  checkStorageAction,
} from '../../store/action';
import { getToken, isEmpty } from '../../utils/helper';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import URL from '../../utils/baseurl';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { REMOVE_ALL_CART_PRODUCT, UPDATE_CART_PRODUCT } from '../../store/action/checkoutAction';
import { Modal } from 'react-native';


const CartScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Cart',
      headerTransparent: false,
      headerTintColor: '#000',
      headerRight: () => (
        <>
          {!isEmpty(cartItems) && cartItems.length > 0 &&
            <AButton
              style={{ position: 'absolute', right: 10}}
              title={
            (  <MaterialIcons name="cart-remove" size={22}  style={{ justifyContent: 'center', }} />)

              }
              onPress={() => clearCart()}
            />
          }
        </>
      ),

    });
  }, [navigation]);
  const { userDetails, isLoggin } = useSelector(state => state.customer);
  const cartItems = useSelector(state => state.cart.products);
  const { cartId, couponDiscount,loading } = useSelector(state => state.cart);
  const { Loading, products } = useSelector(state => state.products); 
  const loadingproduct = useSelector(state => state.products.loading); 
  const dispatch = useDispatch();
  const isFocused = useIsFocused()
  const [cartProducts, setCartProduct] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const [delievery, setDelievery] = useState(0);
  const [coupontotal, setCouponTotal] = useState(0);
  const [couponModal, setCouponModal] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState('')


  useEffect(() => {
    dispatch(productsAction());
    fetchCart();
  }, [isFocused]);


  const fetchCart =()=>{
    if (isEmpty(userDetails)) {
      dispatch(checkStorageActio());
    } else {
      dispatch(checkStorageAction(userDetails._id));
    }
      ListProducts()
  }

  useEffect(() => {
    ListProducts();
  }, [products,cartItems]);

  useEffect(() => {
    cartSubTotal();
  }, [cartProducts, couponDiscount]);

  const ListProducts = () => {
    if (!isEmpty(products)) {
      setCartProduct([])
      var filteredProducts = [];
      if (!isEmpty(cartItems) && cartItems.length > 0) {
        cartItems.map(item => {
          products.filter(product => {
            if (product._id === item.product_id) {
              filteredProducts.push({ ...product, cartQty: item.qty });
            }
          });
        });
      }
      setCartProduct([...filteredProducts])
    } else {
      dispatch(productsAction());
    }
  };

  const cartSubTotal = () => {
    var subtotalVar = 0;
    if (cartProducts && cartProducts.length) {
      cartProducts.map(item => {
        if (item.pricing.sellprice) {
          var sellPrice = item.pricing.sellprice * item.cartQty;
          subtotalVar = subtotalVar + sellPrice;
        } else {
          var totalPrice = item.pricing.price * item.cartQty;
          subtotalVar = subtotalVar + totalPrice;
        }
      });
    }
    if (!isEmpty(couponDiscount) && couponDiscount>0) {
      setCouponApplied(true)
      let subto =subtotalVar - couponDiscount
      if(subto<0){
        setCouponTotal(0)
      }else{
        setCouponTotal(subtotalVar - couponDiscount)
      }
     
    }
    setSubTotal(subtotalVar);
  };

  const removeCartItem = async removedItem => {
    removedItem.cart = false;
    let filteredProduct = cartProducts.filter(item => item._id !== removedItem._id);
    let filterCartItem = cartItems.filter(item => item.product_id !== removedItem._id);
    try {
      if (isLoggin) {
        const cartData = {
          id: cartId,
          product_id: removedItem._id,
        }
        dispatch(removeFromCartAction(cartData,userDetails._id))
      } else {
        await AsyncStorage.setItem('cartproducts', JSON.stringify(filterCartItem));
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
  const increaseItemQty = async item => {
    var cartitem = []
    cartItems.map(cart => {
      if (cart.product_id === item._id) {
        cartitem.push({
          product_id:cart.product_id,
          product_title:cart.product_title,
          qty: cart.qty + 1
        })
      }else{
        cartitem.push(cart)
      }
    });
    if (isLoggin) {
      var cartpro = []
      cartitem.map(cart => {
        cartpro.push({
          "product_id": cart.product_id,
          "product_image": cart.product_image,
          "product_title": cart.product_title,
          "qty": cart.qty,
        })
      })
      var cartData = {
        id: cartId,
        products: cartpro,
      }
      dispatch(updateCartAction(cartData,userDetails._id))
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

  const decreaseItemQty = async item => {
    if (item.cartQty <= 1) {
      return;
    }
    var cartitem = []
    cartItems.map(cart => {
      if (cart.product_id === item._id) {
        cartitem.push({
          product_id:cart.product_id,
          product_title:cart.product_title,
          qty: cart.qty - 1
        })
      }else{
        cartitem.push(cart)
      }
    })
    if (isLoggin) {
      var cartpro = []
      cartitem.map(cart => {
        cartpro.push({
          "product_id": cart.product_id,
          "product_image": cart.product_image,
          "product_title": cart.product_title,
          "qty": cart.qty,
        })
      })
      var cartData = {
        id: cartId,
        products: cartpro,
      }
      dispatch(updateCartAction(cartData,userDetails._id))
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
      type: REMOVE_ALL_CART_PRODUCT
    })
    if (isLoggin) {
      const cartData = {
        id: cartId,
        products: [],
      }
      dispatch(updateCartAction(cartData,userDetails._id))
    }
   
    ListProducts();

  }
  const ApplyCoupon = () => {
    let cartpro = []
    cartItems.map(cart => {
      cartpro.push({
        "product_id": cart.product_id,
        "total": cart.total,
        "qty": cart.qty,
      })
    })
    const payload = {
      "coupon_code": couponCode,
      cart: cartpro
    }
    setCouponModal(false)
    dispatch(applyCouponAction(payload))
  }

  const removeCoupon=()=>{
    dispatch({
      type:COUPON_REMOVED
    })
    setCouponApplied(false)
    setCouponCode('')
    setCouponTotal(0)
  }
  return (
    <>
      {loadingproduct || loading ? <AppLoader /> : null}
      {/* <AHeader title="Cart" /> */}
      <ItemContainer>
        <>
          {cartProducts && cartProducts.length ? (
            <>
              {cartProducts.map(product => (
                <ItemWrapper
                  key={product.id}
                  onPress={() =>
                    navigation.navigate('CateGories', {
                      screen: 'SingleProduct',
                      initial: false,
                      params: { productID: product._id  },
                    })
                  }>
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
                      <QtyWrapper>
                        <QtyButton onPress={() => decreaseItemQty(product)}>
                          <AText color="#fff">
                            <Icon name="minus" />
                          </AText>
                        </QtyButton>
                        <AText medium bold ml="7px" mr="7px">
                          {product.cartQty}
                        </AText>
                        <QtyButton onPress={() => increaseItemQty(product)}>
                          <AText color="#fff">
                            <Icon name="plus" />
                          </AText>
                        </QtyButton>
                      </QtyWrapper>
                      <PriceWrapper>
                        <AText
                          right
                          lineThrough={product.pricing.sellprice ? true : false}
                          small={product.pricing.sellprice ? true : false}
                          heavy={product.pricing.sellprice ? false : true}
                          color={
                            product.pricing.sellprice ? '#7b7b7b' : '#000000'
                          }>
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
                  <RemoveItem onPress={() => removeCartItem(product)}>
                    <AText color="#fff">
                      <Icon name="close" size={10} />
                    </AText>
                  </RemoveItem>
                </ItemWrapper>
              ))}
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
        </>
      </ItemContainer>

      {cartProducts && cartProducts.length ? (
        <>
          <CouponWrapper 
            onPress={() => couponApplied?removeCoupon():setCouponModal(true)}
          >
            <ARow row>
              <MaterialIcons name="brightness-percent" size={25} style={{ justifyContent: 'center', marginRight: 5,marginTop:couponApplied? 7:0 }} />
             {couponApplied?
              <AText left medium>Coupon applied {couponCode} {`\n`}
              <AText left small color={'#009A68'}>Coupon saving ${couponDiscount}</AText>
              </AText>
             : <AText center medium>Apply Coupon</AText>
             }
            </ARow>
            <AText medium heavy>{couponApplied?'Remove':'Select'}</AText>
          </CouponWrapper>
          <CheckoutWrapper>
            <PriceTotal>
              <AText medium>{cartProducts.length} Items</AText>
              <PriceWrapper>
                <AText
                  right
                  lineThrough={couponApplied}
                  small={couponApplied}
                  heavy={!couponApplied}
                  color={
                    couponApplied ? '#7b7b7b' : '#000000'
                  }>
                  ${subtotal + delievery}
                </AText>
                {couponApplied ? (
                  <AText medium heavy>
                    ${(coupontotal).toFixed(2)}
                  </AText>
                ) : null}
              </PriceWrapper>
            </PriceTotal>
            <AButton
              title="Proceed to Checkout"
              block
              onPress={() => {!isEmpty(cartId) ? navigation.navigate('Shipping', {
                cartAmount: subtotal,
                cartProducts: cartProducts,
              }): navigation.navigate('AccountWrapper',{
                screen:'Login',
                initial:false
              }) }}
            />
          </CheckoutWrapper>
        </>
      ) : null}
      {/*---------- Add coupon Modal---------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={couponModal}
        animationInTiming={1500}>
        {/* <ModalWrapper /> */}
        <ModalConatiner>
          <ModalHeader>
            <AText center medium heavy>
              Apply Coupon
            </AText>
            <ModalClose onPress={() => setCouponModal(false)}>
              <Icon name="close" size={15} color="#000" />
            </ModalClose>
          </ModalHeader>
          <ModalBody>
            <AInputFeild
              type="text"
              value={couponCode}
              onChangeText={(text) => setCouponCode(text)}
              placeholder="Please enter a valid coupon code"
            />
            {couponApplied &&
            <AText>Coupan Applied successfully</AText>}
            
            <AButton
              onPress={() => ApplyCoupon()}
              round
              block
              title="Submit"
            />
          </ModalBody>
        </ModalConatiner>
      </Modal>
    </>
  );
};
const ItemContainer = styled.ScrollView`
  flex: 0.75;
  padding-bottom:20px;
  background-color: #fff;
`;
const ModalWrapper = styled.ScrollView`
  background-color: rgba(0, 0, 0, 0.5);
  position: relative;
  flex: 1;
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
const ATextarea = styled.TextInput`
  border-color: gray;
  border-bottom-width: 1px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 5px;
  height: 80px;
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
  left: 0;
  right: 0;
  background: #eee;
  padding-top: 5px;
`;
const EmptyWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 300px;
`;
const PriceWrapper = styled.View``;
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
const RemoveItem = styled.TouchableOpacity`
  padding: 4px;
  background: rgba(0, 0, 0, 0.5);
  width: 18px;
  height: 18px;
  border-radius: 18px;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const QtyButton = styled.TouchableOpacity`
  padding: 5px;
  background: #000;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;
const CouponWrapper = styled.TouchableOpacity`
position: absolute;
bottom: 100;
left: 0;
right: 0;
background: #eee;
justify-content: space-between;
align-items: center;
flex: 1;
flex-direction: row;
padding: 10px;
`;
const ApplyCouponTex = styled.View`
  margin-bottom: 15px;
  padding: 0 5px;
`;
const CustomInput = styled.TextInput`
 
`;

export default CartScreen;
