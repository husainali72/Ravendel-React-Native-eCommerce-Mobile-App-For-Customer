import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import {
  AText,
  AContainer,
  AHeader,
  ARow,
  ACol,
  AppLoader,
} from '../../theme-components';
import { useSelector } from 'react-redux';
import URL from '../../utils/baseurl';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CommonActions } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../utils/helper';
import { StyleSheet } from 'react-native';

const SubCategoriesScreen = ({ navigation, route }) => {
  const singleCat = route.params.singleCategory;
  const singleCatChildern = route.params.withChildern;
  const loading = useSelector((state) => state.products.loading);
  const [collapseCategory, setCollapseCategory] = useState({});
  const [withChild, setWithChild] = useState([]);

  useEffect(() => {
    if (singleCatChildern && singleCatChildern.length > 0) {
      setWithChild(singleCatChildern);
    }
  }, [singleCatChildern]);

  const collapseToggle = (category) => {
    category.open = !category.open;
    setCollapseCategory({ ...collapseCategory, [category.id]: category.open });
  };
  const navigateCategoryScreen = (category) => {
    navigation.navigate('Category', {
      singleCategory: category,
    });
  };

  const menuListing = (categories) => {
    return categories.map((cat) => {
      if (!cat.children.length) {
        return (
          <ARow row wrap alignItems="center" padding={0} key={cat.id}>
            <ACol col={1}>
              <CategoryContainer>
                <CategoriesList onPress={() => navigateCategoryScreen(cat)}>
                  <ARow row wrap alignItems="center">
                    <ListItem>
                      <CategoryImageWrapper>
                        <FastImage
                          style={styles.fastImageStyle}
                          source={{
                            uri:
                              !isEmpty(cat.image) && !isEmpty(cat.image)
                                ? URL + cat.image
                                : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </CategoryImageWrapper>
                      <AText ml="10px">{cat.name}</AText>
                    </ListItem>
                  </ARow>
                </CategoriesList>
              </CategoryContainer>
            </ACol>
          </ARow>
        );
      }

      return (
        <ARow row wrap alignItems="center" key={cat.id}>
          <ACol col={1} margin="0%">
            <CategoriesList onPress={() => collapseToggle(cat)}>
              <ARow row wrap alignItems="center">
                <ACol col={1}>
                  <ListItem>
                    <CategoryImageWrapper>
                      <FastImage
                        style={styles.fastImageStyle}
                        source={{
                          uri: !isEmpty(cat.image)
                            ? URL + cat.image
                            : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </CategoryImageWrapper>
                    <CategoryName>
                      <AText ml="10px">{cat.name}</AText>
                      <CollapseIcon>
                        {collapseCategory[cat.id] ? (
                          <Icon name="chevron-up" color="#000" />
                        ) : (
                          <Icon name="chevron-down" color="#000" />
                        )}
                      </CollapseIcon>
                    </CategoryName>
                  </ListItem>
                </ACol>
              </ARow>
            </CategoriesList>
          </ACol>
          <ACol col={1} margin="0%">
            <CollapseContainer
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                display: collapseCategory[cat.id] ? 'flex' : 'none',
              }}>
              <SubCategoryContainer>
                {menuListing(cat.children)}
                <CategoriesList onPress={() => navigateCategoryScreen(cat)}>
                  <ARow row wrap alignItems="center">
                    <ACol col={1}>
                      <ListItem>
                        <AText ml="50px" mb="20px">
                          Shop All
                        </AText>
                      </ListItem>
                    </ACol>
                  </ARow>
                </CategoriesList>
              </SubCategoryContainer>
            </CollapseContainer>
          </ACol>
        </ARow>
      );
    });
  };
  return (
    <>
      {loading ? <AppLoader /> : null}
      <AHeader title={singleCat.name} navigation={navigation} back />
      <AContainer>
        {withChild.length ? menuListing(withChild) : null}
      </AContainer>
    </>
  );
};
const styles = StyleSheet.create({
  fastImageStyle: { flex: 1, resizeMode: 'cover' },
});

const CollapseContainer = styled.View`
  background: #f7f7f7;
  border-radius: 10px;
`;

const CategoriesList = styled.TouchableOpacity``;

const ListItem = styled.View`
  flex: 1;
  flex-wrap: wrap;
  margin: 5px 2px 5px 5px;
  flex-direction: row;
  align-items: center;
`;

const SubCategoryContainer = styled.View``;

const CategoryContainer = styled.View`
  flex: 1;
`;

const CategoryImageWrapper = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 50px;
  overflow: hidden;
`;

const CategoryImage = styled.Image`
  width: null;
  height: null;
  flex: 1;
  resize-mode: cover;
`;
const CollapseIcon = styled.Text`
  align-self: flex-end;
`;

const CategoryName = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export default SubCategoriesScreen;
