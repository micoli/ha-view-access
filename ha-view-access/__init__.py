import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import const
from .card import async_register_card
from .coordinator import haviewaccessCoordinator
from .panel import async_register_panel
from .store import async_get_registry
from .websockets import async_register_websockets

_LOGGER = logging.getLogger(__name__)

type haviewaccessConfigEntry = ConfigEntry[haviewaccessCoordinator]

async def async_setup(hass: HomeAssistant, config) -> bool:
    _LOGGER.debug(f'async_setup {repr(config)}')
    store = await async_get_registry(hass)
    coordinator = haviewaccessCoordinator(hass, store)

    hass.data.setdefault(const.DOMAIN, {})
    hass.data[const.DOMAIN] = {
        "coordinator": coordinator,
        "entries": {}
    }

    await async_register_panel(hass)
    await async_register_card(hass)
    await async_register_websockets(hass)

    return True

async def async_setup_entry(hass: HomeAssistant, entry: haviewaccessConfigEntry) -> bool:
    _LOGGER.debug(f'async_setup_entry {repr(entry.entry_id)} {repr(entry.data)} {repr(entry.options)}')
    coordinator = hass.data[const.DOMAIN]['coordinator']

    # if entry.unique_id is None:
    #     hass.config_entries.async_update_entry(entry, unique_id=coordinator.id, data={})

    return True
