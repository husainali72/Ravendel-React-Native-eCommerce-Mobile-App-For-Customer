import React, { useState } from 'react';
import { useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import { AText } from '../../../theme-components';
import { FontStyle } from '../../../utils/config';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import URL from '../../../utils/baseurl';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../../utils/helper';
import { ProductPriceText } from '../../components';

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth * 0.4; // visible item width
const itemHeight = itemWidth * 1.5; // visible item height
const centeredItemWidth = windowWidth * 0.5; // centered item width
const centeredItemHeight = centeredItemWidth * 1.4; // centered item height

function ImageSlider({ dataItems, navigatetonext }) {
  const [selectedId, setSelectedId] = useState('1');
  const flatListRef = useRef(null);
  function renderItem({ item, index }) {
    let itemStyle = styles.itemImage;
    if (item._id === selectedId) {
      itemStyle = styles.centeredItemImage;
    } else if (
      (index === 0 && selectedId !== dataItems[1]._id) ||
      (index === dataItems.length - 1 &&
        selectedId !== dataItems[dataItems.length - 2]._id)
    ) {
      itemStyle = styles.sideItemImage;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedId(item._id);
          flatListRef.current.scrollToIndex({ index });
        }}>
        <ImageBackground
          source={{
            uri: !isEmpty(item.feature_image)
              ? URL + item.feature_image
              : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
            priority: FastImage.priority.normal,
          }}
          style={[itemStyle]}
          imageStyle={{ borderRadius: 10 }}
          // blurRadius={10}
        >
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
              navigatetonext(item);
            }}
            style={styles.overlay}></TouchableOpacity>
          <View style={styles.textContainer}>
            <AText mb="5px" medium fonts={FontStyle.fontBold}>
              {item.name.length > 14
                ? item.name.substring(0, 14) + '...'
                : item.name}
            </AText>
            <AText medium fonts={FontStyle.fontBold}>
              $ {item.pricing.sellprice + '.00'}
            </AText>
            {/* <ProductPriceText fontsizesmall={true} Pricing={item.pricing} /> */}
          </View>
          <View style={styles.textContainer2}>
            <TouchableOpacity style={styles.iconcontainer}>
              <Icon name="shopping-cart" color={'black'} size={14} />
            </TouchableOpacity>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={3.5}
              fullStarColor={'#FFDB20'}
              emptyStarColor={'gray'}
              starSize={15}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  function getItemLayout(data, index) {
    return {
      length: itemWidth,
      offset: itemWidth * index,
      index,
    };
  }

  return (
    <View style={styles.container}>
      <AText ml="30px" mb={'10px'} large fonts={FontStyle.fontBold}>
        New Arrivals
      </AText>
      <FlatList
        ref={flatListRef}
        data={dataItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        snapToAlignment="center"
        getItemLayout={getItemLayout}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / itemWidth,
          );
          dataItems[index] && dataItems[index]._id
            ? setSelectedId(dataItems[index]._id)
            : null;
        }}
      />
    </View>
  );
}

export default ImageSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  itemImage: {
    width: itemWidth,
    height: itemHeight,
    resizeMode: 'contain',
    borderRadius: 10,
    marginHorizontal: (windowWidth * 0.1) / 2,
  },
  sideItemImage: {
    width: itemWidth * 0.8,
    height: itemHeight * 0.8,
    resizeMode: 'contain',
    borderRadius: 10,
    opacity: 0.5,
    marginHorizontal: (windowWidth * 0.1) / 2,
  },
  centeredItemImage: {
    width: centeredItemWidth,
    height: centeredItemHeight,
    resizeMode: 'contain',
    borderRadius: 10,
    marginHorizontal: windowWidth * 0.05,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  // text: {
  //   fontSize: 16,
  //   fontFamily: 'SegoeUI',
  //   fontWeight: 600,
  //   color: 'black',
  //   fontWeight: 'bold',
  //   // textAlign: 'center',
  //   textShadowColor: 'rgba(0, 0, 0, 0.5)', // translucent black
  //   textShadowOffset: { width: 2, height: 2 },
  //   // textShadowRadius: 4,
  //   marginBottom: 5,
  // },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  textContainer2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    textAlign: 'right',
    marginHorizontal: 5,
    // justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  iconcontainer: {
    marginBottom: 10,
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
