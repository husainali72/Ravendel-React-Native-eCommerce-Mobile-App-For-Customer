import React, { useEffect, useState } from 'react';
import { StatusBar, Text } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AButton, AContainer, AHeader, AText } from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import man from '../../assets/images/man.png';
import woman from '../../assets/images/woman.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { editCustomerAction } from '../../store/action';

const EditProfileScreen = ({ navigation }) => {
    const dispatch =useDispatch();
    const userData = useSelector(state => state.customer.userDetails);
    const [userDetails, setuserDetails] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: ""
    });
    useEffect(() => {
        if (!isEmpty(userData)) {
            var userDetailObject = {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                gender: "female",
            };
            setuserDetails(userDetailObject);
        }
    }, [userData]);

    const profileUpdate = () => {
        var profileUpdateObject = {
            id: userData._id,
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            email: userDetails.email,
            phone: userDetails.phone,
            gender: userDetails.gender,
        };
        console.log(profileUpdateObject,'profileUpdateObject')
        dispatch(editCustomerAction(profileUpdateObject,navigation))
       
    };
    return (
        <>
            <StatusBar backgroundColor="#312f2d" />
            <Appbar style={{ backgroundColor: '#312f2d' }}>
                <Appbar.BackAction onPress={() => navigation.goBack(null)} />
                <Appbar.Content title={"Edit Profile"} style={{ alignItems: 'center', alignSelf: 'center' }} />
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
            </ProfileView>

            <ItemWrapper>
                <ItemDescription>
                    <TextInput
                        style={{
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                        label="First Name"
                        value={userDetails.first_name}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                first_name: text,
                            })}
                    />
                    <TextInput
                        style={{
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                        label="Last Name"
                        value={userDetails.last_name}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                last_name: text,
                            })}
                    />
                    <TextInput
                        style={{
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                        label="Email"
                        value={userDetails.email}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                email: text,
                            })}

                    />
                    <TextInput
                        style={{
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                        label="Phone no."
                        value={userDetails.phone}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                phone: text,
                            })}
                    />
                    <AButton
                        onPress={() => { profileUpdate() }}
                        title="Submit" />
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
const Header = styled.View`
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

export default EditProfileScreen;

