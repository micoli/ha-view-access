import {
  Dictionary,
} from './types';
import { getHass } from './Hass';
import { DashboardConfig, LovelacePanels, User } from './userViewsTypes';

export const fetchLovelaceDashBoard = (urlPath: string|null): Promise<DashboardConfig> =>
  getHass().callWS({
    type: 'lovelace/config',
    url_path: urlPath
  });

export const saveLovelaceDashBoard = (config: object & {url:string|null}): Promise<DashboardConfig> =>
    getHass().callWS({
        type: 'lovelace/config/save',
        url_path: config.url,
        config,
    });

export const fetchAuthList = (): Promise<User[]> =>
  getHass().callWS({
    type: 'config/auth/list',
  });

export const fetchLovelacePanels = (): Promise<LovelacePanels> =>
  getHass().callWS({
    type: 'get_panels',
  });
