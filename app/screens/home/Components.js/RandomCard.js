import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AText } from '../../../theme-components';
import { FontStyle } from '../../../utils/config';
import LinearGradient from 'react-native-linear-gradient';
import { isEmpty } from '../../../utils/helper';
import URL from '../../../utils/baseurl';
import FastImage from 'react-native-fast-image';
import { ProductPriceText } from '../../components';

const { width } = Dimensions.get('window');

const getRandomHeight = () => Math.floor(Math.random() * (200 - 100) + 100);
function generateRandomNumbers() {
  let num1 = Math.floor(Math.random() * 35) + 30;
  let num2 = 98 - num1;
  return [num1, num2];
}
const Card = ({ data, width, height, navigatetonext }) => (
  <LinearGradient
    colors={['#088178', '#0cc9bb']}
    style={[styles.card, { width: `${width}%`, height: height }]}>
    <TouchableOpacity
      onPress={() => {
        navigatetonext(data);
      }}>
      <FastImage
        source={{
          uri: !isEmpty(data.feature_image)
            ? URL + data.feature_image
            : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
        style={styles.image}
      />
      {/* <ProductPriceText fontsizesmall={'18'} Pricing={data.pricing} /> */}

      <AText fonts={FontStyle.semiBold} color={'red'} large center>
        {'  '}(
        {Math.round(
          (100 / data.pricing.price) *
            (data.pricing.price - data.pricing.sellprice),
        )}
        % off)
      </AText>
    </TouchableOpacity>
  </LinearGradient>
);
let width1 = 0;
let height = 0;
const CardContainer = ({ dataItems, navigatetonext }) => (
  <View style={styles.container}>
    <AText mb={'10px'} large fonts={FontStyle.fontBold}>
      Products on Sale
    </AText>
    {dataItems.map((item, index) => {
      if (index % 2 === 0) {
        width1 = generateRandomNumbers();
        height = getRandomHeight();
        return (
          <View style={styles.row} key={item._id}>
            <Card
              navigatetonext={navigatetonext}
              data={item}
              width={width1[0]}
              height={height}
            />
            {dataItems[index + 1] && (
              <Card
                navigatetonext={navigatetonext}
                onPress={() => {
                  navigatetonext(item);
                }}
                data={dataItems[index + 1]}
                width={width1[1]}
                height={height}
              />
            )}
          </View>
        );
      }
      return null;
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    padding: 10,
    // overflow: 'hidden',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
  },
});
export default CardContainer;
