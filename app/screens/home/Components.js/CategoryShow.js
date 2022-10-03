import React, { useEffect } from 'react';
import {
    AText,
    ARow,
    ACol,
} from '../../../theme-components';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import URL from '../../../utils/baseurl';
import { isEmpty, unflatten } from '../../../utils/helper';
import { useState } from 'react';

const HomeCategoryShowViews = ({ allCategories, navigateNextScreen, navigation }) => {

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
                                        <CategoriesImage
                                            source={{
                                                uri: !isEmpty(category.image) ? URL + category.image.medium : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
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
        )
    }, [])
    return (
        <>
            <CategoryShowView />
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

export default HomeCategoryShowViews;
