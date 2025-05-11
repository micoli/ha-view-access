import axios from 'axios';
import { HomeAssistant } from './types';

let hass: HomeAssistant;

const getHass = (): HomeAssistant => {
  return hass;
};
const getApi = () => {
  return axios.create({
    baseURL: hass.hassUrl(),
    headers: {
      Authorization: `Bearer ${hass.auth.data.access_token}`,
    },
  });
};
const setHass = (value: HomeAssistant) => {
  hass = value;
};
export { getHass, setHass };
