import os
import logging

from homeassistant.components import frontend
from homeassistant.components import panel_custom
from homeassistant.components.frontend import DATA_PANELS
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from . import const

_LOGGER = logging.getLogger(__name__)


async def async_register_panel(hass: HomeAssistant):
    panels = hass.data.setdefault(DATA_PANELS, {})
    if const.DOMAIN+'_config' in panels:
        return

    root_dir = os.path.join(hass.config.path(const.CUSTOM_COMPONENTS), const.INTEGRATION_FOLDER)
    panel_dir = os.path.join(root_dir, const.PANEL_FOLDER)
    view_url = os.path.join(panel_dir, const.PANEL_FILENAME)


    await hass.http.async_register_static_paths(
        [StaticPathConfig(const.PANEL_URL, view_url, cache_headers=False)]
    )

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=const.PANEL_NAME,
        frontend_url_path=const.DOMAIN,
        module_url=const.PANEL_URL,
        sidebar_title=const.PANEL_TITLE,
        sidebar_icon=const.PANEL_ICON,
        require_admin=True,
        embed_iframe=True,
        config={},
        config_panel_domain=const.DOMAIN+'_config'
    )


def async_unregister_panel(hass):
    frontend.async_remove_panel(hass, const.DOMAIN)
    _LOGGER.debug("Removing panel")
