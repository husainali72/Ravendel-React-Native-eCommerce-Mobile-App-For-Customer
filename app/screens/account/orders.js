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
import { isEmpty } from '../../utils/helper';
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



  useEffect(() => {
    if (!isEmpty(userDetails)) {
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
                          navigation.navigate('OrderDetail', {
                            orderDetails: prod,
                            productIndex: index
                          })
                        }>

                        <ItemImage
                          source={{
                            uri: !isEmpty(product.feature_image) ? URL + product.feature_image : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                          }}
                        />

                        <ItemDescription>
                          <AText capitalize medium heavy>
                            {product.name.length > 20
                              ? product.name.substring(0, 20) + '...'
                              : product.name}
                          </AText>
                          <AText capitalize medium >
                            {prod.status}
                          </AText>
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
      </AContainer>
    </>
  );
};




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
const EmptyWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 300px;
`;
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

export default OrderScreen;
