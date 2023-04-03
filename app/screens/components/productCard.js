import React from 'react';
import { AText } from '../../theme-components';
import styled from 'styled-components/native';
import URL from '../../utils/baseurl';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../utils/helper';
import { StyleSheet } from 'react-native';
import ProductPriceText from './productPrice';

const ProductCard = (props) => {
  const product = props.productDetail;
  const NavigateTo = props.navigationChild;

  const navigateSingleProductScreen = (id) => {
    NavigateTo.navigate('SingleProduct', {
      productID: id,
    });
  };
  return (
    <>
      <Card onPress={() => navigateSingleProductScreen(product._id)}>
        <CardImageWrapper>
          <FastImage
            style={styles.productImage}
            source={{
              uri: !isEmpty(product.feature_image)
                ? URL + product.feature_image
                : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </CardImageWrapper>
        <CardBody>
          <ProductPriceText
            fontsizesmall={true}
            DontshowPercentage={true}
            fontColor={'#DB3022'}
            Pricing={product.pricing}
          />

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
const styles = StyleSheet.create({
  productImage: { flex: 1, resizeMode: 'cover' },
});
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
  padding: 10px 5px;
`;

export default ProductCard;
