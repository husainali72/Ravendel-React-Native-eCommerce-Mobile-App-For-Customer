import React, { useEffect } from 'react';
import {
  AText,
  AContainer,
  ARow,
  ACol,
  AHeader,
  AppLoader,
  TextInput,
} from '../../theme-components';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import URL from '../../utils/baseurl';
import {
  downloadImageFromS3,
  getToken,
  getValue,
  isEmpty,
  unflatten,
} from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import {
  AppSettingAction,
  featureDataAction,
  productByPerticulareAction,
  productOnSaleAction,
  recentaddedproductAction,
  categoriesAction,
  addCartAction,
  updateCartAction,
} from '../../store/action';
import HomeCategoryShowViews from './Components.js/CategoryShow';
import HomeComponentShowViews from './Components.js/HomeComponentShowViews';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { brandAction } from '../../store/action/settingAction';
import HomeBrandViews from './Components.js/BrandShow';
import { APP_PRIMARY_COLOR, APP_SECONDARY_COLOR } from '../../utils/config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Categories from './Components.js/CategoriesList';
import ImageSlider from './Components.js/CustomSlider';
import CardContainer from './Components.js/RandomCard';
import { ALREADY_HAS_LOGIN } from '../../store/action/loginAction';
import { USER_ALREADY_HAS_LOGIN } from '../../store/action/customerAction';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import Styles from '../../Theme';

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  // var allCategories = useSelector(state => state.products.allCategories);
  function handlePress() {
    navigation.openDrawer();
  }
  const allCategoriesWithChild = useSelector(
    (state) => state.products.categories.data,
  );
  const { cartId, cartChecked } = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.products);
  const userDetails = useSelector((state) => state.customer.userDetails);
  const catLoading = useSelector((state) => state.products.loading);
  const loginState = useSelector((state) => state.login);
  const {
    currencyOptions,
    homeslider,
    homeData,
    featureData,
    recentAddedProduct,
    saleProduct,
    ProductByCategory,
    brands,
    appTitle,
  } = useSelector((state) => state.settings);
  // console.log('prod', recentAddedProduct, 'hooo');
  const primaryColor = '#000';
  const settingLoading = useSelector((state) => state.settings.loading);

  const [allCategories, setAllCategories] = useState([]);
  const [inpvalue, setInpvalue] = useState('');
  const checkUserLoggedIn = async () => {
    try {
      const token = await getToken();
      const userdata = await getValue('userDetails');
      // console.log(token, userdata, 'ttk');
      // const role = await AsyncStorage.getItem('role');

      if (token !== null) {
        // console.log('yes logged in on master screen');
        var loginDetails = {
          user_token: token,
        };
        var userloginDetails = {
          userDetails: JSON.parse(userdata),
        };
        dispatch({ type: ALREADY_HAS_LOGIN, payload: loginDetails });
        dispatch({ type: USER_ALREADY_HAS_LOGIN, payload: userloginDetails });
      }
    } catch (e) {
      // Error
    }
  };

  //Custom Functions
  const handleinpiut = (e) => {
    setInpvalue(e);
  };

  useEffect(() => {
    dispatch(AppSettingAction());
    // dispatch(AllCategoriesAction(null));
    dispatch(categoriesAction());
  }, [isFocused]);

  useEffect(() => {
    dispatch(brandAction());
    // console.log(homeData, 'homedaata');
    if (!isEmpty(homeData)) {
      const featuredProduct = homeData.filter(
        (section) => section.label === 'Featured Product',
      )[0];
      const recentProduct = homeData.filter(
        (section) => section.label === 'Recently Added Products',
      )[0];
      const productOnsale = homeData.filter(
        (section) => section.label === 'Products On Sales',
      )[0];
      const productRec = homeData.filter(
        (section) => section.label === 'Product Recommendation',
      )[0];
      const productFromSpecific = homeData.filter(
        (section) => section.label === 'Product from Specific Categories',
      )[0];
      // console.log('fproduc', featuredProduct);
      if (featuredProduct.visible) {
        dispatch(featureDataAction());
      }
      // if (featuredProduct.visible) {
      // }
      if (recentProduct.visible) {
        dispatch(recentaddedproductAction());
      }
      // if (homeData.most_viewed_products) {
      // }
      // if (homeData.recently_bought_products) {
      // }
      if (productRec.visible) {
        // dispatch(productOnSaleAction());
      }
      if (productOnsale.visible) {
        dispatch(productOnSaleAction());
      }
      if (productFromSpecific.visible) {
        let catID = '62fe094eb2831ffd1e6fdfe8';
        dispatch(productByPerticulareAction(catID));
      }
    }
  }, [homeData]);
  useEffect(() => {
    if (allCategoriesWithChild) {
      const data = unflatten(allCategoriesWithChild);
      setAllCategories(data);
    }
  }, [allCategoriesWithChild]);

  useEffect(() => {
    if (!loginState.login) {
      checkUserLoggedIn();
    }
  }, [loginState]);

  // useEffect(() => {
  //   if (isFocused) {
  //     if (cartChecked) {
  //       if (!isEmpty(userDetails)) {
  //         UpdateCart();
  //       }
  //     }
  //   }
  // }, [cartId,cartChecked])

  const UpdateCart = async () => {
    var cartProduct = await getValue('cartproducts');
    if (!isEmpty(cartProduct)) {
      var filteredProducts = [];
      cartProduct = JSON.parse(cartProduct);
      var mergedArr = [...cartProduct, ...cartItems];
      var filteredProducts = [];
      mergedArr.filter((val) => {
        let exist = mergedArr.find(
          (n) => n.product_id === val.product_id && n.qty > val.qty,
        );
        if (!filteredProducts.find((n) => n.product_id === val.product_id)) {
          if (isEmpty(exist)) {
            filteredProducts.push({
              product_id: val.product_id,
              product_title: val.product_title,
              qty: val.qty,
            });
          } else {
            filteredProducts.push({
              product_id: val.product_id,
              product_title: val.product_title,
              qty: exist.qty,
            });
          }
        }
      });
      if (!isEmpty(filteredProducts)) {
        if (isEmpty(cartId)) {
          const cartData = {
            user_id: userDetails._id,
            products: filteredProducts,
          };
          dispatch(addCartAction(cartData));
        } else {
          const cartData = {
            id: cartId,
            products: filteredProducts,
          };
          dispatch(updateCartAction(cartData, userDetails._id));
        }
      }
    }
  };

  const navigateNextScreen = (category) => {
    var navigateTo = '';
    // if (category.children.length < 1) {
    //   navigateTo = 'Category';
    // } else {
    navigateTo = 'SubcategoriesOption';
    // }

    var nestedCategory = [];
    if (!isEmpty(category.children)) {
      nestedCategory = category.children;
    }
    // console.log(JSON.stringify(category), 'this category going in subcategory');
    navigation.navigate('CateGories', {
      screen: navigateTo,
      initial: false,
      params: { singleCategory: category, withChildern: nestedCategory },
    });
  };
  console.log(settingLoading, ' ---- ', catLoading);
  return (
    <View style={Styles.mainContainer}>
      {settingLoading && catLoading ? <AppLoader /> : null}
      <StatusBar backgroundColor={APP_PRIMARY_COLOR} />
      <Header showProfileIcon navigation={navigation} title={''} />
      <View style={styles.searchstyle}>
        {/* <TouchableOpacity style={{ marginTop: 10 }} onPress={handlePress}>
          <View style={{ ...styles.barstyle, width: 35 }}></View>
          <View style={{ ...styles.barstyle, width: 25 }}></View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('AccountWrapper', { screen: 'Accounts' })
          }
          style={{ ...styles.profileimgstyle, elevation: 5 }}>
          <Image
            style={styles.profileimgstyle}
            source={require('../../assets/images/man.png')}
          />
        </TouchableOpacity> */}
        <ARow mt={'10px'} row alignItems="center" position="relative">
          <Icon
            style={styles.iconstyle}
            name={'search'}
            size={15}
            color={'black'}
          />
          <TextInput
            height={30}
            bc={'#E0E0E0'}
            value={inpvalue}
            onchange={handleinpiut}
            padding={0}
            pl={35}
            inputBgColor={Colors.whiteColor}
            fs={12}
            placeholder={'Search'}
            placeholdercolor={'black'}
            br={30}
          />
        </ARow>
      </View>
      <View style={{ padding: 10, backgroundColor: Colors.whiteColor }}></View>
      <AContainer withoutPadding nestedScrollEnabled={true}>
        <Categories
          navigation
          navigateNextScreen={(item) => {
            navigateNextScreen(item);
          }}
          allCategories={allCategories}
        />
        <ARow mb="20px" wrap row>
          <ACol col={1}>
            <PopularPicksWrapper>
              <PopularPicksImage
                source={require('../../assets/images/section.jpg')}
              />
            </PopularPicksWrapper>
          </ACol>
        </ARow>
        {!isEmpty(recentAddedProduct) && (
          <ImageSlider
            dataItems={recentAddedProduct}
            navigatetonext={(item) => {
              navigation.navigate('CateGories', {
                screen: 'SingleProduct',
                initial: false,
                params: { productID: item._id, productUrl: item.url },
              });
            }}
          />
        )}
        <ARow wrap row></ARow>

        <ARow mb="20px" wrap row>
          <ACol col={1}>
            <PopularPicksWrapper>
              <PopularPicksImage
                source={require('../../assets/images/section.jpg')}
              />
            </PopularPicksWrapper>
          </ACol>
        </ARow>
        {!isEmpty(brands) && (
          <SectionView>
            <AText uppercase heavy mb={'20px'} center color={primaryColor}>
              Fatured Brands
            </AText>
            <HomeBrandViews
              allbrands={brands}
              navigation
              navigateNextScreen={(item) => {
                navigateNextScreen(item);
              }}
            />
          </SectionView>
        )}
        {!isEmpty(featureData) && (
          <>
            <SectionView>
              <AText uppercase heavy center color={primaryColor}>
                FEATURED COLLECTIONS
              </AText>
              <HomeComponentShowViews
                dataItems={featureData}
                navigatetonext={(item) => {
                  navigation.navigate('CateGories', {
                    screen: 'SingleProduct',
                    initial: false,
                    params: { productID: item._id },
                  });
                }}
              />
            </SectionView>
          </>
        )}

        {!isEmpty(recentAddedProduct) && (
          <>
            <SectionView>
              <AText uppercase heavy center color={primaryColor}>
                Latest collection
              </AText>
              <HomeComponentShowViews
                dataItems={recentAddedProduct}
                navigatetonext={(item) => {
                  navigation.navigate('CateGories', {
                    screen: 'SingleProduct',
                    initial: false,
                    params: { productID: item._id },
                  });
                }}
              />
            </SectionView>
          </>
        )}

        <SectionView>
          <AText uppercase heavy center color={primaryColor}>
            POPULAR PICKS
          </AText>
          <ARow>
            <ACol col={1}>
              <PopularPicksWrapper>
                <PopularPicksImage
                  source={require('../../assets/images/summer_sale_60.webp')}
                />
              </PopularPicksWrapper>
            </ACol>
          </ARow>
        </SectionView>

        {!isEmpty(saleProduct) && (
          <>
            <SectionView>
              <CardContainer
                dataItems={saleProduct}
                navigatetonext={(item) => {
                  navigation.navigate('CateGories', {
                    screen: 'SingleProduct',
                    initial: false,
                    params: { productID: item._id },
                  });
                }}
              />

              {/* <HomeComponentShowViews
                dataItems={saleProduct}
                navigatetonext={(item) => {
                  navigation.navigate('CateGories', {
                    screen: 'SingleProduct',
                    initial: false,
                    params: { productID: item._id },
                  });
                }}
              /> */}
            </SectionView>
          </>
        )}

        {!isEmpty(ProductByCategory) && (
          <>
            <SectionView>
              <ARow>
                <ACol col={1}>
                  <PopularPicksWrapper>
                    <PopularPicksImage
                      source={require('../../assets/images/section2.jpg')}
                    />
                  </PopularPicksWrapper>
                </ACol>
              </ARow>
            </SectionView>

            <SectionView>
              {/* <AText uppercase heavy mb={'10px'} center color={primaryColor}></AText> */}
              <HomeComponentShowViews
                dataItems={ProductByCategory}
                navigatetonext={(item) => {
                  navigation.navigate('CateGories', {
                    screen: 'SingleProduct',
                    initial: false,
                    params: { productID: item._id },
                  });
                }}
              />
            </SectionView>
          </>
        )}
      </AContainer>
    </View>
  );
};

