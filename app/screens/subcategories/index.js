import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import {
  AText,
  AContainer,
  AHeader,
  ARow,
  ACol,
  AppLoader,
  TextInput,
  AButton,
} from '../../theme-components';
import { useDispatch, useSelector } from 'react-redux';
import URL from '../../utils/baseurl';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../utils/helper';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  windowWidth,
} from '../../utils/config';
import { catProductAction } from '../../store/action';
import { ProductPriceText } from '../components';
import Feather from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating';
import LinearGradient from 'react-native-linear-gradient';
import { CAT_PRODUCTS_CLEAR } from '../../store/action/productAction';

const SubCategoriesScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [selectedCat, setSelectedCat] = useState('All');
  const singleCat = route.params.singleCategory;
  const singleCatChildern = route.params.withChildern;
  const loading = useSelector((state) => state.products.loading);
  const singleCateogry = useSelector(
    (state) => state.products.singleCategoryDetails,
  );
  const [categorydata, setCategorydata] = useState(null);
  const [collapseCategory, setCollapseCategory] = useState({});
  const [optionSelect, setOptionSelect] = useState(['All']);
  const [withChild, setWithChild] = useState([]);
  const [inpvalue, setInpvalue] = useState('');
  // console.log(JSON.stringify(singleCateogry));
  //Custom Functions
  const handleinpiut = (e) => {
    setInpvalue(e);
  };

  // Custom Call
  const handleselectedCat = (id) => {
    if (id == selectedCat) {
      setSelectedCat(null);
    } else {
      setSelectedCat(id);
    }
  };
  useEffect(() => {
    let array;
    if (
      isEmpty(inpvalue) &&
      selectedCat === 'All' &&
      !isEmpty(singleCateogry)
    ) {
      setCategorydata(singleCateogry.data.products);
      return array;
    } else if (selectedCat !== 'All' && !isEmpty(inpvalue)) {
      let reg = new RegExp(inpvalue.toLowerCase());
      array = singleCateogry.data.products.filter((item) => {
        let name = item.name;
        if (
          !isEmpty(name) &&
          name.toLowerCase().match(reg) &&
          selectedCat === item.url
        ) {
          return item;
        }
      });
    } else if (!isEmpty(inpvalue) && selectedCat === 'All') {
      let reg = new RegExp(inpvalue.toLowerCase());
      array = singleCateogry.data.products.filter((item) => {
        let name = item.name;
        if (!isEmpty(name) && name.toLowerCase().match(reg)) {
          return item;
        }
      });
    }
    setCategorydata(array);
  }, [inpvalue, selectedCat]);
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

  const handlefilter = (type) => {
    if (!optionSelect.includes(type)) {
      setOptionSelect((old) => [...old, type]);
    } else {
      setOptionSelect((old) => old.filter((val) => val !== type));
    }
  };

  useEffect(() => {
    if (!isEmpty(singleCateogry)) {
      setCategorydata(singleCateogry.data.products);
    }
  }, [singleCateogry]);

  useEffect(() => {
    if (isFocused) {
      dispatch(catProductAction(singleCat.url));
    } else {
      dispatch({
        type: CAT_PRODUCTS_CLEAR,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    console.log(selectedCat);
    if (selectedCat !== 'All') {
      dispatch(catProductAction(selectedCat));
    } else {
      dispatch(catProductAction(singleCat.url));
    }
  }, [selectedCat]);

  const HeaderContent = () => (
    <ARow
      ml="30px"
      mr="30px"
      mt={'50px'}
      row
      justifyContent="space-between"
      alignItems="center"
      position="relative">
      <View style={{ width: '65%', justifyContent: 'center' }}>
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
          inputBgColor={'#e4ffff'}
          fs={12}
          placeholder={'Search'}
          placeholdercolor={'black'}
          br={30}
        />
      </View>
      <View style={styles.filterstyle}>
        <AIcon
          onPress={() => handlesearch()}
          name={'filter'}
          size={20}
          color={'black'}
        />
        <AText color="black" ml="10px">
          Filter
        </AText>
      </View>
    </ARow>
  );

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CateGories', {
            screen: 'SingleProduct',
            initial: false,
            params: { productID: item._id },
          });
        }}
        style={styles.cardstyle}>
        <Icon
          onPress={() => alert('Save it Wishlist')}
          name="heart-o"
          color={'red'}
          size={15}
          style={styles.heart}
        />
        <ImageBackground
          source={{
            uri: !isEmpty(item.feature_image)
              ? URL + item.feature_image
              : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
            priority: FastImage.priority.normal,
          }}
          style={styles.centeredItemImage}
          imageStyle={{ borderRadius: 10, resizeMode: 'contain' }}>
          <View style={styles.blurWrap}>
            <ImageBackground
              source={{
                uri: !isEmpty(item.feature_image)
                  ? URL + item.feature_image
                  : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                priority: FastImage.priority.normal,
              }}
              blurRadius={Platform.OS === 'ios' ? 20 : 20}
              style={styles.blurImageStyle}
              imageStyle={{
                borderRadius: 10,
                resizeMode: 'cover',
              }}></ImageBackground>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              // navigatetonext(item);
            }}
            style={styles.overlay}></TouchableOpacity>
          <View style={styles.textContainer}>
            <AText mb="5px" small fonts={FontStyle.fontBold}>
              {item.name.length > 14
                ? item.name.substring(0, 14) + '...'
                : item.name}
            </AText>
            <AText small fonts={FontStyle.fontBold} style={styles.text}>
              $ {item.pricing.sellprice + '.00'}
            </AText>
          </View>
          <View style={styles.textContainer2}>
            <TouchableOpacity style={styles.iconcontainer}>
              <Icon name="shopping-cart" color={'black'} size={14} />
            </TouchableOpacity>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={item.rating}
              fullStarColor={'#FFDB20'}
              emptyStarColor={'gray'}
              starSize={10}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
  if (isEmpty(singleCateogry) || isEmpty(singleCateogry.data)) {
    return <AppLoader />;
  }

  return (
    <>
      <LinearGradient
        colors={[APP_SECONDARY_COLOR, 'white']}
        style={{ flex: 1 }}>
        <View style={styles.header}>
          <AIcon
            onPress={() => navigation.navigate('Home')}
            name="arrowleft"
            size={22}
          />
          <AText fonts={FontStyle.semiBold} ml="20px">
            Shop
          </AText>
        </View>
        <HeaderContent />
        <View style={{ paddingHorizontal: 30 }}>
          <ScrollView
            contentContainerStyle={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'space-between',
              justifyContent: 'space-between',
            }}
            scrollEnabled={true}
            keyboardShouldPersistTaps="always"
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <AButton
              semi
              mr="8px"
              title={'All'}
              onPress={() => handleselectedCat('All')}
              bgColor={'All' == selectedCat ? APP_PRIMARY_COLOR : 'transparent'}
              color={'All' == selectedCat ? 'white' : 'black'}
              round
              minor={windowWidth < 330 ? true : false}
              small={windowWidth < 400 && windowWidth > 330 ? true : false}
              extramedium={windowWidth > 400 ? true : false}
              xtrasmall
              borderColor={'transparent'}
            />
            {withChild.map((item) => (
              <>
                <AButton
                  semi
                  mr="8px"
                  key={item.id}
                  title={item.name}
                  onPress={() => handleselectedCat(item.url)}
                  bgColor={
                    item.url == selectedCat ? APP_PRIMARY_COLOR : 'transparent'
                  }
                  color={item.url == selectedCat ? 'white' : 'black'}
                  round
                  minor={windowWidth < 330 ? true : false}
                  small={windowWidth < 400 && windowWidth > 330 ? true : false}
                  extramedium={windowWidth > 400 ? true : false}
                  xtrasmall
                  borderColor={'transparent'}
                />
              </>
            ))}
          </ScrollView>
        </View>
        <FlatList
          numColumns={2}
          data={categorydata}
          snapToAlignment="center"
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{
            marginTop: 10,
            flexDirection: 'column',
            margin: 'auto',
            marginHorizontal: 30,
          }}
          ListEmptyComponent={() => (
            <View>
              <AText
                style={{ fontSize: 16, alignSelf: 'center', color: 'grey' }}>
                No Records Found
              </AText>
            </View>
          )}
        />
        {/* {withChild.length ? menuListing(withChild) : null} */}
      </LinearGradient>
    </>
  );
};
const styles = StyleSheet.create({
  fastImageStyle: { flex: 1, resizeMode: 'cover' },
  heart: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 10,
    fontWeight: '900',
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: 10,
    paddingHorizontal: 30,
    zIndex: 10,
  },
  cardstyle: {
    width: '48%',
    height: 236,
    marginBottom: 30,
    borderRadius: 10,
    elevation: 5,
  },
  iconstyle: {
    marginRight: 5,
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
  filterstyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e4ffff',
    borderRadius: 30,
    height: 30,
    width: '30%',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  centeredItemImage: {
    width: '100%',
    height: '100%',
    // resizeMode: 'contain',
    borderRadius: 10,
    // marginHorizontal: windowWidth * 0.05,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  textContainer2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    textAlign: 'right',
    marginHorizontal: 10,
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  iconcontainer: {
    marginBottom: 5,
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurImageStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
  },
  blurWrap: {
    height: '25%', //Here we need to specify the height of blurred part
    overflow: 'hidden',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
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
