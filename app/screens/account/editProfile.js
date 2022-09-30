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
    const dispatch = useDispatch();
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
                gender: userData.gender ? userData.gender : '',
            };
            setuserDetails(userDetailObject);
        }
    }, [userData]);
    console.log(userDetails, 'sfafdsf', userData.gender)
    const profileUpdate = () => {
        var profileUpdateObject = {
            id: userData._id,
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            email: userDetails.email,
            phone: userDetails.phone,
            gender: userDetails.gender,
        };
        console.log(profileUpdateObject, 'profileUpdateObject')
        dispatch(editCustomerAction(profileUpdateObject, navigation))

    };
    return (
        <>
            <StatusBar backgroundColor="#312f2d" />
            <Appbar style={{ backgroundColor: '#312f2d' }}>
                <Appbar.BackAction onPress={() => navigation.goBack(null)} />
                <Appbar.Content title={"Edit Profile"} style={{ alignItems: 'center', alignSelf: 'center' }} />
            </Appbar>
            <AContainer withoutPadding automaticallyAdjustKeyboardInsets={true} contentContainerStyle={{ marginBottom: 20, flexGrow: 1.5 }}>
                <>
                    <UpperCurve>
                    </UpperCurve>
                    <ProfileView>
                        <ImageWrapper>
                            {(isEmpty(userDetails.gender) || (userDetails.gender == 'male')) &&
                                <ImageContainer>
                                    <ImageButton onPress={() => {
                                        setuserDetails({
                                            ...userDetails,
                                            gender: 'male',
                                        })
                                    }}>
                                        <ProfileImage
                                            source={man} />
                                    </ImageButton>
                                    {!isEmpty(userDetails.gender) &&
                                        <EditButton onPress={() => {
                                            setuserDetails({
                                                ...userDetails,
                                                gender: '',
                                            })
                                        }}>
                                            <Icon name="edit" size={18} style={{ marginTop: 3, marginHorizontal: 9, alignSelf: 'center' }} />
                                        </EditButton>
                                    }
                                </ImageContainer>

                            }
                            {isEmpty(userDetails.gender) &&
                                <AText bold center>Or</AText>
                            }
                            {(isEmpty(userDetails.gender) || (userDetails.gender == 'female'))
                                &&
                                <ImageContainer>
                                    <ImageButton onPress={() => {
                                        setuserDetails({
                                            ...userDetails,
                                            gender: 'female',
                                        })
                                    }}>
                                        <ProfileImage
                                            source={woman} />
                                    </ImageButton>
                                    {!isEmpty(userDetails.gender) &&
                                        <EditButton onPress={() => {
                                            setuserDetails({
                                                ...userDetails,
                                                gender: '',
                                            })
                                        }}>
                                            <Icon name="edit" size={18} style={{ marginTop: 3, marginHorizontal: 9, alignSelf: 'center' }} />
                                        </EditButton>
                                    }
                                </ImageContainer>
                            }
                        </ImageWrapper>
                    </ProfileView>

                    <ItemWrapper>
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
                    </ItemWrapper>


                </>
            </AContainer>
        </>
    );
};
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
const ImageButton = styled.TouchableOpacity`
align-self:center;
justify-content: center;
align-items: center;
`;
const EditButton = styled.TouchableOpacity`
position:absolute;
top:30px;
right:-7px;
`;
const ImageContainer = styled.View`
align-self:center;
justify-content: center;
align-items: center;
`;
const ItemWrapper = styled.View`
  margin-top: 120px;
height:50%
`;

const UpperCurve = styled.View`
height:180px;
width:100%;
background:#312f2d;
border-bottom-left-radius:30px;
border-bottom-right-radius:30px;
align-self:center
  `;
const ProfileView = styled.View`
height:180px;
width:85%;
align-items: center;
justify-content:center;
background:#f7f7f7;
border-radius:10px;
position:absolute;
top:100px;
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