const FeaturedImage = styled.Image`
  width: 100%;
  height: 175px;
`;

const SectionView = styled.View`
  padding: 10px 0;
  border-bottom-width: 2px;
  border-color: #ddd;
`;
const PopularPicksWrapper = styled.TouchableOpacity`
  height: 168px;
  width: 100%;
  margin-top: 30px;
`;

const PopularPicksImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: stretch;
`;
const HeaderLogo = styled.Image`
  resize-mode: contain;
  width: 90%;
  height: 60%;
`;
const HeaderLogoWrapper = styled.View`
  width: 100%;
  height: 80px;
  justify-content: center;
  align-items: center;
  align-self: center;
  background: #fff;
`;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  child: { width, justifyContent: 'center' },
  image: { width: Dimensions.width, height: 300, resizeMode: 'contain' },
  text: { fontSize: width * 0.5, textAlign: 'center' },
  searchstyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: Colors.whiteColor,
    height: 90,
    marginTop: 30,
    paddingHorizontal: 30,
    paddingTop: 20,
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  barstyle: {
    height: 4,
    backgroundColor: 'black',
    marginBottom: 5,
    borderRadius: 5,
  },
  iconstyle: {
    marginRight: 5,
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
  profileimgstyle: { height: 30, width: 35, borderRadius: 35 },
});
export default HomeScreen;
