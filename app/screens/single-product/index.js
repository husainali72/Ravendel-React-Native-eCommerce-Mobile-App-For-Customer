import React, { useEffect, useState } from 'react';
import {
  productAction,
  productReviewsAction,
  productAddReviewAction,
  addCartAction,
  addToCartAction,
  checkStorageAction,
} from '../../store/action';
import { PRODUCT_CLEAR } from '../../store/action/productAction';
import { useSelector, useDispatch } from 'react-redux';
import {
  AText,
  ARow,
  ACol,
  AppLoader,
  AButton,
  AHeader,
} from '../../theme-components';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/AntDesign';
import GalleryImagesSlider from './galleryImages';
import HTMLView from 'react-native-htmlview';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import { ProductPriceText } from '../components';
import { DataTable } from 'react-native-paper';
import { View } from 'react-native-animatable';
import moment from 'moment';
import { reviewValidationSchema } from '../checkout/validationSchema';
import { Formik } from 'formik';
import { FontStyle } from '../../utils/config';
import Colors from '../../constants/Colors';

var reviewObject = {
  title: '',
  email: '',
  review: '',
  rating: '0',
  status: 'pending',
  customer_id: '',
  product_id: '',
};

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

const SingleProductScreen = ({ navigation, route }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: '#000',
    });
  }, [navigation]);

  const ProductId = route.params.productID;
  const ProductUrl = route.params.productUrl;
  const [review, setReview] = useState(reviewObject);
  const SingleProduct = useSelector((state) => state.products.product);
  const { user_token } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { userDetails, isLoggin } = useSelector((state) => state.customer);
  const ReviewProduct = useSelector((state) => state.products.productReviews);
  const { manage_stock } = useSelector((state) => state.settings);
  const Loading = useSelector((state) => state.products.loading);
  const [descriptionCollapse, setDescriptionCollapse] = useState(false);
  const [reviewcollapse, setReviewCollapse] = useState(false);
  const [writeReviewPop, setWriteReviewPop] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const cartItems = useSelector((state) => state.cart.products);
  const [itemInCart, setItemInCart] = useState(false);
  const { cartId } = useSelector((state) => state.cart);
  const [singleProductLoading, setSingleProductLoading] = useState(true);
  // const [scrollViewHeight, setScrollViewHeight] = useState('45%');
  const [scrollY] = useState(new Animated.Value(0));

  const [cartQuantity, setCartQuantity] = useState(1);
  useEffect(() => {
    navigation.addListener('focus', () => {
      setReview({
        ...review,
        customer_id: userDetails._id,
        product_id: ProductId,
        email: userDetails.email,
      });
      setSingleProductLoading(true);
      console.log(ProductUrl, 'pro id');
      dispatch(productAction(ProductUrl));
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
      SingleProduct.gallery_image.map((img) => {
        allimages.push(img);
      });
    }
    setSliderImages(allimages);
    setSingleProductLoading(false);
  }, [SingleProduct]);

  useEffect(() => {
    setSingleProductLoading(true);
    if (isFocused) {
      if (!isEmpty(userDetails)) {
        dispatch(checkStorageAction(userDetails._id));
      } else {
        dispatch(checkStorageAction());
      }
      setTimeout(() => {
        if (!isEmpty(cartItems) && cartItems.length > 0) {
          cartItems.map((item) => {
            if (item.product_id === ProductId) {
              setItemInCart(true);
            }
          });
        }
      }, 500);
    } else {
      dispatch({
        type: PRODUCT_CLEAR,
      });
      setItemInCart(false);
    }
    setSingleProductLoading(false);
  }, [isFocused]);

  const addReview = (val) => {
    const reviews = {
      title: val.title,
      email: val.email,
      review: val.review,
      rating: val.rating,
      status: val.status,
      customer_id: val.customer_id,
      product_id: val.product_id,
    };
    dispatch(productAddReviewAction(reviews));
    setWriteReviewPop(!writeReviewPop);
  };

  const _storeData = async (product) => {
    if (isLoggin) {
      if (isEmpty(cartId)) {
        const cartData = {
          user_id: userDetails._id,
          products: [
            {
              product_id: SingleProduct._id,
              qty: cartQuantity,
              product_title: SingleProduct.name,
              product_price: parseFloat(
                SingleProduct.pricing.sellprice.toFixed(2),
              ),
              product_image: SingleProduct.feature_image,
              tax_class: SingleProduct.tax_class,
              shipping_class: SingleProduct.shipping.shipping_class,
            },
          ],
        };
        console.log(cartId);
        return;
        dispatch(addCartAction(cartData));
      } else {
        const cartData = {
          user_id: userDetails._id,
          product_id: SingleProduct._id,
          qty: cartQuantity,
          product_title: SingleProduct.name,
          product_price: parseFloat(SingleProduct.pricing.sellprice.toFixed(2)),
          product_image: SingleProduct.feature_image,
          tax_class: SingleProduct.tax_class,
          shipping_class: SingleProduct.shipping.shipping_class,
        };
        dispatch(addToCartAction(cartData));
      }
    } else {
      try {
        await AsyncStorage.setItem('cartproducts', JSON.stringify(product));
      } catch (error) {
        console.log('Something went Wrong!!!!');
      }
    }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Cart' }],
    // });
  };

  const addToCart = async () => {
    var hasCartProducts = [];
    var products = [];
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
        qty: cartQuantity,
        product_title: SingleProduct.name,
      });

      _storeData(products);
    } else {
      setItemInCart(true);
      _storeData([
        {
          product_id: SingleProduct._id,
          qty: cartQuantity,
          product_title: SingleProduct.name,
        },
      ]);
    }
  };

  // const handleScroll = (event) => {
  //   const offsetY = event.nativeEvent.contentOffset.y;
  //   console.log(offsetY, 'oooo');
  //   // Adjust the height based on the scroll offset
  //   const newHeight = offsetY > 0 ? '85%' : '45%';
  //   console.log(newHeight, 'pppplll');
  //   setScrollViewHeight(newHeight);
  // };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }, // Set to true if using reanimated
  );

  const scrollViewHeight = scrollY.interpolate({
    inputRange: [0, windowHeight * 0.5],
    outputRange: [windowHeight * 0.5, windowHeight],
    extrapolate: 'clamp',
  });
  console.log(scrollViewHeight, 'ssc');
  return (
    <>
      {singleProductLoading || Loading ? <AppLoader /> : null}

      {!isEmpty(SingleProduct) ? (
        <>
          <View style={{ flex: 1, overflow: 'visible' }}>
            <View style={styles.header}>
              <AIcon
                onPress={() => navigation.goBack()}
                name="arrowleft"
                size={25}
              />
              {/* <Icon name="heart-o" color={'red'} size={20} /> */}
            </View>
            {/* ===============Featured Images============= */}
            <GallerySliderWrapper>
              <GalleryImagesSlider images={sliderImages} />
            </GallerySliderWrapper>
            <Animated.ScrollView
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                {
                  useNativeDriver: false,
                },
              )}
              scrollEventThrottle={16}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 30,
              }}
              style={{ ...styles.infostyle, height: scrollViewHeight }}>
              {/* ===============Product Price============= */}
              <ProductPriceText Pricing={SingleProduct.pricing} />

              {/* ===============Product Name============= */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <ProductName>
                  <AText big color={'black'} fonts={FontStyle.semiBold}>
                    {SingleProduct.name}
                  </AText>
                  <View style={styles.starstyle}>
                    <StarRating
                      starStyle={{
                        marginRight: 10,
                      }}
                      disabled={true}
                      maxStars={5}
                      rating={SingleProduct.rating}
                      fullStarColor={'#FFDB20'}
                      emptyStarColor={'gray'}
                      starSize={14}
                    />
                    <AText
                      color={'black'}
                      fonts={
                        FontStyle.semiBold
                      }>{`(${SingleProduct.rating} rating)`}</AText>
                  </View>
                  <AText
                    mt="5px"
                    big
                    fonts={FontStyle.semiBold}
                    color={'black'}>
                    $ {SingleProduct.pricing.price + '.00'}
                  </AText>
                </ProductName>
                <View style={{ width: '45%' }}>
                  <AText
                    right
                    small
                    color={SingleProduct.quantity > 0 ? '#1FAD08' : 'red'}
                    fonts={FontStyle.fontBold}>
                    {SingleProduct.quantity > 0
                      ? 'Available in stock'
                      : 'Out of stock'}
                  </AText>
                  {((!isEmpty(SingleProduct.quantity) &&
                    SingleProduct.quantity > 0) ||
                    !manage_stock) && (
                    <>
                      {/* <AText fonts={FontStyle.semiBold} large>
                        Quantity
                      </AText> */}
                      <QtyWrapper>
                        <QtyButton
                          onPress={() => {
                            cartQuantity > 1 &&
                              setCartQuantity(cartQuantity - 1);
                          }}>
                          <AText color="#72787e">
                            <AIcon size={16} name="minussquare" />
                          </AText>
                        </QtyButton>
                        <AText medium bold ml="7px" mr="7px">
                          {cartQuantity}
                        </AText>
                        <QtyButton
                          onPress={() => {
                            ((!isEmpty(SingleProduct.quantity) &&
                              cartQuantity < SingleProduct.quantity) ||
                              !manage_stock) &&
                              setCartQuantity(cartQuantity + 1);
                          }}>
                          <AText color="#72787e">
                            <AIcon size={16} name="plussquare" />
                          </AText>
                        </QtyButton>
                      </QtyWrapper>
                    </>
                  )}
                </View>
              </View>

              {/* ================ Product short description================== */}
              {!isEmpty(SingleProduct.short_description) && (
                <>
                  <AText fonts={FontStyle.semiBold} mb="5px" large>
                    About
                  </AText>
                  <HTMLView value={SingleProduct.short_description} />
                  <HTMLView value={SingleProduct.description} />
                </>
              )}
              <AText mt={'5px'} mb={'20px'} bold>
                SKU:{SingleProduct.sku}
              </AText>
              {/* ==================Product Quantity============================ */}

              {/* ========================Custom Field================================ */}
              {!isEmpty(SingleProduct.custom_field) &&
                SingleProduct.custom_field.length > 0 && (
                  <CollapseWrapper>
                    <CollapseTitle>
                      <AText bold>Product specifications</AText>
                    </CollapseTitle>
                    <ACol col={2}>
                      {SingleProduct.custom_field.map((item, index) => {
                        return (
                          <CustomWrapper>
                            <ACol>
                              <AText>{item.key}</AText>
                            </ACol>
                            <ACol>
                              <AText>{item.value}</AText>
                            </ACol>
                          </CustomWrapper>
                        );
                      })}
                    </ACol>
                  </CollapseWrapper>
                )}

              {/* ===============Product Reviews============= */}
              <CollapseWrapper>
                <CollapseTitle
                  onPress={() => setReviewCollapse(!reviewcollapse)}>
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
                  {true && (
                    <>
                      <View
                        style={{
                          width: '40%',
                          alignSelf: 'flex-end',
                          marginBottom: 10,
                        }}>
                        <AButton
                          title={'Add a review'}
                          round
                          onPress={() =>
                            isLoggin
                              ? setWriteReviewPop(true)
                              : navigation.navigate('AccountWrapper', {
                                  screen: 'LoginSignUp',
                                  initial: false,
                                })
                          }
                          small
                          semi
                        />
                      </View>
                    </>
                  )}
                  <>
                    {ReviewProduct &&
                    ReviewProduct.filter(
                      (review) => review.status === 'approved',
                    ).length > 0 ? (
                      ReviewProduct.filter(
                        (review) => review.status === 'approved',
                      ).map((singleReview, index) => (
                        <ReviewWrapper>
                          <CollapseTitle>
                            <ReveiwHeading>
                              <Reviewrating
                                backgroundColor={
                                  singleReview.rating < 2 ? 'red' : 'green'
                                }>
                                <AText center color="#fff">
                                  {singleReview.rating}★
                                </AText>
                              </Reviewrating>
                              <AText bold center>
                                {singleReview.customerId.firstName}
                              </AText>
                            </ReveiwHeading>
                            <AText small>
                              {moment(singleReview.date).format('LL')}
                            </AText>
                          </CollapseTitle>
                          <AText capitalize bold medium>
                            {singleReview.title}
                          </AText>
                          <AText>{singleReview.review}</AText>
                        </ReviewWrapper>
                      ))
                    ) : (
                      <>
                        <AText
                          bbc={Colors.blackColor}
                          bbw={'0.5px'}
                          pb="8px"
                          small
                          center>
                          There are no reviews yet. Be the first one to write
                          one.
                        </AText>
                      </>
                    )}
                  </>
                </CollapseContainer>
              </CollapseWrapper>
              <AddToCartWrapper>
                {(!isEmpty(SingleProduct.quantity) &&
                  SingleProduct.quantity > 0) ||
                !manage_stock ? (
                  <AButton
                    title={itemInCart ? 'Added' : 'Add to Cart'}
                    round
                    onPress={() => addToCart()}
                  />
                ) : (
                  <AButton
                    title={'Out of Stock'}
                    block
                    round
                    // onPress={() => addToCart()}
                  />
                )}
              </AddToCartWrapper>
            </Animated.ScrollView>
          </View>

          {/* ===============Add To Cart============= */}
        </>
      ) : (
        !singleProductLoading ||
        (!Loading && (
          <NotFoundWrapper>
            <NotFoundImage
              source={require('../../assets/images/no-product-fonds.webp')}
            />
          </NotFoundWrapper>
        ))
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
            <ModalClose
              style={{ zIndex: 20 }}
              onPress={() => setWriteReviewPop(false)}>
              <Icon name="close" size={15} color="#000" />
            </ModalClose>
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={review}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                addReview(values);
                setSubmitting(false);
                resetForm({});
              }}
              validationSchema={reviewValidationSchema}>
              {({
                values,
                handleChange,
                errors,
                setFieldValue,
                touched,
                handleSubmit,
              }) => (
                <>
                  <AInputFeild
                    type="text"
                    value={values.title}
                    onChangeText={handleChange('title')}
                    placeholder="Title"
                  />
                  {touched.title && errors.title && (
                    <AText color="red" xtrasmall>
                      {errors.title}
                    </AText>
                  )}
                  <ATextarea
                    value={values.review}
                    numberOfLines={5}
                    multiline={true}
                    onChangeText={handleChange('review')}
                    placeholder="Review"
                    textAlignVertical="top"
                  />
                  {touched.review && errors.review && (
                    <AText color="red" xtrasmall>
                      {errors.review}
                    </AText>
                  )}
                  <ARow>
                    <ACol col={2}>
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={parseInt(values.rating)}
                        selectedStar={(rating) =>
                          setFieldValue('rating', rating.toString())
                        }
                        fullStarColor={'#ffb400'}
                        starSize={25}
                      />
                      {touched.rating && errors.rating && (
                        <AText color="red" xtrasmall>
                          {errors.rating}
                        </AText>
                      )}
                    </ACol>
                  </ARow>
                  <AButton
                    onPress={handleSubmit}
                    round
                    block
                    title="Add Review"
                  />
                </>
              )}
            </Formik>
          </ModalBody>
        </ModalConatiner>
      </Modal>
    </>
  );
};

