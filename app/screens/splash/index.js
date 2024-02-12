import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import React, { useEffect } from 'react';
import splash from '../../assets/images/welcomescreen.png';
import logo from '../../assets/images/ravendel.png';
import { StackActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  //   useEffect(() => {
  //     const checkUserLoggedIn = async () => {
  //       try {
  //         setTimeout(() => {
  //           navigation.reset({
  //             index: 0,
  //             routes: [{ name: 'Home' }],
  //           });
  //         }, 2000);
  //       } catch (e) {
  //         // Error
  //       }
  //     };
  //     checkUserLoggedIn();
  //   }, []);

  return (
    <>
      <StatusBar hidden={false} backgroundColor={Colors.darkPrimaryColor} />
      <ImageBackground source={splash} style={styles.container}>
        {/* <Text
          style={{
            fontSize: 55,
            color: 'black',
            // fontFamily: FontStyle.fontBold,
          }}>
          Ravendal
        </Text> */}
        <Image source={logo} style={styles.imageStyle} />
      </ImageBackground>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageStyle: {
    width: '100%',
    width: 252,
    height: 42,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imageStyle2: {
    position: 'absolute',
    width: 200,
    height: 86,
    bottom: '20%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imageStyle3: {
    position: 'absolute',
    // width: 118,
    // height: 96,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  textStyle: {
    position: 'absolute',
    width: 118,
    height: 96,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  logo: {
    position: 'absolute',
    // width: 118,
    // height: 96,
    bottom: 0,
    resizeMode: 'contain',
  },
});
