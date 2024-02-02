import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';
import BottomTabNavigator from './';
import { APP_PRIMARY_COLOR, FontStyle } from '../utils/config';
import {
  AccountScreen,
  CartScreen,
  CategoriesScreen,
  CategoryScreen,
  ChangePasswordScreen,
  CheckoutScreen,
  EditProfileScreen,
  ForgotPasswordScreen,
  HomeScreen,
  LoginScreen,
  OrderDetailScreen,
  OrderScreen,
  PaymentMethodScreen,
  ProfileScreen,
  RecentlyViewScreen,
  SaveCardScreen,
  SavedAddressScreen,
  ShippingScreen,
  SignupScreen,
  SingleProductScreen,
  SubCategoriesScreen,
  UserEntry,
  Splash,
  Shop,
} from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import { AText } from '../theme-components';
import ShippingMethodScreen from '../screens/checkout/ShippingMethodScreen';
import Colors from '../constants/Colors';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Account Stack
const AccountStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Account"
      detachPreviousScreen={true}
      detachInactiveScreens={true}
      screenOptions={{
        title: '',
        headerShown: false,
      }}>
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SavedAddress" component={SavedAddressScreen} />
      <Stack.Screen name="Orders" component={OrderScreen} />
      <Stack.Screen name="RecentlyViewed" component={RecentlyViewScreen} />
      <Stack.Screen name="SaveCards" component={SaveCardScreen} />
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
      <Stack.Screen name="LoginSignUp" component={UserEntry} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

// Cart and checkoutscreen
const CartStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Cart"
      screenOptions={{
        title: '',
        headerTransparent: true,
        headerTintColor: '#fff',
        headerShown: false,
      }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Shipping" component={ShippingScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="ShippingMethod" component={ShippingMethodScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};

// Categories and Single Product page route
const CategoriesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Shop"
      detachInactiveScreens={true}
      screenOptions={{
        headerShown: false,
        title: '',
        headerTransparent: true,
        headerTintColor: '#fff',
      }}>
      {/* <Stack.Screen
        name="Categories"
        options={{ headerShown: false }}
        component={CategoriesScreen}
      /> */}
      <Stack.Screen
        name="Shop"
        initialParams={{ singleCategory: null, withChildern: null }}
        component={Shop}
      />
      <Stack.Screen
        name="SubCategories"
        initialParams={{ singleCategory: null, withChildern: null }}
        // options={({ navigation }) => ({
        //   title: 'Home',
        //   headerStyle: {
        //     backgroundColor: 'rgb(0, 145, 234)',
        //   },
        //   headerTintColor: 'blue',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //     color: 'blue',
        //   },
        //   headerLeft: () => (
        //     <Ionicons
        //       name={'md-menu'}
        //       size={24}
        //       style={{ marginLeft: 10 }}
        //       onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        //     />
        //   ),
        // })}
        component={SubCategoriesScreen}
      />

      {/* <Stack.Screen
        name="Category"
        options={{ headerShown: false }}
        component={CategoryScreen}
      /> */}
      <Stack.Screen
        name="SingleProduct"
        options={{ headerShown: false }}
        component={SingleProductScreen}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  const DrawerHeaderContent = (props) => {
    return (
      <DrawerContentScrollView
        contentContainerStyle={{ flex: 1, backgroundColor: APP_PRIMARY_COLOR }}>
        <ImageBackground
          source={require('../assets/images/drawer.png')}
          style={styles.backgroundImage}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerHeaderText}>Ravendel</Text>
          </View>
          <ScrollView style={{ marginTop: 80 }}>
            <DrawerItemList {...props} />
            <AText
              ml="5px"
              mt="25px"
              mb="5px"
              color="#ABA7A7"
              fonts={FontStyle.fontBold}>
              © 2024 copyright:Ravendel
            </AText>
          </ScrollView>
        </ImageBackground>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        unmountOnBlur: true,
        drawerStyle: {
          backgroundColor: '#fff',
        },
        headerShown: false,
        drawerActiveTintColor: APP_PRIMARY_COLOR,
        // drawerContentStyle: { backgroundColor: 'pink' },
        drawerItemStyle: {
          borderBottomColor: '#ABA7A7',
          borderBottomWidth: 0.5,
          backgroundColor: 'transparent',
          marginLeft: 20,
          fontSize: 12,
        },
        drawerInactiveTintColor: '#ABA7A7',
      }}
      initialRouteName="Splash"
      drawerContent={DrawerHeaderContent}>
      {/* <Drawer.Screen
        name={'Splash'}
        component={Splash}
        options={{
          drawerStyle: {
            backgroundColor: '#1c6765',
          },
          drawerLabel: '',
        }}
      /> */}
      <Drawer.Screen
        name={'Home'}
        component={HomeScreen}
        options={{
          drawerStyle: {
            backgroundColor: '#1c6765',
          },
          drawerLabel: 'Home',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="home" color={APP_PRIMARY_COLOR} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={'CateGories'}
        component={CategoriesStack}
        options={{
          unmountOnBlur: true,
          drawerLabel: 'Shop',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="shopping-bag" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={'MyOrders'}
        component={OrderScreen}
        options={{
          drawerLabel: 'My Orders',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="trello" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={'MyCart'}
        component={CartStack}
        options={{
          drawerLabel: 'My Cart',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name={'MyWishlist'}
        component={CartScreen}
        options={{
          drawerLabel: 'My Wishlist',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="tag" color={color} size={size} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name={'AccountWrapper'}
        component={AccountStack}
        options={{
          unmountOnBlur: false,
          drawerLabel: 'My Account',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={'Notification'}
        component={CartScreen}
        options={{
          drawerLabel: 'Notification',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="bell" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={'Contact us'}
        component={ShippingScreen}
        options={{
          // drawerIcon: ({ focused, size, color }) => (
          //   <Feather name="location-enter" color={color} size={size} />
          // ),
          drawerItemStyle: {
            borderBottomColor: '#ABA7A7',
            borderBottomWidth: 0.5,
            backgroundColor: 'transparent',
            marginLeft: 20,
            marginTop: 40,
          },
        }}
      />
      <Drawer.Screen name={'About us'} component={CartScreen} />
      <Drawer.Screen name={'Privacy Policy'} component={CartScreen} />
      <Drawer.Screen name={'Help'} component={CartScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 15,
  },

  // drawer content
  drawerLabel: {
    fontSize: 14,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  drawerHeader: {
    marginTop: 50,
    marginBottom: 20,
    paddingLeft: 10,
  },
  drawerHeaderText: {
    color: Colors.whiteColor,
    fontSize: 27,
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;
