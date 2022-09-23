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
  orderHistoryAction
} from '../../store/action';
import {  isEmpty } from '../../utils/helper';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import URL from '../../utils/baseurl';
import { useIsFocused } from '@react-navigation/native';
import { Modal } from 'react-native';


const OrderScreen = ({ navigation }) => {
  const { userDetails, isLoggin } = useSelector(state => state.customer);
  const { orderList, loading } = useSelector(state => state.orders);
  const { Loading, products } = useSelector(state => state.products);
  const loadingproduct = useSelector(state => state.products.loading);
  const dispatch = useDispatch();
  const isFocused = useIsFocused()
  const [cartProducts, setCartProduct] = useState([]);
  const [orderDetailModal, setOrderDetailModal] = useState(false);



  useEffect(() => {
    if (!isEmpty(userDetails)) {
      // dispatch(productsAction());
      const payload = {
        user_id: userDetails._id
      }
      dispatch(orderHistoryAction(payload));
    }
  }, [isFocused]);

  useEffect(() => {
    ListProducts();
  }, [products, orderList]);



  const ListProducts = () => {
    setCartProduct([...orderList])
  };

  return (
    <>
      {loadingproduct || loading ? <AppLoader /> : null}
      {/* <AHeader title="Cart" /> */}
      <AHeader navigation={navigation} title="Orders" back />
      <AContainer>
        <>
          {cartProducts && cartProducts.length ? (
            <>
              {cartProducts.map((prod) => (
                <>
                  {prod.products.map((product, index) => (
                    <OrderWrapper key={index}>
                      <AttributedWrapper>
                        <AText small >
                          Order ID:{' '}
                          <AText small heavy>
                            {prod.id}
                          </AText>
                        </AText>

                      </AttributedWrapper>

                      <ItemWrapper
                        key={product.product_id}
                        onPress={() =>
                          // setOrderDetailModal(true)
                          navigation.navigate('OrderDetail', {
                            orderDetails: prod,
                            productIndex: index
                          })
                        }>
                        {product.feature_image ? (
                          <ItemImage
                            source={{
                              uri: URL + product.feature_image,
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
                          <AText capitalize medium heavy>
                            {product.name.length > 20
                              ? product.name.substring(0, 20) + '...'
                              : product.name}
                          </AText>
                          <AText capitalize medium >
                            {prod.status}
                          </AText>
                          {/* <PriceQtyWrapper>
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
                        </PriceQtyWrapper> */}
                        </ItemDescription>
                        <NextItem onPress={() => { }}>
                          <Icon name="chevron-right" size={15} />
                        </NextItem>
                      </ItemWrapper>
                    </OrderWrapper>
                  ))
                  }
                </>
              ))}
            </>

          ) : (
            <EmptyWrapper>
              <AText heavy large center mb="10px">
                Your have no orders for now
              </AText>
              <AButton
                title="Shop Now"
                onPress={() => navigation.navigate('CateGories')}
              />
            </EmptyWrapper>
          )}
        </>
        {/*---------- Order Detail Modal---------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={orderDetailModal}
          animationInTiming={1500}>
          {/* <ModalWrapper /> */}
          <ModalConatiner>
            <ModalHeader>

              <ModalClose onPress={() => setOrderDetailModal(false)}>
                <Icon name="close" size={15} color="#000" />
              </ModalClose>
            </ModalHeader>
            <ModalBody>


            </ModalBody>
          </ModalConatiner>
        </Modal>
      </AContainer>
    </>
  );
};


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
const OrderWrapper = styled.View`
flex: 1;
flex-direction: column;
justify-content: center;
padding: 2px 10px;
background:#f7f7f7;
margin:5px;
border-radius: 10px;
position: relative;
border: 1px solid #f7f7f7;
box-shadow: 0 0 5px #eee;
elevation: 1;
`;



const PriceTotal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding: 2px 10px;

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
  background: #f7f7f7;
  overflow: hidden;

`;
const NextItem = styled.TouchableOpacity`
  padding: 4px;
  width: 18px;
  justify-content: center;
  align-items: center;
  align-self: center;
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
  justify-content:center
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


export default OrderScreen;
