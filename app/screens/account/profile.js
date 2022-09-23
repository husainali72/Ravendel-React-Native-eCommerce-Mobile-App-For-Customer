import React from 'react';
import { StatusBar, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { AContainer, AHeader, AText } from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import man from '../../assets/images/man.png';
import woman from '../../assets/images/woman.png';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = ({ navigation }) => {
  const userDetails = useSelector(state => state.customer.userDetails);
  console.log(userDetails, 'userDetails')
  return (
    <>
      <StatusBar backgroundColor="#312f2d" />
      <Appbar style={{ backgroundColor: '#312f2d' }}>
        <Appbar.BackAction onPress={() => navigation.goBack(null)} />
        <Appbar.Content title={"Profile"} style={{ alignItems: 'center', alignSelf: 'center' }} />
      </Appbar>
      <UpperCurve>
      </UpperCurve>
      <ProfileView>
        <ImageWrapper>
          <ProfileImage
            source={man} />
          <AText bold center>Or</AText>
          <ProfileImage
            source={woman} />
        </ImageWrapper>
        <Header onPress={()=>navigation.navigate('EditProfile')}>
        <AText bold centeR uppercase medium>{userDetails.first_name} {userDetails.last_name}</AText>
        <Icon name="edit" size={18} style={{marginTop:3,marginHorizontal:9,alignSelf:'center'}} />
        </Header>
      </ProfileView>

      <ItemWrapper>
        <ItemDescription>
          <ProfileDetailWrapper>
            <AText style={{ width: '35%' }} heavy>Name</AText>
            <AText medium style={{marginRight:15}}>:</AText>
            <AText capitalize>{userDetails.first_name} {userDetails.last_name}</AText>
          </ProfileDetailWrapper>
          <ProfileDetailWrapper>
            {!isEmpty(userDetails.phone) &&
              <>
                <AText style={{ width: '35%' }} heavy>Phone Number</AText>
                <AText medium style={{marginRight:15}}>:</AText>
                <AText>{userDetails.phone}</AText>
              </>
            }
          </ProfileDetailWrapper>
          <ProfileDetailWrapper>
            <AText style={{ width: '35%' }} heavy>Email</AText>
            <AText medium style={{marginRight:15}}>:</AText>
            <AText>{userDetails.email}</AText>
          </ProfileDetailWrapper>
        </ItemDescription>
      </ItemWrapper>

    </>
  );
};
const ProfileDetailWrapper = styled.View`
flex-direction:row;
width:100%;
align-self:center;
align-items: center;
padding:15px;
border-bottom-width:1px;
`;
const Header = styled.TouchableOpacity`
flex-direction:row;
align-self:center;
align-items: center;
justify-content: center;
`;
const ProfileImage = styled.Image`
  width: 80px;
  height: 60px;
  resize-mode: contain;
`;
const ImageWrapper = styled.View`
flex-direction:row
align-self:center;
justify-content: space-evenly;
align-items: center;
width:50%;
margin-bottom:25px;

`;
const ItemWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 100px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f7f7f7;
  overflow: hidden;
  position: relative;
  border: 1px solid #f7f7f7;
  box-shadow: 0 0 5px #eee;
  elevation: 1;
`;

const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
`;

const UpperCurve = styled.View`
height:30%;
width:100%;
background:#312f2d;
border-bottom-left-radius:30px;
border-bottom-right-radius:30px;
align-self:center
  `;
const ProfileView = styled.View`
height:30%;
width:90%;
align-items: center;
justify-content:center;
background:#f7f7f7;
border-radius:10px;
position:absolute;
top:20%;
z-index:1;
align-self:center;
shadow-color: #000;
shadow-offset: {
	width: 0;
	height: 2;
},
shadow-opacity: 0.25px;
shadow-radius: 3.84px;
elevation: 5;
 `;

export default ProfileScreen;

