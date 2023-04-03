import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
} from '../screens';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getValue, isEmpty } from '../utils/helper';
import AlertError from '../theme-components/alert';
import { sessionCheck } from '../store/action/loginAction';
import { checkStorageAction } from '../store/action';
import { useIsFocused } from '@react-navigation/native';

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
        title: '',
        headerTransparent: true,
        headerTintColor: '#fff',
      }}>
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="SubCategories" options={{ headerShown: false }} component={SubCategoriesScreen} />
      <Stack.Screen name="Category" options={{ headerShown: false }} component={CategoryScreen} />
      <Stack.Screen name="SingleProduct" component={SingleProductScreen} />
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
  const isFocused =useIsFocused()
  const cartItems = useSelector(state => state.cart.products) || 0;
  const { isLoggin } = useSelector(state => state.customer);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(sessionCheck())
    getCart();
  }, [isFocused]);

  const getCart = async () => {
    var userDetails = await getValue('userDetails')
    if (!isEmpty(userDetails)) {
      userDetails = JSON.parse(userDetails)
      dispatch(checkStorageAction(userDetails._id));
    } else {
      dispatch(checkStorageAction());

    }
  }
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

  const HomeIconWithBadge = props => {
    return <IconWithBadge {...props} badgeCount={cartItems.length} />;
  };

  return (
    <>
      <Tab.Navigator
      detachInactiveScreens={true}
        screenOptions={({ route }) => ({
          headerShown: false,
          unmountOnBlur: true,
          lazy: false,
          tabBarActiveTintColor: setting.themes[0].primaryColor,
          tabBarInactiveTintColor: 'gray',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              // iconName = focused ? 'home' : 'home';
              iconName = 'home';
            } else if (route.name === 'CateGories') {
              iconName = 'list';
            } else if (route.name === 'Cart') {
              // iconName = 'shopping-cart';
              return (
                <HomeIconWithBadge
                  name="shopping-cart"
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === 'AccountWrapper') {
              iconName = 'user-circle-o';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        backBehavior={'initialRoute'}
      >
        {/* unmountInactiveRoutes */}
        <Tab.Screen 
        name="Home"
         options={{
          tabBarLabel: 'Home',
        }}
         component={HomeScreen} />
        <Tab.Screen
          name="CateGories"
          component={CategoriesStack}
          options={({ route }) => ({
            unmountOnBlur:false,
            lazy:true,
            tabBarLabel: 'Categories',
          })}
        />
        <Tab.Screen name="Cart"
          component={CartStack}
          options={({ route }) => ({
            tabBarLabel: 'Cart',
          })}
        />
        <Tab.Screen name="AccountWrapper"
          component={AccountStack}
          options={({ route }) => ({
            unmountOnBlur:true,
            lazy:false,
            tabBarLabel: 'Account',
          })}
        />
      </Tab.Navigator>
      <AlertError />

    </>
  );
};

export default Navigation;
