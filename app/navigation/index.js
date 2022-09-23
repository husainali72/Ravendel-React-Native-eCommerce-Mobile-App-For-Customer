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
} from '../screens';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { checkStorageAction } from '../store/action/cartAction';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const setting = { themes: [{ primaryColor: '#3a3a3a', productsCount: '3' }] };

// Account Stack
const AccountStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={{
        title: '',
        headerTransparent: true,
        headerTintColor: '#fff',
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
    </Stack.Navigator>
  );
};

// Categories and Single Product page route
const CategoriesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Categories"
      screenOptions={{
        title: '',
        headerTransparent: true,
        headerTintColor: '#fff',
      }}>
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="SubCategories" component={SubCategoriesScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
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
  const cartItems = useSelector(state => state.cart.products) || 0;

  const checkStorage = useDispatch();

  useEffect(() => {
    checkStorage(checkStorageAction());
  }, []);

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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            // iconName = focused ? 'home' : 'home';
            iconName = 'home';
          } else if (route.name === 'Categories') {
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
          } else if (route.name === 'Account') {
            iconName = 'user-circle-o';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      lazy={true}
      swipeEnabled={false}
      animationEnabled={true}
      tabBarOptions={{
        activeTintColor: setting.themes[0].primaryColor,
        inactiveTintColor: 'gray',
        scrollEnabled: true,
      }}>
      {/* unmountInactiveRoutes */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Categories"
        children={CategoriesStack}
        options={({ route }) => ({
          tabBarVisible: route.state && route.state.index === 0,
        })}
      />
      <Tab.Screen name="Cart" children={CartStack}
        options={({ route }) => ({
          tabBarVisible: route.state && route.state.index === 0,
        })}
      />
      <Tab.Screen name="Account" children={AccountStack}
        options={({ route }) => ({
          tabBarVisible: route.state && route.state.index === 0,
        })}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
