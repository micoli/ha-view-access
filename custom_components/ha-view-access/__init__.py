import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import const
from .panel import async_register_panel

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config) -> bool:
    _LOGGER.debug(f'async_setup {repr(config)}')

    hass.data.setdefault(const.DOMAIN, {})

    await async_register_panel(hass)

    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    return True
