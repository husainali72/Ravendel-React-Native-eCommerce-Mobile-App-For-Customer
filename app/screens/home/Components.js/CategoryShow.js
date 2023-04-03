import React from 'react';
import { AText, ARow, ACol } from '../../../theme-components';
import styled from 'styled-components/native';
import URL from '../../../utils/baseurl';
import { isEmpty } from '../../../utils/helper';

const HomeCategoryShowViews = ({
  allCategories,
  navigateNextScreen,
  navigation,
}) => {
  const CategoryShowView = React.memo(() => {
    return (
      <ARow wrap row padding={0}>
        {allCategories &&
          allCategories.map((category, index) => {
            return (
              <ACol col={3} key={category.id}>
                <CategoriesListingWrapper
                  onPress={() => navigateNextScreen(category)}>
                  <CategoriesImageWrapper>
                    <CategoriesImage
                      source={{
                        uri: !isEmpty(category.image)
                          ? URL + category.image
                          : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                      }}
                    />
                  </CategoriesImageWrapper>
                  <AText small uppercase color="#000" center>
                    {category.name}
                  </AText>
                </CategoriesListingWrapper>
              </ACol>
            );
          })}
      </ARow>
    );
  }, []);
  return (
    <>
      <CategoryShowView />
    </>
  );
};

const CategoriesListingWrapper = styled.TouchableOpacity`
  margin: 5px 0 0px 0;
`;

const CategoriesImageWrapper = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  overflow: hidden;
  margin: 2px auto;
`;

const CategoriesImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
  flex: 1;
`;

export default HomeCategoryShowViews;
