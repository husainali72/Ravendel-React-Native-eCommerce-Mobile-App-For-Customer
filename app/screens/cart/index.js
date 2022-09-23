import React, { useEffect, useState } from 'react';
import {
  AText,
  AContainer,
  AHeader,
  AppLoader,
  AButton,
} from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import { productsAction } from '../../store/action/productAction';
import {
  removeCartItemAction,
  checkStorageAction,
} from '../../store/action/cartAction';
import { isEmpty } from '../../utils/helper';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import URL from '../../utils/baseurl';
import AsyncStorage from '@react-native-community/async-storage';

const CartScreen = ({ navigation }) => {
  const checkStorage = useDispatch();
  const cartItems = useSelector(state => state.cart.products);
  const products = useSelector(state => state.products.products);
  const allProductsFecth = useDispatch();
  const removeItem = useDispatch();
  const [cartProducts, setCartProduct] = useState([]);
  const Loading = useSelector(state => state.products.loading);
  const [subtotal, setSubTotal] = useState(0);
  const [delievery, setDelievery] = useState(0);

  useEffect(() => {
    navigation.addListener('focus', () => {
      checkStorage(checkStorageAction());
    });
  }, [navigation]);

  useEffect(() => {
    if (cartItems !== null) {
      ListProducts();
    }
  }, [cartItems]);

  useEffect(() => {
    ListProducts();
  }, [products]);

  useEffect(() => {
    cartSubTotal();
  }, [cartProducts]);

  const ListProducts = () => {
    if (!isEmpty(products)) {
      var filteredProducts = [];
      if (cartItems !== null && cartItems.length > 0) {
        cartItems.map(item => {
          products.filter(product => {
            if (product.id === item.id) {
              product.cartQty = item.cartQty;
              filteredProducts.push(product);
            }
          });
        });
      }
      setCartProduct(filteredProducts);
    } else {
      allProductsFecth(productsAction());
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
    setSubTotal(subtotalVar);
  };

  const removeCartItem = removedItem => {
    removedItem.cart = false;
    let filteredProduct = cartProducts.filter(item => item !== removedItem);
    let filterCartItem = cartItems.filter(item => item.id !== removedItem.id);
    setCartProduct(filteredProduct);
    removeItem(removeCartItemAction(filterCartItem));
  };

  const increaseItemQty = async item => {
    cartItems.map(cart => {
      if (cart.id === item.id) {
        cart.cartQty = cart.cartQty + 1;
      }
    });
    try {
      await AsyncStorage.setItem('cartproducts', JSON.stringify(cartItems));
      ListProducts();
    } catch (error) {
      console.log('Something went Wrong!!!!');
    }
  };

  const decreaseItemQty = async item => {
    if (item.cartQty <= 1) {
      return;
    }
    cartItems.map(cart => {
      if (cart.id === item.id) {
        cart.cartQty = cart.cartQty - 1;
      }
    });
    try {
      await AsyncStorage.setItem('cartproducts', JSON.stringify(cartItems));
      ListProducts();
    } catch (error) {
      console.log('Something went Wrong!!!!');
    }
  };

  return (
    <>
      {Loading ? <AppLoader /> : null}
      <AHeader title="Cart" />
      <AContainer>
        <>
          {cartProducts && cartProducts.length ? (
            <>
              {cartProducts.map(product => (
                <ItemWrapper
                  key={product.id}
                  onPress={() =>
                    navigation.navigate('Categories', {
                      screen: 'SingleProduct',
                      initial: false,
                      params: { productID: product.id },
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
                  onPress={() => navigation.navigate('Categories')}
                />
              </EmptyWrapper>
            )}
        </>
      </AContainer>

      {cartProducts && cartProducts.length ? (
        <CheckoutWrapper>
          <PriceTotal>
            <AText medium>{cartProducts.length} Items</AText>
            <AText medium heavy>
              ${subtotal + delievery}
            </AText>
          </PriceTotal>
          <AButton
            title="Proceed to Checkout"
            block
            onPress={() => navigation.navigate('Shipping', {
              cartAmount: subtotal,
              cartProducts: cartProducts,
            })}
          />
        </CheckoutWrapper>
      ) : null}
    </>
  );
};

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

export default CartScreen;