//  ===============For Style=============

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
  background: #fff;
  height: 100%;
  width: 28px;
  justify-content: center;
  align-items: center;
  padding: 0px;
`;
const CustomWrapper = styled.View`
  margin: 5px 0 0px 0;
  flex-direction: row;
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
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  box-shadow: 15px 5px 15px #000;
  elevation: 15;
  z-index: 1;
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
  background-color: pink;
  flex: 1;
`;
const InnerConatiner = styled.ScrollView`
  z-index: 10;
  bottom: 0;
  position: absolute;
  border-top-left-radius: 30;
  border-top-right-radius: 30;
  background-color: white;
  padding-bottom: 30px;
  padding-horizontal: 30px;
  padding-top: 20px;
  width: 100%;
  flex: 1;
`;
const GallerySliderWrapper = styled.View`
  height: 60%;
  background: white;
`;
const ProductPrice = styled.View``;
const ProductName = styled.View`
  padding: 10px 0;
  width: 55%;
`;
const CollapseWrapper = styled.View`
  flex: 1;
`;
const CollapseContainer = styled.View`
  background-color: ${Colors.whiteColor};
  padding: 10px 10px 20px 10px;
  border-radius: 15px;
`;
const CollapseTitle = styled.TouchableOpacity`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 5px 0;
  border-bottom-color: #000;
  border-bottom-width: 0.5px;
  margin: 5px 0px;
`;
const CollapseIcon = styled.Text`
  align-self: flex-end;
`;
const AddToCartWrapper = styled.View`
  background: transparent;
  padding-top: 5px;
  width: 70%;
  align-self: center;
`;
const ReviewWrapper = styled.View`
  background: #fff;
  padding-horizontal: 5px;
  padding-vertical: 7px;
  margin: 5px 0px;
`;
const Reviewrating = styled.View`
  padding-horizontal: 5px;
  padding-vertical: 3px;
  border-radius: 7px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  margin-end: 7px;
`;
const ReveiwHeading = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  align-self: flex-start;
`;
const NotFoundWrapper = styled.View`
  height: 200px;
  width: 100%;
  align-self: center;
  flex: 1;
`;

const NotFoundImage = styled.Image`
  flex: 1;
  resize-mode: contain;
  width: null;
  height: null;
`;
const styles = StyleSheet.create({
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
  infostyle: {
    zIndex: 10,
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    paddingBottom: 30,
    paddingHorizontal: 30,
    paddingTop: 20,
    width: '100%',
    flex: 1,
    elevation: 6,
  },
  starstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
export default SingleProductScreen;
