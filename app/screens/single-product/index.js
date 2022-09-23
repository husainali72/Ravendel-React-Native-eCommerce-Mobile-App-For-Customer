import React, { useEffect, useState } from 'react';
import {
  productsAction,
  productAction,
  productReviewsAction,
  productAddReviewAction,
} from '../../store/action/productAction';
import { useSelector, useDispatch } from 'react-redux';
import { AText, ARow, ACol, AppLoader, AButton } from '../../theme-components';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GalleryImagesSlider from './galleryImages';
import HTMLView from 'react-native-htmlview';
import { Modal } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-community/async-storage';

var reviewObject = {
  title: '',
  email: 'review@email.com',
  review: '',
  rating: '0',
  status: 'pending',
  customer_id: '5e58ddd73a4cf62a50a386a9',
  product_id: '',
};

const SingleProductScreen = ({ navigation, route }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: '#000',
    });
  }, [navigation]);

  const ProductId = route.params.productID;
  const [review, setReview] = useState(reviewObject);
  const dispacthSingleProdut = useDispatch();
  const SingleProduct = useSelector(state => state.products.product);
  const DispacyAddReview = useDispatch();
  const DispacyReviewProdut = useDispatch();
  const ReviewProduct = useSelector(state => state.products.productReviews);
  const Loading = useSelector(state => state.products.loading);
  const [descriptionCollapse, setDescriptionCollapse] = useState(false);
  const [reviewcollapse, setReviewCollapse] = useState(false);
  const [writeReviewPop, setWriteReviewPop] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const cartItems = useSelector(state => state.cart.products);
  const [itemInCart, setItemInCart] = useState(false);
  const [singleProductLoading, setSingleProductLoading] = useState(true);

  useEffect(() => {
    navigation.addListener('focus', () => {
      console.log('Single Product Focus');
      setSingleProductLoading(true);
      dispacthSingleProdut(productAction(ProductId));
      //DispacyReviewProdut(productReviewsAction(ProductId));
      setItemInCart(false);
      setSingleProductLoading(false);
    });
  }, [navigation, ProductId]);

  useEffect(() => {
    setSingleProductLoading(true);
    if (cartItems && cartItems.length) {
      cartItems.map(item => {
        if (item.id === ProductId) {
          setItemInCart(true);
        }
      });
    }
    var allimages = [];
    if (SingleProduct.feature_image) {
      allimages.push(SingleProduct.feature_image);
    }
    if (SingleProduct.gallery_image) {
      SingleProduct.gallery_image.map(img => {
        allimages.push(img);
      });
    }
    setSliderImages(allimages);
    setSingleProductLoading(false);
  }, [SingleProduct]);

  const addReview = () => {
    //DispacyAddReview(productAddReviewAction(review));
    setReview(reviewObject);
    setWriteReviewPop(!writeReviewPop);
  };

  const _storeData = async product => {
    try {
      await AsyncStorage.setItem('cartproducts', JSON.stringify(product));
      navigation.navigate('Cart');
    } catch (error) {
      console.log('Something went Wrong!!!!');
    }
  };

  const addToCart = async () => {
    const hasCartProducts = await AsyncStorage.getItem('cartproducts');

    if (itemInCart) {
      console.log('Item is already in a Cart');
      return true;
    }

    if (hasCartProducts !== null) {
      setItemInCart(true);
      var products = JSON.parse(hasCartProducts);
      products.push({
        id: SingleProduct.id,
        cartQty: 1,
      });
      _storeData(products);
    } else {
      _storeData([
        {
          id: SingleProduct.id,
          cartQty: 1,
        },
      ]);
    }
  };

  return (
    <>
      {singleProductLoading ? <AppLoader /> : null}

      {SingleProduct && (
        <MainConatiner>
          {/* ===============Featured Images============= */}
          <GallerySliderWrapper>
            <GalleryImagesSlider images={sliderImages} />
          </GallerySliderWrapper>
          <InnerConatiner>
            {/* ===============Product Price============= */}
            <ProductPrice>
              <AText>
                <AText
                  lineThrough={SingleProduct.pricing.sellprice ? true : false}
                  large={SingleProduct.pricing.sellprice ? false : true}
                  heavy={SingleProduct.pricing.sellprice ? false : true}
                  color={
                    SingleProduct.pricing.sellprice ? '#7b7b7b' : '#000000'
                  }>
                  ${SingleProduct.pricing.price.toFixed(2)}
                </AText>
                {/* ===============Has Sale Price============= */}
                {SingleProduct.pricing.sellprice ? (
                  <AText large heavy color="#DB3022">
                    {'  '}${SingleProduct.pricing.sellprice.toFixed(2)}
                  </AText>
                ) : null}
              </AText>
            </ProductPrice>
            {/* ===============Product Name============= */}
            <ProductName>
              <AText medium bold>
                {SingleProduct.name}
              </AText>
            </ProductName>

            {/* ===============Product Description============= */}
            {SingleProduct.description ? (
              <CollapseWrapper>
                <CollapseTitle
                  onPress={() => setDescriptionCollapse(!descriptionCollapse)}>
                  <AText bold>Description</AText>
                  <CollapseIcon>
                    {descriptionCollapse ? (
                      <Icon name="chevron-up" color="#000" />
                    ) : (
                        <Icon name="chevron-down" color="#000" />
                      )}
                  </CollapseIcon>
                </CollapseTitle>
                <CollapseContainer
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    display: descriptionCollapse ? 'flex' : 'none',
                  }}>
                  <>
                    <HTMLView value={SingleProduct.description} />
                    {SingleProduct.custom_field ? (
                      <ARow
                        row
                        wrap
                        alignItems="center"
                        justifyContent="space-between">
                        <ACol col={2}>
                          <AText bold color="#000">
                            Name
                          </AText>
                        </ACol>
                        <ACol col={2}>
                          <AText bold color="#000">
                            Value
                          </AText>
                        </ACol>
                        <ACol col={1}>
                          {SingleProduct.custom_field.map((field, index) => {
                            return (
                              <ARow
                                row
                                wrap
                                alignItems="center"
                                justifyContent="space-between"
                                key={index}>
                                <ACol col={2}>
                                  <AText>{field.key}</AText>
                                </ACol>
                                <ACol col={2}>
                                  <AText>{field.value}</AText>
                                </ACol>
                              </ARow>
                            );
                          })}
                        </ACol>
                      </ARow>
                    ) : null}
                  </>
                </CollapseContainer>
              </CollapseWrapper>
            ) : null}

            {/* ===============Product Reviews============= */}
            <CollapseWrapper>
              <CollapseTitle onPress={() => setReviewCollapse(!reviewcollapse)}>
                <AText bold>Reviews</AText>
                <CollapseIcon>
                  {reviewcollapse ? (
                    <Icon name="chevron-up" color="#000" />
                  ) : (
                      <Icon name="chevron-down" color="#000" />
                    )}
                </CollapseIcon>
              </CollapseTitle>
              <CollapseContainer
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  display: reviewcollapse ? 'flex' : 'none',
                }}>
                <WriteReview onPress={() => setWriteReviewPop(true)}>
                  <AText color="#eb3349" right>
                    Write your Review
                  </AText>
                </WriteReview>
                <>
                  {ReviewProduct &&
                    ReviewProduct.filter(review => review.status === 'approved')
                      .length > 0 ? (
                      ReviewProduct.filter(
                        review => review.status === 'approved',
                      ).map((singleReview, index) => (
                        <AText>{singleReview.title}</AText>
                      ))
                    ) : (
                      <AText center>Reviews is not available</AText>
                    )}
                </>
              </CollapseContainer>
            </CollapseWrapper>
          </InnerConatiner>
        </MainConatiner>
      )}

      {/* ===============Add To Cart============= */}
      <AddToCartWrapper>
        <AButton
          title={itemInCart ? 'Added' : 'Add to Cart'}
          block
          onPress={() => addToCart()}
        />
      </AddToCartWrapper>

      {/* Add Review Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={writeReviewPop}
        animationInTiming={1500}>
        <ModalWrapper />
        <ModalConatiner>
          <ModalHeader>
            <AText center medium heavy>
              Write a Review
            </AText>
            <ModalClose onPress={() => setWriteReviewPop(false)}>
              <Icon name="close" size={15} color="#000" />
            </ModalClose>
          </ModalHeader>
          <ModalBody>
            <AInputFeild
              type="text"
              value={review.title}
              onChange={e => setReview({ ...review, title: e.target.value })}
              placeholder="Title"
            />
            <ATextarea
              multiline
              value={review.review}
              rows="4"
              onChange={e => setReview({ ...review, review: e.target.value })}
              placeholder="Review"
              textAlignVertical="top"
            />
            <ARow>
              <ACol col={2}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={parseInt(review.review)}
                  selectedStar={rating =>
                    setReview({ ...review, review: rating })
                  }
                  fullStarColor={'#ffb400'}
                  starSize={25}
                />
              </ACol>
            </ARow>
            <AButton
              onPress={() => addReview()}
              round
              block
              title="Add Review"
            />
          </ModalBody>
        </ModalConatiner>
      </Modal>
    </>
  );
};

//  ===============For Style=============
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
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
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
const WriteReview = styled.TouchableOpacity`
  top: 0;
  right: 0;
  font-size: 12px;
  padding: 6px;
`;
const MainConatiner = styled.ScrollView`
  background-color: #fff;
`;
const InnerConatiner = styled.View`
  padding: 10px;
`;
const GallerySliderWrapper = styled.View`
  height: 300px;
  background: #f7f7f7;
  border-bottom-color: #000;
  border-bottom-width: 0.5px;
`;
const ProductPrice = styled.View``;
const ProductName = styled.View`
  padding: 10px 0;
`;
const CollapseWrapper = styled.View`
  flex: 1;
`;
const CollapseContainer = styled.View`
  background-color: #f7f7f7;
  padding: 10px 10px 20px 10px;
  border-radius: 15px;
`;
const CollapseTitle = styled.TouchableOpacity`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 10px 0;
  border-bottom-color: #000;
  border-bottom-width: 0.5px;
  margin-top: 5px;
  margin-bottom: 5px;
`;
const CollapseIcon = styled.Text`
  align-self: flex-end;
`;
const AddToCartWrapper = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #eee;
  padding-top: 5px;
`;

export default SingleProductScreen;
