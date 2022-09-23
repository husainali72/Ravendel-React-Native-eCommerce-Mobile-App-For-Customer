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
import * as Animatable from 'react-native-animatable';
import { useSelector, useDispatch } from 'react-redux';
import { AppSettingAction } from '../../store/action/settingAction';
import {
  AllCategoriesAction,
  categoriesAction,
} from '../../store/action/productAction';
import URL from '../../utils/baseurl';

const HomeScreen = ({ navigation }) => {
  const categoriesDispatch = useDispatch();
  const allCategories = useSelector(state => state.products.allCategories);
  const allCategoriesWithChild = useSelector(
    state => state.products.categories,
  );
  const catLoading = useSelector(state => state.products.loading);
  const settingsDispatch = useDispatch();
  const themeSetting = useSelector(state => state.settings.themeSettings);
  const primaryColor = '#000';
  const settingLoading = useSelector(state => state.settings.loading);
  const categories = useDispatch();

  useEffect(() => {
    categories(categoriesAction());
  }, [categories]);

  useEffect(() => {
    settingsDispatch(AppSettingAction());
    categoriesDispatch(AllCategoriesAction(null));
  }, [categoriesDispatch, settingsDispatch]);

  const navigateNextScreen = category => {
    var navigateTo = '';
    if (category.child_cat.length < 1) {
      navigateTo = 'Category';
    } else {
      navigateTo = 'SubCategories';
    }
    var nestedCategory = allCategoriesWithChild.filter(
      cat => cat.parentId === category.id,
    );
    navigation.navigate('Categories', {
      screen: navigateTo,
      initial: false,
      params: { singleCategory: category, withChildern: nestedCategory },
    });
  };

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

          <ARow wrap row>
            {allCategories &&
              allCategories.map(category => {
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
