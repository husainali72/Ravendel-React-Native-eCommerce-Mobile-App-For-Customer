import React from 'react';
import { AText } from '../../theme-components';
import styled from 'styled-components/native';
import URL from '../../utils/baseurl';
import FastImage from 'react-native-fast-image';

const ProductCard = props => {
  const product = props.productDetail;
  const NavigateTo = props.navigationChild;

  const navigateSingleProductScreen = id => {
    NavigateTo.navigate('SingleProduct', {
      productID: id,
    });
  };
  return (
    <>
      <Card onPress={() => navigateSingleProductScreen(product._id)}>
        <CardImageWrapper>
          {product.feature_image ? (
            <>
            <FastImage
              style={{ flex:1,resizeMode:'cover' }}
              source={{
                  uri:  URL + product.feature_image.medium,                
                  priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            {/* <CardImage
              source={{
                uri: URL + product.feature_image.medium,
              }}
            /> */}
            </>
          ) : (
              <CardNotImage
                source={{
                  uri:
                    'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                }}
              />
            )}
        </CardImageWrapper>
        <CardBody>
          <AText>
          {product.pricing.sellprice ? (
              <AText heavy color="#DB3022">
                ${product.pricing.sellprice.toFixed(2)}{'  '}
              </AText>
            ) : null}
            <AText
              lineThrough={product.pricing.sellprice ? true : false}
              medium={product.pricing.sellprice ? false : true}
              heavy={product.pricing.sellprice ? false : true}
              color={product.pricing.sellprice ? '#7b7b7b' : '#000000'}>
              ${product.pricing.price.toFixed(2)}
            </AText>
        
          </AText>
          <AText small bold color="#000">
            {product.name.length > 20
              ? product.name.substring(0, 20) + '...'
              : product.name}
          </AText>
        </CardBody>
      </Card>
    </>
  );
};

const Card = styled.TouchableOpacity`
  width: 100%;
  background: #f2f0f0;
  padding: 5px;
  border-radius: 10px;
`;

const CardImageWrapper = styled.View`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
`;

const CardImage = styled.Image`
  width: null;
  height: null;
  flex: 1;
  resize-mode: cover;
`;

const CardNotImage = styled.Image`
  width: null;
  height: null;
  flex: 1;
  resize-mode: contain;
`;

const CardBody = styled.View`
  padding: 15px 5px;
`;

export default ProductCard;
