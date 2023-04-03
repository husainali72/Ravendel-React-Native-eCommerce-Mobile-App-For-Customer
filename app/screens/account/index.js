import React from 'react';
import { AText, AContainer, AHeader, AButton } from '../../theme-components';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from '../../store/reducers/loginReducer';

const AccountScreen = ({ navigation }) => {
  const isLoggin = useSelector(state => state.customer.isLoggin);
  const dispatch=useDispatch()

 const Logout =()=>{
  dispatch(LogOut(navigation))
 }
  return (
    <>
      <AHeader title="Account" />
      <AContainer withoutPadding>
        {isLoggin ?
        <InnerContainer>
          <ListView
            onPress={() =>
              navigation.navigate('Orders', {
                initial: false,
              })
            }>
            <ListIcon>
              <Icon name="shopping-bag" size={20} />
            </ListIcon>
            <ListTitleWrapper>
              <AText medium heavy mb="5px">
                Orders
              </AText>
              <AText small>Track, Cancel and return orders</AText>
            </ListTitleWrapper>
          </ListView>
          <ListView
            onPress={() =>
              navigation.navigate('Profile', {
                initial: false,
              })
            }>
            <ListIcon>
              <Icon name="user-circle-o" size={20} />
            </ListIcon>
            <ListTitleWrapper>
              <AText medium heavy mb="5px">
                Profile Details
              </AText>
              <AText small>Update your personal information</AText>
            </ListTitleWrapper>
          </ListView>
          <ListView
            onPress={() =>
              navigation.navigate('ChangePassword', {
                initial: false,
              })
            }>
            <ListIcon>
              <Icon name="key" size={20} />
            </ListIcon>
            <ListTitleWrapper>
              <AText medium heavy mb="5px">
                Change Password 
              </AText>
              <AText small>Update your credentials</AText>
            </ListTitleWrapper>
          </ListView>
          {/* <ListView
            onPress={() =>
              navigation.navigate('RecentlyViewed', {
                initial: false,
              })
            }>
            <ListIcon>
              <Icon name="eye" size={20} />
            </ListIcon>
            <ListTitleWrapper>
              <AText medium heavy mb="5px">
                Recently Viewed
              </AText>
              <AText small>Last viewed product</AText>
            </ListTitleWrapper>
          </ListView> */}
          <ListView
            onPress={() =>
              navigation.navigate('SavedAddress', {
                initial: false,
              })
            }>
            <ListIcon>
              <Icon name="address-book-o" size={20} />
            </ListIcon>
            <ListTitleWrapper>
              <AText medium heavy mb="5px">
                Saved addresses
              </AText>
              <AText small>Save addresses for faster checkout</AText>
            </ListTitleWrapper>
          </ListView>
          {/* <ListView
            onPress={() =>
              navigation.navigate('SaveCards', {
                initial: false,
              })
            }>
            <ListIcon>
              <Icon name="credit-card" size={20} />
            </ListIcon>
            <ListTitleWrapper>
              <AText medium heavy mb="5px">
                Saved Cards
              </AText>
              <AText small>Save cards for faster payments</AText>
            </ListTitleWrapper>
          </ListView> */}
        </InnerContainer>
        :(
          <AText large center bold>Please sign in</AText>
        )
          }
      </AContainer>
      <UserSection>
        {!isLoggin ? (
          <>
            <AButton
              title="Sign In"
              block
              onPress={() =>
                navigation.navigate('Login', {
                  initial: false,
                })
              }
            />
          </>
        ) : (
            <AButton 
            title="Sign Out"
            onPress={() => {Logout()} } 
            />
          )}
        <AppFooter>
          <AppInfo>
            <AText large heavy color="#000" mr="5px">
              Ravendel
            </AText>
            <AText small color="#3a3a3a" ml="5px">
              App Version: 1.0
              </AText>
          </AppInfo>
        </AppFooter>
      </UserSection>
    </>
  );
};

const InnerContainer = styled.View`
  padding: 10px;
  flex: 1;
`;
const ListView = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  padding: 10px 15px;
  background: #f7f7f7;
  border-radius: 10px;
  margin-bottom: 10px;
`;
const ListIcon = styled.View`
  width: 40px;
`;
const ListTitleWrapper = styled.View``;
const UserSection = styled.View`
  background: #f2f0f0;
  padding: 10px;
`;
const AppFooter = styled.View`
  margin-top: 10px;
`;
const Diviver = styled.View`
  padding: 0.5px;
  background: #fff;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const AppInfo = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

export default AccountScreen;
