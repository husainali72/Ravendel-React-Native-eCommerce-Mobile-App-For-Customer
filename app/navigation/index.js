import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  HomeScreen,
  CartScreen,
  CategoriesScreen,
  AccountScreen,
  CategoryScreen,
  SubCategoriesScreen,
  SingleProductScreen,
  ProfileScreen,
  SavedAddressScreen,
  OrderScreen,
  RecentlyViewScreen,
  LoginScreen,
  SignupScreen,
  ForgotPasswordScreen,
  SaveCardScreen,
  ShippingScreen,
  PaymentMethodScreen,
  CheckoutScreen,
  OrderDetailScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  Temp,
  UserEntry,
  SubcategoriesOption,
  Shop,
} from '../screens';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getValue, isEmpty } from '../utils/helper';
import AlertError from '../theme-components/alert';
import { sessionCheck } from '../store/action/loginAction';
import { checkStorageAction } from '../store/action';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { APP_PRIMARY_COLOR } from '../utils/config';
import Colors from '../constants/Colors';
import NVC from '../navigation/NavigationConstants';
import ShippingMethodScreen from '../screens/checkout/ShippingMethodScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const setting = { themes: [{ primaryColor: '#3a3a3a', productsCount: '3' }] };

// Account Stack
const AccountStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Account"
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
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="LoginSignUp" component={UserEntry} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

