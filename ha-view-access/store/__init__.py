import logging
import time
import attr
from collections import OrderedDict
from typing import MutableMapping, cast

from homeassistant.core import callback, HomeAssistant
from homeassistant.helpers.storage import Store

from .code import DigicodeCodeEntry
#from ..const import DOMAIN

DOMAIN = "ha-view-access"
_LOGGER = logging.getLogger(__name__)

DATA_REGISTRY = f"{DOMAIN}_storage"
STORAGE_KEY = f"{DOMAIN}.storage"
STORAGE_VERSION_MAJOR = 6
STORAGE_VERSION_MINOR = 3
SAVE_DELAY = 10

def omit(obj: dict, blacklisted_keys: list):
    return {
        key: val
        for key, val in obj.items()
        if key not in blacklisted_keys
    }

class MigratableStore(Store):
    async def _async_migrate_func(self, old_major_version: int, old_minor_version: int, data: dict):

        def migrate_automation(data):
            pass

        return data


class haviewaccessStorage:

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.codes: MutableMapping[str, DigicodeCodeEntry] = {}
        self._store = MigratableStore(hass, STORAGE_VERSION_MAJOR, STORAGE_KEY, minor_version=STORAGE_VERSION_MINOR)

    async def async_load(self) -> None:
        data = await self._store.async_load()
        codes: "OrderedDict[str, DigicodeCodeEntry]" = OrderedDict()

        if data is not None:

            if "codes" in data:
                for code in data["codes"]:
                    codes[code["code_id"]] = DigicodeCodeEntry(**omit(code,['']))

        self.codes = codes

    @callback
    def async_schedule_save(self) -> None:
        self._store.async_delay_save(self._data_to_save, SAVE_DELAY)

    async def async_save(self) -> None:
        await self._store.async_save(self._data_to_save())

    @callback
    def _data_to_save(self) -> dict:
        store_data = {
            "config": attr.asdict(self.config),
        }

        store_data["users"] = [
            attr.asdict(entry) for entry in self.users.values()
        ]
        store_data["codes"] = [
            attr.asdict(entry) for entry in self.codes.values()
        ]
        store_data["messages"] = [
            attr.asdict(entry) for entry in self.messages.values()
        ]

        return store_data

    @callback
    def async_get_code(self, code_id) -> DigicodeCodeEntry:
        res = self.codes.get(code_id)
        return attr.asdict(res) if res else None

    @callback
    def async_get_codes(self):
        res = {}
        for (key, val) in self.codes.items():
            res[key] = attr.asdict(val)
        return res

    @callback
    def async_create_code(self, data: dict) -> DigicodeCodeEntry:
        code_id = str(int(time.time()))
        new_code = DigicodeCodeEntry(**data, code_id=code_id)
        self.codes[code_id] = new_code
        self.async_schedule_save()
        return new_code

    @callback
    def async_delete_code(self, code_id: str) -> None:
        if code_id in self.codes:
            del self.codes[code_id]
            self.async_schedule_save()
            return True
        return False

    @callback
    def async_update_code(self, code_id: str, changes: dict) -> DigicodeCodeEntry:
        old = self.codes[code_id]
        new = self.codes[code_id] = attr.evolve(old, **changes)

        self.async_schedule_save()
        return new

async def async_get_registry(hass: HomeAssistant) -> haviewaccessStorage:
    task = hass.data.get(DATA_REGISTRY)

    if task is None:

        async def _load_reg() -> haviewaccessStorage:
            registry = haviewaccessStorage(hass)
            await registry.async_load()
            return registry

        task = hass.data[DATA_REGISTRY] = hass.async_create_task(_load_reg())

    return cast(haviewaccessStorage, await task)
