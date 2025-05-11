import {
  MessageBase,
  Connection,
  HassEntities,
  HassServices,
} from 'home-assistant-js-websocket';

export interface Dictionary<TValue> {
  [id: string]: TValue;
}

export interface ServiceCallRequest {
  domain: string;
  service: string;
  serviceData?: Record<string, any>;
  target?: {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?: string | string[];
  };
}

export interface HomeAssistant {
  connection: Connection;
  language: string;
  panels: {
    [name: string]: {
      component_name: string;
      config: { [key: string]: any } | null;
      icon: string | null;
      title: string | null;
      url_path: string;
    };
  };
  auth: { data: { access_token: string } };
  states: HassEntities;
  services: HassServices;
  hassUrl: () => string;
  localize: (key: string, ...args: any[]) => string;
  translationMetadata: {
    fragments: string[];
    translations: {
      [lang: string]: {
        nativeName: string;
        isRTL: boolean;
        fingerprints: { [fragment: string]: string };
      };
    };
  };
  callApi: <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: { [key: string]: any }
  ) => Promise<T>;
  callService: (
    domain: ServiceCallRequest['domain'],
    service: ServiceCallRequest['service'],
    serviceData?: ServiceCallRequest['serviceData'],
    target?: ServiceCallRequest['target']
  ) => Promise<void>;
  callWS: <T>(msg: MessageBase) => Promise<T>;
}

export type haviewaccessConfig = {
  enabled: boolean;
  center_label: string;
  main_message: string;
  main_sub_message: string;
};

export type haviewaccessUser = {
  user_id?: string;
  name: string;
  enabled: boolean;
  first_class_citizen: boolean;
  sip_uri: string;
  telegram_id: string;
  position: number;
};

export type haviewaccessCode = {
  code_id?: string;
  name: string;
  code: string;
  expiry: number;
  comment: string;
  enabled: boolean;
};

export type haviewaccessMessage = {
  message_id?: string;
  message: string;
  expiry: number;
  comment: string;
  enabled: boolean;
};
