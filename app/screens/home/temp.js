import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, PanResponder } from 'react-native';

const SlideUpModal = ({ children }) => {
  const num = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  const [isVisible, setIsVisible] = useState(false);
  const panY = useRef(new Animated.Value(400)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panY.setOffset(panY._value);
        panY.setValue(0);
      },
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        panY.flattenOffset();
        if (gestureState.dy > 100) {
          Animated.timing(panY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start(() => setIsVisible(false));
        } else {
          Animated.spring(panY, {
            toValue: 400,
            friction: 6,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const renderModal = () => (
    <Animated.View
      style={[
        styles.modal,
        {
          transform: [{ translateY: panY }],
        },
      ]}
      {...panResponder.panHandlers}>
      {num.map((item) => (
        <Text>This is Text</Text>
      ))}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.showButton} onPress={() => setIsVisible(true)}>
        Show Modal
      </Text>
      {isVisible && renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showButton: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: '100%',
    padding: 20,
  },
});

export default SlideUpModal;
