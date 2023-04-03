import React, { useEffect } from 'react';
import {
  AText,
  AContainer,
  ARow,
  ACol,
  AHeader,
  AppLoader,
} from '../../theme-components';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import URL from '../../utils/baseurl';
import {
  downloadImageFromS3,
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
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  // var allCategories = useSelector(state => state.products.allCategories);
  const allCategoriesWithChild = useSelector(
    (state) => state.products.categories.data,
  );
  const { cartId, cartChecked } = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.products);
  const userDetails = useSelector((state) => state.customer.userDetails);
  const catLoading = useSelector((state) => state.products.loading);
  const {
    currencyOptions,
    homeslider,
    homeData,
    featureData,
    recentAddedProduct,
    saleProduct,
    ProductByCategory,
    appTitle,
  } = useSelector((state) => state.settings);
  const primaryColor = '#000';
  const settingLoading = useSelector((state) => state.settings.loading);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    dispatch(AppSettingAction());
    // dispatch(AllCategoriesAction(null));
    dispatch(categoriesAction());
  }, [isFocused]);
  // console.log('hdata', homeData);
  useEffect(() => {
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
    if (category.children.length < 1) {
      navigateTo = 'Category';
    } else {
      navigateTo = 'SubCategories';
    }

    var nestedCategory = [];
    if (!isEmpty(category.children)) {
      nestedCategory = category.children;
    }
    navigation.navigate('CateGories', {
      screen: navigateTo,
      initial: false,
      params: { singleCategory: category, withChildern: nestedCategory },
    });
  };
  return (
    <>
      {settingLoading && catLoading ? <AppLoader /> : null}
      {/* {!isEmpty(appTitle)
        ? */}
      {/* <AHeader title={isEmpty(appTitle) ? 'Ravendel' : appTitle} /> */}
      {/* :

        <HeaderLogoWrapper>
          <HeaderLogo
            source={{uri:themeSettings.logo}}>
          </HeaderLogo>
        </HeaderLogoWrapper>
      } */}
      <AContainer withoutPadding nestedScrollEnabled={true}>
        <ARow wrap row>
          {!isEmpty(homeslider) ? (
            <SwiperFlatList
              autoplay
              autoplayDelay={2}
              autoplayLoop
              // index={2}
              showPagination
              paginationDefaultColor="maroon"
              paginationActiveColor="cyan"
              paginationStyle={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
              }}
              data={homeslider}
              renderItem={({ item }) => (
                <View style={[styles.child]}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: URL + item.image,
                    }}
                  />
                </View>
              )}
            />
          ) : null}
        </ARow>
        {!isEmpty(allCategories) && (
          <SectionView>
            <AText uppercase heavy mb={'20px'} center color={primaryColor}>
              Shop by Category
            </AText>
            <HomeCategoryShowViews
              allCategories={allCategories}
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

        <ARow wrap row>
          <ACol col={1}>
            <PopularPicksWrapper>
              <PopularPicksImage
                source={require('../../assets/images/section.jpg')}
              />
            </PopularPicksWrapper>
          </ACol>
        </ARow>
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
          <ARow wrap row>
            <ACol col={1}>
              <PopularPicksWrapper>
                <PopularPicksImage
                  source={require('../../assets/images/popular_picks.webp')}
                />
              </PopularPicksWrapper>
            </ACol>
          </ARow>
        </SectionView>

        {!isEmpty(saleProduct) && (
          <>
            <SectionView>
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

            <SectionView>
              <AText uppercase heavy center color={primaryColor}>
                OFFERS
              </AText>
              <HomeComponentShowViews
                dataItems={saleProduct}
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
    </>
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
  height: 300px;
  width: 100%;
`;

const PopularPicksImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
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
});
export default HomeScreen;
