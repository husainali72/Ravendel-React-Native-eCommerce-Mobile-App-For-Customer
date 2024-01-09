import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import URL from '../../utils/baseurl';
// import ImageView from 'react-native-image-view';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';

const { width } = Dimensions.get('window');
const height = 297;

const GalleryImagesSlider = (props) => {
  const [SliderImages, setSliderImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [preview, setPreview] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    setSliderImages(props.images);
  }, [props.images]);

  useEffect(() => {
    var previewImageArr = [];
    if (SliderImages) {
      SliderImages.map((img) => {
        previewImageArr.push({
          uri: URL + img,
        });
      });
    }
    setPreviewImages(previewImageArr);
  }, [SliderImages]);

  const changeSlide = ({ nativeEvent }) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  const previewImage = () => {
    setPreview(!preview);
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          pagingEnabled
          horizontal
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
          onScroll={changeSlide}>
          {SliderImages ? (
            SliderImages.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => previewImage()}>
                <FastImage
                  style={styles.slideImage}
                  source={{
                    uri: URL + image,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text>Nothing</Text>
          )}
        </ScrollView>
        {/* <View style={styles.dots}>
          {SliderImages.map((image, index) => (
            <Text
              key={index}
              style={index === active ? styles.activeDot : styles.dot}>
              ⬤
            </Text>
          ))}
        </View> */}
      </View>
      <ImageView
        images={previewImages}
        imageIndex={active}
        visible={preview}
        onRequestClose={() => setPreview(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { width, height: '100%' },
  scroll: { width, height: '100%' },
  slideImage: { width, height: '100%' },
  // dots: {
  //   flexDirection: 'row',
  //   position: 'absolute',
  //   bottom: 0,
  //   alignSelf: 'center',
  // },
  dot: { color: '#888', margin: 3, fontSize: 10 },
  activeDot: { color: '#EB3349', margin: 3, fontSize: 10 },
});

export default GalleryImagesSlider;
