import { UserManagerSettings } from 'oidc-client';
import { createUserManager } from 'redux-oidc';
import { RuntimeConfig } from '../RuntimeConfig';

const userManagerConfig: UserManagerSettings = {
  client_id: 'spa',
  authority: RuntimeConfig.AuthorityUrl,
  redirect_uri: `${window.location.origin}/callback`,
  silent_redirect_uri: `${window.location.origin}/silentRenew`,
  response_type: 'code',
  scope: 'openid profile offline_access projectname__',
  automaticSilentRenew: true,
  loadUserInfo: true,
};

export const userManager = createUserManager(userManagerConfig);