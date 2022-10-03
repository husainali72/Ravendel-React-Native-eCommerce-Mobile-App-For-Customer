import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AButton, AContainer, AHeader, AText } from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import male from '../../assets/images/man.png';
import female from '../../assets/images/woman.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { editCustomerAction } from '../../store/action';

const EditProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.customer.userDetails);
    const [genderArr, setGenderArr] = useState([
        { 'id': 1, 'type': 'male' },
        { 'id': 2, 'type': 'female' },
    ])
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

    const profileUpdate = () => {
        var profileUpdateObject = {
            id: userData._id,
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            email: userDetails.email,
            phone: userDetails.phone,
            gender: userDetails.gender,
        };
        dispatch(editCustomerAction(profileUpdateObject, navigation))

    };
    return (
        <>
            <AHeader navigation={navigation} title="Edit Profile" headerColor={'#312f2d'} back />
            <AContainer withoutPadding automaticallyAdjustKeyboardInsets={true} >
                <UpperCurve />

                <ProfileView>
                    {genderArr.map((item, index) => (
                        <>
                            {(isEmpty(userDetails.gender) || (userDetails.gender == item.type))
                                &&
                                <ImageWrapper>
                                    <ImageButton onPress={() => {
                                    setuserDetails({
                                        ...userDetails,
                                        gender: item.type,
                                    })
                                }}>
                                        <ProfileImage
                                            source={item.type == 'male' ? male : female} />
                                        {!(isEmpty(userDetails.gender)) &&
                                            <EditButton onPress={() => {
                                                setuserDetails({
                                                    ...userDetails,
                                                    gender: '',
                                                })
                                            }}>

                                                <Icon name="edit" size={18} style={styles.editIcon} />
                                            </EditButton>
                                        }
                                    </ImageButton>
                                    {(isEmpty(userDetails.gender) && index == 0 )&&
                                        <AText bold center>Or</AText>
                                    }
                                </ImageWrapper>
                            }
                        </>
                    ))}
                </ProfileView>             
                <ItemWrapper>
                    <TextInputArea
                        placeholder="First Name"
                        value={userDetails.first_name}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                first_name: text,
                            })}
                    />
                    <TextInputArea
                        placeholder="Last Name"
                        value={userDetails.last_name}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                last_name: text,
                            })}
                    />
                    <TextInputArea
                        placeholder="Email"
                        value={userDetails.email}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                email: text,
                            })}

                    />
                    <TextInputArea
                        placeholder="Phone no."
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
            </AContainer>
        </>
    );
};
const TextInputArea = styled.TextInput`
    margin: 5px;
    border-color: gray;
    background:#E7E7E7;
    width: 90%;
    margin-bottom: 10px;
    border-radius: 5px;
    align-self:center;
    padding:9px;
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
    flex-direction:row;
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
const styles = StyleSheet.create({
    editIcon: {
        marginTop: 3,
        marginHorizontal: 9,
        alignSelf: 'center'
    }
})
export default EditProfileScreen;

