import logging

from homeassistant.const import ATTR_CODE
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import DOMAIN ,ATTR_REMOVE

_LOGGER = logging.getLogger(__name__)


class haviewaccessCoordinator(DataUpdateCoordinator):

    def __init__(self, hass, store):
        self.hass = hass
        self.store = store
        super().__init__(hass, _LOGGER, name=DOMAIN)

    async def async_update_config(self, data):
        self.store.async_update_config(data)
        async_dispatcher_send(self.hass, "haviewaccess_config_updated")

    def async_update_user_config(self, user_id: str = None, data: dict = {}):
        if ATTR_REMOVE in data:
            self.store.async_delete_user(user_id)
            return

        if not user_id:
            self.store.async_create_user(data)
            return

        self.store.async_update_user(user_id, data)

    def async_move_user_config(self, user_id: str = None, direction: str = 'up'):
        self.store.async_move_user(user_id, direction)

    def async_update_code_config(self, code_id: str = None, data: dict = {}):
        if ATTR_REMOVE in data:
            self.store.async_delete_code(code_id)
            return

        if not code_id:
            self.store.async_create_code(data)
            return

        self.store.async_update_code(code_id, data)

    def async_update_message_config(self, message_id: str = None, data: dict = {}):
        if ATTR_REMOVE in data:
            self.store.async_delete_message(message_id)
            return

        if not message_id:
            self.store.async_create_message(data)
            return

        self.store.async_update_message(message_id, data)

    def async_authenticate_user(self, code: str, user_id: str = None):
        if not user_id:
            users = self.store.async_get_users()
        else:
            users = {
                user_id: self.store.async_get_user(user_id)
            }

        for (user_id, user) in users.items():
            if not user[const.ATTR_ENABLED]:
                continue
            elif not user[ATTR_CODE] and not code:
                return user
            elif user[ATTR_CODE]:
                if user[ATTR_CODE] == code:
                    return user

        return

    async def async_unload(self):
        pass


    async def async_delete_config(self):
        await self.store.async_delete()
