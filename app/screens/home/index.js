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
import { getValue, isEmpty, unflatten } from '../../utils/helper';
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
  updateCartAction
} from '../../store/action';

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  // var allCategories = useSelector(state => state.products.allCategories);
  const allCategoriesWithChild = useSelector(
    state => state.products.categories.data,
  );
  const { cartId, cartChecked } = useSelector(state => state.cart);
  const cartItems = useSelector(state => state.cart.products);
  const userDetails = useSelector(state => state.customer.userDetails);
  const catLoading = useSelector(state => state.products.loading);
  const { themeSettings, homeData, featureData, recentAddedProduct, saleProduct, ProductByCategory } = useSelector(state => state.settings);
  const primaryColor = '#000';
  const settingLoading = useSelector(state => state.settings.loading);
  const [allCategories, setAllCategories] = useState([])

  useEffect(() => {
    dispatch(AppSettingAction());
    // dispatch(AllCategoriesAction(null));
    dispatch(categoriesAction());
  }, [isFocused]);

  useEffect(() => {
    if (!isEmpty(homeData)) {
      if (homeData.feature_product) {
        dispatch(featureDataAction())
      }
      if (homeData.recently_added_products) {
        dispatch(recentaddedproductAction())
      }
      // if (homeData.most_viewed_products) {
      //   console.log('most viewed product ')
      // }
      // if (homeData.recently_bought_products) {
      //   console.log('recently_bought_products ')
      // }
      // if (homeData.product_recommendation) {
      //   console.log('product_recommendation ')
      // }
      if (homeData.products_on_sales) {
        dispatch(productOnSaleAction())
      }
      if (homeData.product_from_specific_categories) {
        let catID = '62fe094eb2831ffd1e6fdfe8'
        dispatch(productByPerticulareAction(catID))

      }
    }

  }, [homeData])
  useEffect(() => {
    if (allCategoriesWithChild) {
      const data = unflatten(allCategoriesWithChild)
      setAllCategories(data)
    }
  }, [allCategoriesWithChild]);

  useEffect(() => {
    if (isFocused) {
      if (cartChecked) {
        if (!isEmpty(userDetails)) {
          UpdateCart();
        }
      }
    }
  }, [cartId])


  const UpdateCart = async () => {
    var cartProduct = await getValue('cartproducts');
    if (!isEmpty(cartProduct)) {
      var filteredProducts = []
      cartProduct = JSON.parse(cartProduct)
      var mergedArr = [...cartProduct, ...cartItems];
      var filteredProducts = []
      mergedArr.filter((val) => {
        let exist = mergedArr.find(n => (n.product_id === val.product_id) && (n.qty > val.qty))
        if (!filteredProducts.find(n => n.product_id === val.product_id)) {
          if (isEmpty(exist)) {
            filteredProducts.push({
              'product_id': val.product_id,
              'product_title': val.product_title,
              'qty': val.qty
            });
          } else {
            filteredProducts.push({
              'product_id': val.product_id,
              'product_title': val.product_title,
              'qty': exist.qty
            });
          }
        }
      })
      if (!isEmpty(filteredProducts)) {
        if (isEmpty(cartId)) {
          const cartData = {
            user_id: userDetails._id,
            products: filteredProducts,
          }
          dispatch(addCartAction(cartData))
        } else {
          const cartData = {
            id: cartId,
            products: filteredProducts,
          }
          dispatch(updateCartAction(cartData, userDetails._id))
        }
      }
    }
  }

  const navigateNextScreen = category => {
    var navigateTo = '';
    if ((category.children.length < 1)) {
      navigateTo = 'Category';
    } else {
      navigateTo = 'SubCategories';
    }

    var nestedCategory = []
    if (!isEmpty(category.children)) {
      nestedCategory = category.children
    }
    navigation.navigate('CateGories', {
      screen: navigateTo,
      initial: false,
      params: { singleCategory: category, withChildern: nestedCategory },
    });
  };
  const CategoryShowView = React.memo(() => {
    return (
      <ARow wrap row>
        {allCategories &&
          allCategories.map((category, index) => {
            return (
              <ACol col={3} key={category.id}>
                <CategoriesListingWrapper
                  onPress={() => navigateNextScreen(category)}>
                  <CategoriesImageWrapper>
                    {category.image ? (
                      <CategoriesImage
                        source={{
                          uri: URL + category.image.medium,
                        }}
                      />
                    ) : (
                      <CategoriesImage
                        source={{
                          uri:
                            'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                        }}
                      />
                    )}
                  </CategoriesImageWrapper>
                  <AText small uppercase color="#000" center>
                    {category.name}
                  </AText>
                </CategoriesListingWrapper>
              </ACol>
            );
          })}
      </ARow>
    )
  }, [])
  return (
    <>
      {settingLoading && catLoading ? <AppLoader /> : null}
      <AHeader title="Ravendel" />
      <AContainer>
        <ARow wrap row>
          <ACol col={1}>
            <PopularPicksWrapper
              onPress={() =>
                navigation.navigate('Cart', {
                  screen: 'PaymentMethod',
                  initial: false,
                  params: {
                    shippingValue: {},
                  },
                })
              }>
              <PopularPicksImage
                source={require('../../assets/images/fashion-sale.webp')}
              />
            </PopularPicksWrapper>
          </ACol>
        </ARow>

        <SectionView>
          <AText uppercase heavy mb={'20px'} center color={primaryColor}>
            Shop by Category
          </AText>
          <CategoryShowView />
        </SectionView>

        <ARow wrap row>
          <ACol col={1}>
            <PopularPicksWrapper>
              <PopularPicksImage
                source={require('../../assets/images/new-collection.webp')}
              />
            </PopularPicksWrapper>
          </ACol>
        </ARow>

        <SectionView>
          <AText uppercase heavy mb={'20px'} center color={primaryColor}>
            FEATURED COLLECTIONS
          </AText>
          <ARow wrap row>
            <ACol col={2}>
              <FeaturedImage
                source={require('../../assets/images/women-glass.webp')}
              />
            </ACol>
            <ACol col={2}>
              <FeaturedImage
                source={require('../../assets/images/men-glases.webp')}
              />
            </ACol>
          </ARow>
        </SectionView>

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
          <AText uppercase heavy mb={'20px'} center color={primaryColor}>
            OFFERS
          </AText>
          <ARow wrap row>
            <ACol col={2}>
              <CategoryListingWrapper>
                <CategoryListing
                  source={require('../../assets/images/category_womens_optical.webp')}
                />
              </CategoryListingWrapper>
            </ACol>
            <ACol col={2}>
              <CategoryListingWrapper>
                <CategoryListing
                  source={require('../../assets/images/womens_sunglass.webp')}
                />
              </CategoryListingWrapper>
            </ACol>
          </ARow>
        </SectionView>
      </AContainer>
    </>
  );
};

const CategoriesListingWrapper = styled.TouchableOpacity`
  margin: 10px 0 20px 0;
  height: 140px;
`;

const CategoriesImageWrapper = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  overflow: hidden;
  margin: 5px auto;
`;

const CategoriesImage = styled.Image`
  width: null;
  height: null;
  resize-mode: cover;
  flex: 1;
`;

const FeaturedImage = styled.Image`
  width: 100%;
  height: 175px;
`;

const LogoWrapper = styled.View`
  width: 175px;
  height: 50px;
`;

const Logo = styled.Image`
  width: null;
  height: null;
  resize-mode: contain;
  flex: 1;
`;

const SectionView = styled.View`
  padding: 20px 0;
  border-bottom-width: 2px;
  border-color: #ddd;
`;

const CategoryListingWrapper = styled.View`
  height: 100px;
`;

const CategoryListing = styled.Image`
  width: null;
  height: null;
  resize-mode: contain;
  flex: 1;
`;

const PopularPicksWrapper = styled.TouchableOpacity`
  height: 300px;
`;

const PopularPicksImage = styled.Image`
  width: null;
  height: null;
  resize-mode: contain;
  flex: 1;
`;

export default HomeScreen;
