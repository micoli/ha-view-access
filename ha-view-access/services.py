import logging
import voluptuous as vol
from homeassistant.helpers import config_validation as cv

from homeassistant.const import ATTR_NAME
from homeassistant.core import callback
from homeassistant.helpers.service import async_register_admin_service

from . import const

_LOGGER = logging.getLogger(__name__)

SERVICE_TOGGLE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_NAME, default=""): cv.string,
    }
)

@callback
async def async_register_services(hass):

    coordinator = hass.data[const.DOMAIN]["coordinator"]

    async def async_srv_toggle_code(call):
        name = call.data.get(ATTR_NAME)
        enable = True if call.service == const.SERVICE_ENABLE_CODE else False
        codes = coordinator.store.async_get_codes()
        code = next((item for item in list(codes.values()) if item[ATTR_NAME] == name), None)
        if code is None:
            _LOGGER.warning("Failed to {} code, no match for name '{}'".format("enable" if enable else "disable", name))
            return

        coordinator.store.async_update_code(code[const.ATTR_CODE_ID], {const.ATTR_ENABLED: enable})
        _LOGGER.info("User code '{}' was {}".format(name, "enabled" if enable else "disabled"))

    async_register_admin_service(
        hass,
        const.DOMAIN,
        const.SERVICE_ENABLE_CODE,
        async_srv_toggle_code,
        schema=SERVICE_TOGGLE_SCHEMA
    )
    async_register_admin_service(
        hass,
        const.DOMAIN,
        const.SERVICE_DISABLE_CODE,
        async_srv_toggle_code,
        schema=SERVICE_TOGGLE_SCHEMA
    )
