import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import {
  AText,
  AContainer,
  AHeader,
  ARow,
  ACol,
  AppLoader,
} from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import { categoriesAction } from '../../store/action/productAction';
import URL from '../../utils/baseurl';
import { unflatten } from '../../utils/helper';

const CategoriesScreen = ({ navigation }) => {
  const loading = useSelector(state => state.products.loading);
  const categories = useDispatch();
  const allCategoriesWithChild = useSelector(
    state => state.products.categories,
  );

  useEffect(() => {
    categories(categoriesAction());
  }, [categories]);

  const navigateNextScreen = category => {
    var navigateTo = '';
    if (category.children.length < 1) {
      navigateTo = 'Category';
    } else {
      navigateTo = 'SubCategories';
    }
    var nestedCategory = allCategoriesWithChild.filter(
      cat => cat.parentId === category.id,
    );
    navigation.navigate(navigateTo, {
      singleCategory: category,
      withChildern: nestedCategory,
    });
  };

  const menuListing = Categories => {
    return Categories.map(category => {
      if (category.parentId === null) {
        return (
          <ACol col={2} key={category.id}>
            <CategoriesListingWrapper
              onPress={() => navigateNextScreen(category)}>
              <ARow height="100%" padding={0}>
                <ACol col={1}>
                  <CategoryImageWrapper>
                    {category.image ? (
                      <CategoryImage
                        source={{
                          uri: URL + category.image.medium,
                        }}
                      />
                    ) : (
                      <CategoryImage
                        source={{
                          uri:
                            'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                        }}
                      />
                    )}
                  </CategoryImageWrapper>
                </ACol>
                <ACol col={1}>
                  <AText small uppercase color="#000" center>
                    {category.name}
                  </AText>
                </ACol>
              </ARow>
            </CategoriesListingWrapper>
          </ACol>
        );
      }
    });
  };

  return (
    <>
      {loading ? <AppLoader /> : null}
      <AHeader title="Categories" />
      <AContainer>
        {allCategoriesWithChild.length ? (
          <ARow row wrap>
            {menuListing(unflatten(allCategoriesWithChild))}
          </ARow>
        ) : null}
      </AContainer>
    </>
  );
};

const CategoriesListingWrapper = styled.TouchableOpacity`
  margin: 10px 0 20px 0;
  height: 140px;
  border-radius: 15px;
  background-color: #f7f7f7;
  elevation: 1;
`;

const CategoryImageWrapper = styled.View`
  width: 150px;
  height: 100px;
  margin: -20px auto 10px auto;
  border-radius: 15px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: {width: 0, height: 2};
  shadow-opacity: 0.8;
  shadow-radius: 2px;
  elevation: 10;
 `;

const CategoryImage = styled.Image`
  width: null;
  height: null;
  flex: 1;
  resize-mode: cover;
`;

export default CategoriesScreen;
