import React, { useEffect, useState } from 'react';
import {
  productAction,
  productReviewsAction,
  productAddReviewAction,
  addCartAction,
  addToCartAction
} from '../../store/action';
import { PRODUCT_CLEAR } from '../../store/action/productAction';
import { useSelector, useDispatch } from 'react-redux';
import { AText, ARow, ACol, AppLoader, AButton } from '../../theme-components';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GalleryImagesSlider from './galleryImages';
import HTMLView from 'react-native-htmlview';
import { Modal } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';

var reviewObject = {
  title: '',
  email: '',
  review: '',
  rating: '0',
  status: 'pending',
  customer_id: '',
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
  const SingleProduct = useSelector(state => state.products.product);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { userDetails, isLoggin } = useSelector(state => state.customer);
  const ReviewProduct = useSelector(state => state.products.productReviews);
  const Loading = useSelector(state => state.products.loading);
  const [descriptionCollapse, setDescriptionCollapse] = useState(false);
  const [reviewcollapse, setReviewCollapse] = useState(false);
  const [writeReviewPop, setWriteReviewPop] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const cartItems = useSelector(state => state.cart.products);
  const [itemInCart, setItemInCart] = useState(false);
  const { cartId } = useSelector(state => state.cart);
  const [singleProductLoading, setSingleProductLoading] = useState(true);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setReview({
        ...review,
        customer_id: userDetails._id,
        product_id: ProductId,
        email: userDetails.email
      })
      setSingleProductLoading(true);
      dispatch(productAction(ProductId));
      dispatch(productReviewsAction(ProductId));
      setSingleProductLoading(false);
    });
  }, [navigation, ProductId]);

  useEffect(() => {
    setSingleProductLoading(true);
    var allimages = [];
    if (!isEmpty(SingleProduct) && !isEmpty(SingleProduct.feature_image)) {
      allimages.push(SingleProduct.feature_image);
    }
    if (!isEmpty(SingleProduct) && !isEmpty(SingleProduct.gallery_image)) {
      SingleProduct.gallery_image.map(img => {
        allimages.push(img);
      });
    }
    setSliderImages(allimages);
    setSingleProductLoading(false);
  }, [SingleProduct]);

  useEffect(() => {
    setSingleProductLoading(true);
    if (isFocused) {
      if (!isEmpty(cartItems) && cartItems.length > 0) {
        cartItems.map(item => {
          if (item.product_id === ProductId) {
            setItemInCart(true);
          }
        });
      }
    } else {
      dispatch({
        type: PRODUCT_CLEAR
      })
    }
    setSingleProductLoading(false);
  }, [isFocused]);

  const addReview = () => {
    dispatch(productAddReviewAction(review));
    setWriteReviewPop(!writeReviewPop);
  };

  const _storeData = async product => {
    if (isLoggin) {
      if (isEmpty(cartId)) {
        const cartData = {
          user_id: userDetails._id,
          products: [{
            product_id: SingleProduct._id,
            qty: 1,
            product_title: SingleProduct.name,
          }]
        }
        dispatch(addCartAction(cartData))
        navigation.navigate('Cart');
      } else {
        const cartData = {
          user_id: userDetails._id,
          product_id: SingleProduct._id,
          qty: 1,
          product_title: SingleProduct.name,
          product_price: parseFloat(SingleProduct.pricing.sellprice.toFixed(2)),
          product_image: SingleProduct.feature_image.medium,
        }
        dispatch(addToCartAction(cartData))
        navigation.navigate('Cart');
      }
    } else {

      try {
        await AsyncStorage.setItem('cartproducts', JSON.stringify(product));
        navigation.navigate('Cart');
      } catch (error) {
        console.log('Something went Wrong!!!!');
      }

    }
  };

  const addToCart = async () => {
    var hasCartProducts = []
    var products = []
    if (isLoggin) {
      hasCartProducts = cartItems;
    } else {
      hasCartProducts = await AsyncStorage.getItem('cartproducts');
      if (!isEmpty(hasCartProducts)) {
        products = JSON.parse(hasCartProducts);
      }

    }

    if (itemInCart) {
      return true;
    }
    if (hasCartProducts !== null) {
      setItemInCart(true);
      products.push({
        product_id: SingleProduct._id,
        qty: 1,
        product_title: SingleProduct.name
      });
      _storeData(products);
    } else {
      setItemInCart(true);
      _storeData([
        {
          product_id: SingleProduct._id,
          qty: 1,
          product_title: SingleProduct.name
        },
      ]);
    }
  };
  return (
    <>
      {singleProductLoading || Loading ? <AppLoader /> : null}

      {!isEmpty(SingleProduct) ? (
        <>
          <MainConatiner>
            {/* ===============Featured Images============= */}
            <GallerySliderWrapper>
              <GalleryImagesSlider images={sliderImages} />
            </GallerySliderWrapper>
            <InnerConatiner>
              {/* ===============Product Price============= */}
              <ProductPrice>
                <AText>
                  {SingleProduct.pricing.sellprice ? (
                    <AText large heavy color="#DB3022">
                      ${SingleProduct.pricing.sellprice.toFixed(2)}{'  '}
                    </AText>
                  ) : null}
                  {/* ===============Has Sale Price============= */}
                  <AText
                    lineThrough={SingleProduct.pricing.sellprice ? true : false}
                    large={SingleProduct.pricing.sellprice ? false : true}
                    heavy={SingleProduct.pricing.sellprice ? false : true}
                    color={
                      SingleProduct.pricing.sellprice ? '#7b7b7b' : '#000000'
                    }>
                    ${SingleProduct.pricing.price.toFixed(2)}
                  </AText>
                  {/* ===============Has Discount Price============= */}
                  {!isEmpty(SingleProduct.pricing.sellprice) && !isEmpty(SingleProduct.pricing.price) && (
                    <AText small heavy color="#DB3022">{'  '}
                      ({Math.round(
                        (100 / SingleProduct.pricing.price) *
                        (SingleProduct.pricing.price - SingleProduct.pricing.sellprice)
                      )}
                      % off)
                    </AText>
                  )
                  }
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
                      {!isEmpty(SingleProduct.custom_field) ? (
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
                  {isLoggin &&
                    <WriteReview onPress={() => setWriteReviewPop(true)}>
                      <AText color="#eb3349" right>
                        Write your Review
                      </AText>
                    </WriteReview>
                  }
                  <>
                    {ReviewProduct &&
                      ReviewProduct.filter(review => review.status === 'approved').length > 0
                      ?
                      (ReviewProduct.filter(review => review.status === 'approved').map((singleReview, index) => (
                        <ReviewWrapper>
                          <ReveiwHeading>
                            <Reviewrating backgroundColor={singleReview.rating < 2 ? 'red' : 'green'}>
                              <AText center color='#fff'>{singleReview.rating} ★</AText>
                            </Reviewrating>
                            <AText capitalize bold medium>{singleReview.title}</AText>
                          </ReveiwHeading>
                          <AText>{singleReview.review}</AText>
                        </ReviewWrapper>
                      ))
                      ) : (
                        <AText center>Reviews is not available</AText>
                      )}
                  </>
                </CollapseContainer>
              </CollapseWrapper>
            </InnerConatiner>
          </MainConatiner>


          {/* ===============Add To Cart============= */}
          <AddToCartWrapper>
            <AButton
              title={itemInCart ? 'Added' : 'Add to Cart'}
              block
              onPress={() => addToCart()}
            />
          </AddToCartWrapper>
        </>
      ) : !singleProductLoading || !Loading && (
        <NotFoundWrapper>
          <NotFoundImage
            source={require('../../assets/images/no-product-fonds.webp')}
          />
        </NotFoundWrapper>
      )}
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
              onChangeText={(text) => setReview({ ...review, title: text })}
              placeholder="Title"
            />
            <ATextarea
              multiline
              value={review.review}
              rows="4"
              onChangeText={(text) => setReview({ ...review, review: text })}
              placeholder="Review"
              textAlignVertical="top"
            />
            <ARow>
              <ACol col={2}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={parseInt(review.rating)}
                  selectedStar={rating =>
                    setReview({ ...review, rating: rating.toString() })
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
  flex:0.9;
`;
const InnerConatiner = styled.View`
  padding: 10px;
  flex:1;
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
const ReviewWrapper = styled.View`
  background: #fff;
  padding-horizontal: 5px;
  padding-vertical: 7px;
  margin:5px;
`;
const Reviewrating = styled.View`
  padding-horizontal: 5px;
  padding-vertical: 3px;
  border-radius: 7px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  margin-end:7px;
`;
const ReveiwHeading = styled.View`
justify-content: center;
align-items: center;
flex-direction:row;
align-self: flex-start;
`;
const NotFoundWrapper = styled.View`
  height: 200px;
  width: 100%;
  align-self:center;
  flex: 1;
`;

const NotFoundImage = styled.Image`
  flex: 1;
  resize-mode: contain;
  width: null;
  height: null;
`;


export default SingleProductScreen;
