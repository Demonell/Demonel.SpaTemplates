import { AppThunkAction } from "../../../store";
import { httpAuth } from '../../../clients/apiHelper';
import { RuntimeConfig } from '../../../RuntimeConfig';
import { setUserInfoState } from "./actions";
import { UserInfo, UserInfoActionTypes } from "./types";
import { initialState } from "./reducers";

export const loadUserInfo = (): AppThunkAction<UserInfoActionTypes> => (dispatch) => {
    httpAuth.fetch(RuntimeConfig.AuthorityUrl + 'connect/userinfo')
        .then(response => {
            if (response.ok) {
                (response.json() as Promise<Record<string, string>>).then((userInfoRecord) => {
                    let userInfo: UserInfo = initialState.userInfo;
                    userInfo.roles = [];
                    userInfo.claims = [];

                    for (let key in userInfoRecord) {
                        switch (key) {
                            case 'sub':
                                userInfo.sub = userInfoRecord[key];
                                break;
                            case 'AspNet.Identity.SecurityStamp':
                                userInfo.securityStamp = userInfoRecord[key];
                                break;
                            case 'preferred_username':
                                userInfo.preferred_username = userInfoRecord[key];
                                break;
                            case 'email':
                                userInfo.email = userInfoRecord[key];
                                break;
                            case 'email_verified':
                                userInfo.email_verified = (/true/i).test(userInfoRecord[key]);
                                break;
                            case 'name':
                                userInfo.name = userInfoRecord[key];
                                break;
                            case 'role':
                                userInfo.roles.push(userInfoRecord[key]);
                                break;
                            default:
                                userInfo.claims.push(key);
                                break;
                        }
                    }

                    dispatch(setUserInfoState({ userInfo: userInfo }));
                });
            }
        });
}