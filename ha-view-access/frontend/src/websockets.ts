import {
  haviewaccessConfig,
  Dictionary,
  haviewaccessUser,
  haviewaccessCode,
  haviewaccessMessage,
} from './types';
import { getHass } from './Hass';
import { DashboardConfig, LovelacePanels, User } from './userViewsTypes';

export const fetchLovelaceDashBoard = (urlPath: string|null): Promise<DashboardConfig> =>
  getHass().callWS({
    type: 'lovelace/config',
    url_path: urlPath
  });

export const fetchAuthList = (): Promise<User[]> =>
  getHass().callWS({
    type: 'config/auth/list',
  });

export const fetchLovelacePanels = (): Promise<LovelacePanels> =>
  getHass().callWS({
    type: 'get_panels',
  });

export const fetchConfig = (): Promise<haviewaccessConfig> =>
  getHass().callWS({
    type: 'ha-view-access/config',
  });

export const saveConfig = (
  config: Partial<haviewaccessConfig>
): Promise<boolean> => {
  return getHass().callApi('POST', 'ha-view-access/config', config);
};

export const fetchCodes = (): Promise<Dictionary<haviewaccessCode>> =>
  getHass().callWS({
    type: 'ha-view-access/codes',
  });

export const fetchCode = (id: string): Promise<haviewaccessCode> =>
  fetchCodes().then((codes) => codes[id]);

export const saveCode = (code: Partial<haviewaccessCode>): Promise<boolean> => {
  return getHass().callApi('POST', 'ha-view-access/codes', code);
};

export const deleteCode = (code_id: string): Promise<boolean> => {
  return getHass().callApi('POST', 'ha-view-access/codes', {
    code_id: code_id,
    remove: true,
  });
};

export const fetchMessages = (): Promise<Dictionary<haviewaccessMessage>> =>
  getHass().callWS({
    type: 'ha-view-access/messages',
  });

export const fetchMessage = (id: string): Promise<haviewaccessMessage> =>
  fetchMessages().then((messages) => messages[id]);

export const saveMessage = (
  message: Partial<haviewaccessMessage>
): Promise<boolean> => {
  return getHass().callApi('POST', 'ha-view-access/messages', message);
};

export const deleteMessage = (message_id: string): Promise<boolean> => {
  return getHass().callApi('POST', 'ha-view-access/messages', {
    message_id: message_id,
    remove: true,
  });
};
export const fetchUsers = (): Promise<Dictionary<haviewaccessUser>> =>
  getHass().callWS({
    type: 'ha-view-access/users',
  });

export const fetchUser = (id: string): Promise<haviewaccessUser> =>
  fetchUsers().then((users) => users[id]);

export const saveUser = (user: Partial<haviewaccessUser>): Promise<boolean> => {
  return getHass().callApi('POST', 'ha-view-access/users', user);
};

export const deleteUser = (user_id: string): Promise<boolean> => {
  return getHass().callApi('POST', 'ha-view-access/users', {
    user_id: user_id,
    remove: true,
  });
};

export const moveUser = (
  user_id: string,
  direction: string
): Promise<boolean> => {
  return getHass().callApi('POST', 'ha-view-access/users/move', {
    user_id,
    direction,
  });
};
