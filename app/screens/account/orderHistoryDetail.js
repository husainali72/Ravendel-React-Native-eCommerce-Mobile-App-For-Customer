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
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import URL from '../../utils/baseurl';
import { useIsFocused } from '@react-navigation/native';
import { DataTable, Text } from 'react-native-paper';
import { isEmpty } from '../../utils/helper';


const OrderDetailScreen = ({ navigation, route }) => {
    const { orderDetails, productIndex } = route.params;
    const { loading } = useSelector(state => state.orders);
    const loadingproduct = useSelector(state => state.products.loading);
    const dispatch = useDispatch();
    const isFocused = useIsFocused()

    const OrdersShowView = React.memo(() => {
        return (
            <>
                {orderDetails.products &&
                    orderDetails.products.map((product, index) => {
                        if (index !== productIndex) {
                            return (
                                <ItemWrapper
                                    key={product.product_id}
                                    onPress={() =>
                                        // setOrderDetailModal(true)
                                        navigation.navigate('CateGories', {
                                            screen: 'SingleProduct',
                                            initial: false,
                                            params: { productID: product.product_id },
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
                                            {orderDetails.status}
                                        </AText>
                                    </ItemDescription>
                                    <NextItem onPress={() => { }}>
                                        <Icon name="chevron-right" size={15} />
                                    </NextItem>
                                </ItemWrapper>
                            )
                        }
                    })
                }
            </>
        )
    }, [orderDetails])
    return (
        <>
            {loadingproduct || loading ? <AppLoader /> : null}
            {/* <AHeader title="Cart" /> */}
            <AHeader navigation={navigation} title="Order Detail" back />
            <AContainer>
                <OrderDetailHeader>
                    <AText small >
                        Order ID:{' '}
                        <AText small heavy>
                            {orderDetails.id}
                        </AText>
                    </AText>
                </OrderDetailHeader>
                <ItemWrapper
                    key={orderDetails.product_id}
                    onPress={() =>
                        // setOrderDetailModal(true)
                        navigation.navigate('CateGories', {
                            screen: 'SingleProduct',
                            initial: false,
                            params: { productID: orderDetails.products[productIndex].product_id },
                        })
                    }>
                    <ItemDescription>
                        <AText capitalize medium heavy>
                            {orderDetails.products[productIndex].name.length > 20
                                ? orderDetails.products[productIndex].name.substring(0, 20) + '...'
                                : orderDetails.products[productIndex].name}
                        </AText>
                        {/* <AText capitalize medium >
                            {orderDetails.products[productIndex].status}
                        </AText> */}
                        <AttributedWrapper>
                            <AText small light ml="10px">
                                Qty:{' '}
                                <AText small heavy>
                                    {orderDetails.products[productIndex].qty}
                                </AText>
                            </AText>
                        </AttributedWrapper>

                        <PriceQtyWrapper>
                            <PriceWrapper>
                                <AText
                                    right
                                    heavy={true}
                                    color={'#7b7b7b'}>
                                    ${(orderDetails.products[productIndex].cost).toFixed(2)}
                                </AText>
                            </PriceWrapper>
                        </PriceQtyWrapper>
                    </ItemDescription>

                    <ItemImage
                        source={{
                            uri: !isEmpty(orderDetails.products[productIndex].feature_image) ? URL + orderDetails.products[productIndex].feature_image : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                        }}
                    />


                </ItemWrapper>
                <OrderProccessingDetails>
                    <OrderProcessWrapper>
                        <VerticalLine color={'green'}></VerticalLine>
                        <OrderProcessCircle color={'green'} ></OrderProcessCircle>
                        <AText>Order Confirmed</AText>
                    </OrderProcessWrapper>
                    <OrderProcessWrapper>
                        <VerticalLine></VerticalLine>
                        <OrderProcessCircle color={'green'}></OrderProcessCircle>
                        <AText>Shipped</AText>
                    </OrderProcessWrapper>
                    <OrderProcessWrapper>
                        <VerticalLine></VerticalLine>
                        <OrderProcessCircle></OrderProcessCircle>
                        <AText>Out for Delivery</AText>
                    </OrderProcessWrapper>
                    <OrderProcessWrapper>
                        <OrderProcessCircle></OrderProcessCircle>
                        <AText>Delivered</AText>
                    </OrderProcessWrapper>
                </OrderProccessingDetails>
                <ShippingDetails>
                    <ShippingHeader>
                        <AText capitalize medium heavy>Shipping Details</AText>
                    </ShippingHeader>
                    <AText capitalize medium>{orderDetails.shipping.firstname}</AText>
                    <AText medium >{orderDetails.shipping.address}, {orderDetails.shipping.city}</AText>
                    <AText medium >{orderDetails.shipping.state}, {orderDetails.shipping.pincode}</AText>
                    <AText bold medium>Phone number: {orderDetails.shipping.phone}, </AText>
                </ShippingDetails>

                <ShippingDetails>
                    <ShippingHeader>
                        <AText capitalize medium heavy>Billing Details</AText>
                    </ShippingHeader>
                    <AText capitalize medium>{orderDetails.billing.firstname} {orderDetails.billing.lastname}</AText>
                    <AText medium >{orderDetails.billing.address}, {orderDetails.billing.city}</AText>
                    <AText medium >{orderDetails.billing.state}, {orderDetails.billing.zip}</AText>
                    <AText bold medium>Phone number: {orderDetails.billing.phone}, </AText>
                </ShippingDetails>

                <OrdersShowView />

                <ShippingDetails>
                    <ShippingHeader>
                        <AText capitalize medium heavy>Price Details</AText>
                    </ShippingHeader>
                    <DataTable>
                        <DataTable.Row>
                            <DataTable.Cell>Payment</DataTable.Cell>
                            <DataTable.Cell numeric>
                                {orderDetails.billing.payment_method}
                            </DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Cart total ({orderDetails.products.length})</DataTable.Cell>
                            <DataTable.Cell numeric>${orderDetails.subtotal}</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Cart savings </DataTable.Cell>
                            <DataTable.Cell numeric>{orderDetails.discount_amount > 0 ? '-$' + orderDetails.discount_amount : '$0'}</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Delivery Charges</DataTable.Cell>
                            <DataTable.Cell numeric>{orderDetails.shipping_amount <= 0 ? 'Free' : '$' + orderDetails.shipping_amount}</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Taxes</DataTable.Cell>
                            <DataTable.Cell numeric>${orderDetails.tax_amount > 0 ? (parseFloat(orderDetails.tax_amount)).toFixed(2) : '0'}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Amount Payable</DataTable.Cell>
                            <DataTable.Cell numeric>${orderDetails.grand_total}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                </ShippingDetails>
            </AContainer>
        </>
    );
};
const OrderProccessingDetails = styled.View`
    flex: 1;
    justify-content:center;
    background: #f7f7f7;
    margin:10px 2px;
    padding:10px;
`;
const OrderProcessWrapper = styled.View`
    flex-direction:row;
    margin:10px 10px;
    align-items: center;
`;
const OrderProcessCircle = styled.View`
background:${props => props.color ?? '#dadada'};
    border-radius: 20;
    height: 15px;
    width: 15px;
    margin: 5px 15px;
`;
const VerticalLine = styled.View`
    background:${props => props.color ?? '#dadada'};
    width: 3px;
    height:30px
    position: absolute;
    margin:5px 21px;
    top:15px;
    align-items: center;
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
const OrderDetailHeader = styled.View`
    justify-content: center;
    align-items:center;
    padding:7px;
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

const ShippingDetails = styled.View`
    flex: 1;
    justify-content:center;
    background: #f7f7f7;
    margin:10px 2px;
`;
const ShippingHeader = styled.View`
    background: #dadada;
    border-color: gray;
    border-bottom-width: 1px;
    justify-content: center;
    padding:5px;
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



export default OrderDetailScreen;
