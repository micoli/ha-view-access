import logging

_LOGGER = logging.getLogger(__name__)

VERSION = "0.90"
NAME = "haviewaccess"
MANUFACTURER = "@micoli"
DOMAIN = "ha-view-access"

EVENT = f'{DOMAIN}_event'
# SIGNAL_STATE_UPDATED = f'{DOMAIN}.updated'
# CONF_INSTANCE_URL = "instance_url"
CUSTOM_COMPONENTS = "custom_components"
INTEGRATION_FOLDER = DOMAIN
PANEL_FOLDER = "frontend"
PANEL_FILENAME = "dist/ha-view-access-panel.js"

PANEL_URL = "/api/panel_custom/haviewaccess"
PANEL_TITLE = NAME
PANEL_ICON = "mdi:door-closed-lock"
PANEL_NAME = "ha-view-access-panel"

# ATTR_TYPE = "type"
# ATTR_PAYLOAD = "payload"
ATTR_REMOVE = "remove"
ATTR_ENABLED = "enabled"

ATTR_EXPIRY = "expiry"
ATTR_COMMENT = "comment"
# ATTR_CENTER_LABEL = "center_label"
# ATTR_MAIN_MESSAGE = "main_message"
# ATTR_MAIN_SUB_MESSAGE = "main_sub_message"

# ATTR_USER_ID = "user_id"
# ATTR_MOVE_DIRECTION = "direction"
ATTR_CODE_ID = "code_id"
# ATTR_MESSAGE_ID = "message_id"

SERVICE_ENABLE_CODE = "enable_code"
SERVICE_DISABLE_CODE = "disable_code"
