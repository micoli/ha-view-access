export interface LovelacePanelCustomConfig {
  name: string;
  embed_iframe: boolean;
  trust_external: boolean;
  module_url: string;
}

export interface LovelacePanelConfig {
  mode?: string;
  _panel_custom?: LovelacePanelCustomConfig;
}

export interface LovelacePanel {
  component_name: string;
  icon: string | null;
  title: string | null;
  config: LovelacePanelConfig | null;
  url_path: string;
  require_admin: boolean;
  config_panel_domain: string | null;
}

export interface LovelacePanels {
  [key: string]: LovelacePanel;
}


export interface UserVisibility {
  user: string;
}

export interface BaseView {
  path: string;
  title: string;
  visible?: UserVisibility[];
}

export interface DashboardConfig {
  views: BaseView[];
}



export interface Credential {
  type: string;
}

export interface User {
  id: string;
  username: string | null;
  name: string;
  is_owner: boolean;
  is_active: boolean;
  local_only: boolean;
  system_generated: boolean;
  group_ids: string[];
  credentials: Credential[];
}
