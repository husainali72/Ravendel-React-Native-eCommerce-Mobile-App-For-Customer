import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { AText } from '../../../theme-components';
import { FontStyle, GREYTEXT } from '../../../utils/config';
import URL from '../../../utils/baseurl';
import { isEmpty } from '../../../utils/helper';
const categories = [
  {
    name: 'Category 1',
    image: require('../../../assets/images/question.png'),
  },
  {
    name: 'Category 2',
    image: require('../../../assets/images/paypal.png'),
  },
  {
    name: 'Category 3',
    image: require('../../../assets/images/section2.jpg'),
  },
  {
    name: 'Category 3',
    image: require('../../../assets/images/section2.jpg'),
  },
  {
    name: 'Category 3',
    image: require('../../../assets/images/section2.jpg'),
  },
  {
    name: 'Category 3',
    image: require('../../../assets/images/section2.jpg'),
  },
  {
    name: 'Category 3',
    image: require('../../../assets/images/section2.jpg'),
  },
  // add more categories here
];
function CategoryItem({ category, navigateNextScreen }) {
  return (
    <TouchableOpacity
      onPress={() => navigateNextScreen(category)}
      activeOpacity={0.5}
      style={styles.categoryItem}>
      {console.log(URL + category.image, 'imm')}
      <Image
        source={{
          uri: !isEmpty(category.image)
            ? URL + category.image
            : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
        }}
        style={{ width: 50, height: 50, borderRadius: 30 }}
      />
      <AText color={GREYTEXT} fonts={FontStyle.fontBold}>
        {category.name}
      </AText>
    </TouchableOpacity>
  );
}
function CategoryList({ allCategories, navigateNextScreen }) {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      {allCategories.map((category, index) => (
        <CategoryItem
          navigateNextScreen={navigateNextScreen}
          key={index}
          category={category}
        />
      ))}
    </ScrollView>
  );
}
function Categories({ allCategories, navigateNextScreen }) {
  return (
    <View style={{ marginHorizontal: 30 }}>
      <AText mb={'10px'} large fonts={FontStyle.fontBold}>
        Categories
      </AText>
      <CategoryList
        navigateNextScreen={navigateNextScreen}
        allCategories={allCategories}
      />
    </View>
  );
}
export default Categories;
const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  categoryName: {
    marginTop: 5,
    textAlign: 'center',
  },
});
