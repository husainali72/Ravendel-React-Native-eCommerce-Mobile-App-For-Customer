import {Animated, Platform} from 'react-native';

const HEADER_MAX_HEIGHT = 170;
const HEADER_MIN_HEIGHT = 100;
var StartPoint = 0;

const scrollY = new Animated.Value(
  Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : StartPoint,
);

export {scrollY, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT};
