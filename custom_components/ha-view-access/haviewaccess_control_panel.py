import logging

from homeassistant.helpers.dispatcher import async_dispatcher_send

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass, config):
    return True


async def async_setup_platform(hass, config, async_add_entities, discovery_info=None):
    return True


async def async_setup_entry(hass, config_entry, async_add_devices):
    async_dispatcher_send(hass, "haviewaccess_platform_loaded")
