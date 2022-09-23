import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AButton, AHeader } from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import { changePasswordAction} from '../../store/action';
import { ALERT_ERROR } from '../../store/reducers/alert';

const ChangePasswordScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.customer.userDetails);
    const [userDetails, setuserDetails] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });
    useEffect(() => {
        if (!isEmpty(userData)) {
            var userDetailObject = {
                old_password: '',
                new_password: '',
                confirm_password: '',
            };
            setuserDetails(userDetailObject);
        }
    }, [userData]);

    const profileUpdate = () => {
        if (isEmpty(userDetails.old_password )) {
            dispatch({
                type: ALERT_ERROR,
                payload: "Old password can't be empty",
            });
            return
        }
        if (isEmpty(userDetails.new_password )) {
            dispatch({
                type: ALERT_ERROR,
                payload: "New password can't be empty",
            });
            return
        }
        if (userDetails.new_password !== userDetails.confirm_password) {
            dispatch({
                type: ALERT_ERROR,
                payload: "Password doesn't match",
            });
            return
        }

        var profileUpdateObject = {
            id: userData._id,
            oldPassword: userDetails.old_password,
            newPassword: userDetails.new_password,

        };
        dispatch(changePasswordAction(profileUpdateObject, navigation))

    };
    return (
        <>
            <AHeader navigation={navigation} title="Change Password" back />
            <ItemWrapper>
                <ItemDescription>
                    <TextInput
                        style={{
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                        label="Old Password"
                        value={userDetails.old_password}
                        secureTextEntry={true}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                old_password: text,
                            })}
                    />
                    <TextInput
                        style={{
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                        label="New Password"
                        value={userDetails.new_password}
                        secureTextEntry={true}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                new_password: text,
                            })}
                    />
                    <TextInput
                        style={{
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                        label="Confirm Password"
                        value={userDetails.confirm_password}
                        secureTextEntry={true}
                        onChangeText={(text) =>
                            setuserDetails({
                                ...userDetails,
                                confirm_password: text,
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

export default ChangePasswordScreen;