// Categories and Single Product page route
const CategoriesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Categories"
      detachInactiveScreens={true}
      screenOptions={{
        headerShown: false,
        title: '',
        headerTransparent: true,
        headerTintColor: '#fff',
      }}>
      <Stack.Screen
        name="Categories"
        options={{ headerShown: false }}
        component={CategoriesScreen}
      />
      <Stack.Screen
        name="SubcategoriesOption"
        options={{ headerShown: false }}
        component={SubcategoriesOption}
      />
      <Stack.Screen
        name="SubCategories"
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
      <Stack.Screen
        name="Category"
        options={{ headerShown: false }}
        component={CategoryScreen}
      />
      <Stack.Screen
        name="SingleProduct"
        options={{ headerShown: false }}
        component={SingleProductScreen}
      />
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
      }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Shipping" component={ShippingScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const isFocused = useIsFocused();
  const cartItems = useSelector((state) => state.cart.products) || 0;
  const { isLoggin } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(sessionCheck());
    getCart();
  }, [isFocused]);

  const getCart = async () => {
    var userDetails = await getValue('userDetails');
    if (!isEmpty(userDetails)) {
      userDetails = JSON.parse(userDetails);
      dispatch(checkStorageAction(userDetails._id));
    } else {
      dispatch(checkStorageAction());
    }
  };
  const IconWithBadge = ({ name, badgeCount, color, size }) => {
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Icon name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: '#000',
              borderRadius: 10,
              width: 15,
              height: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // const HomeIconWithBadge = (props) => {
  //   return <IconWithBadge {...props} badgeCount={cartItems.length} />;
  // };

  return (
    <>
      <Tab.Navigator
        detachInactiveScreens={true}
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: Colors.lightestPrimaryColor,
            paddingBottom: 4,
            // display: 'none',
          },
          tabBarLabelStyle: {
            fontSize: 14,
          },
          headerShown: false,
          unmountOnBlur: true,
          lazy: false,
          tabBarActiveTintColor: APP_PRIMARY_COLOR,
          tabBarInactiveTintColor: Colors.grayColor,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused, color, size }) => {
            let image;
            if (route.name === 'Home') {
              image = focused
                ? require('../assets/images/homeactive.png')
                : require('../assets/images/home.png');
            } else if (route.name === 'Categories') {
              image = focused
                ? require('../assets/images/catactive.png')
                : require('../assets/images/categori.png');
            } else if (route.name === 'Cart') {
              image = focused
                ? require('../assets/images/cartactive.png')
                : require('../assets/images/cart.png');
            } else if (route.name === 'Account') {
              image = focused
                ? require('../assets/images/useractive.png')
                : require('../assets/images/user.png');
            }
            return (
              <Image
                source={image}
                resizeMode="contain"
                style={style.imgstyle}
              />
            );
          },
        })}
        backBehavior={'initialRoute'}>
        {/* Home */}
        <Tab.Screen
          name={NVC.HOME_SCREEN}
          options={{
            tabBarLabel: 'Home',
          }}
          component={HomeScreen}
        />
        {/* Home End */}

        <Tab.Screen
          name={NVC.TEMP_SCREEN}
          options={{
            tabBarLabel: 'Temp',
            tabBarButton: () => null,
          }}
          component={Temp}
        />

        {/* Categories */}
        {/* <Tab.Screen
          name="CateGories"
          component={CategoriesStack}
          options={({ route }) => ({
            unmountOnBlur: true,
            lazy: true,
            tabBarLabel: 'Categories',
          })}
        /> */}
        <Stack.Screen
          name={NVC.CATEGORIES_SCREEN}
          options={{ headerShown: false }}
          component={CategoriesScreen}
        />
        <Stack.Screen
          name={NVC.SHOP_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={Shop}
        />
        <Stack.Screen
          name={NVC.SUBCATEGORIES_OPTION_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SubcategoriesOption}
        />
        <Stack.Screen
          name={NVC.SUBCATEGORIES_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SubCategoriesScreen}
        />
        <Stack.Screen
          name={NVC.CATEGORY_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={CategoryScreen}
        />
        <Stack.Screen
          name={NVC.SINGLE_PRODUCT_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SingleProductScreen}
        />
        {/* Categories End */}

        {/* Cart */}
        {/* <Tab.Screen
          name="MyCart"
          component={CartStack}
          options={({ route }) => ({
            tabBarLabel: 'Cart',
          })}
        /> */}
        <Stack.Screen name={NVC.CART_SCREEN} component={CartScreen} />
        <Stack.Screen
          name={NVC.SHIPPING_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ShippingScreen}
        />
        <Stack.Screen
          name={NVC.PAYMENT_METHOD_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={PaymentMethodScreen}
        />
        <Stack.Screen
          name={NVC.SHIPPING_METHOD_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ShippingMethodScreen}
        />
        <Stack.Screen
          name={NVC.CHECKOUT_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={CheckoutScreen}
        />
        {/* Cart End */}

        {/* Account */}
        {/* <Tab.Screen
          name="AccountWrapper"
          component={AccountStack}
          options={({ route }) => ({
            unmountOnBlur: true,
            lazy: false,
            tabBarLabel: 'Account',
          })}
        /> */}
        <Stack.Screen name={NVC.ACCOUNT_SCREEN} component={AccountScreen} />
        <Stack.Screen
          name={NVC.PROFILE_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ProfileScreen}
        />
        <Stack.Screen
          name={NVC.SAVED_ADDRESS_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SavedAddressScreen}
        />
        <Stack.Screen
          name={NVC.ORDERS_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={OrderScreen}
        />
        <Stack.Screen
          name={NVC.RECENTLY_VIEWED_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={RecentlyViewScreen}
        />
        <Stack.Screen
          name={NVC.SAVE_CARDS_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SaveCardScreen}
        />
        {/* <Stack.Screen
          name="Login"
          options={{ headerShown: false, tabBarButton: () => null }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="Signup"
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SignupScreen}
        /> */}
        <Stack.Screen
          name={NVC.LOGIN_SIGNUP_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={UserEntry}
        />
        <Stack.Screen
          name={NVC.FORGOT_PASSWORD_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name={NVC.ORDER_DETAIL_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={OrderDetailScreen}
        />
        <Stack.Screen
          name={NVC.EDIT_PROFILE_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name={NVC.CHANGE_PASSWORD_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ChangePasswordScreen}
        />
        {/* Account End*/}
      </Tab.Navigator>
      <AlertError />
    </>
  );
};

export default Navigation;
const style = StyleSheet.create({
  // tabstyle: {
  //   borderTopColor: '#C7C7C7',
  //   borderTopWidth: Platform.OS === 'ios' ? 0.3 : 1,
  //   backgroundColor: '#F9F9F9',
  //   height: 70,
  //   paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  //   paddingTop: 5,
  // },
  imgstyle: {
    resizeMode: 'contain',
    width: 15,
    height: 15,
  },
});
