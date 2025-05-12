import voluptuous as vol
import logging

from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import async_register_command
from homeassistant.core import callback
from homeassistant.components.http.data_validator import RequestDataValidator
from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .. import const
from ..store.code import CodeRequestDataValidator

_LOGGER = logging.getLogger(__name__)


class haviewaccessCodeView(HomeAssistantView):
    url = "/api/haviewaccess/get_panels"
    name = "api:haviewaccess:get_panels"

    @RequestDataValidator(CodeRequestDataValidator())
    async def post(self, request, data):
        hass = request.app["hass"]
        coordinator = hass.data[const.DOMAIN]["coordinator"]
        code_id = None
        if const.ATTR_CODE_ID in data:
            code_id = data[const.ATTR_CODE_ID]
            del data[const.ATTR_CODE_ID]
        coordinator.async_update_code_config(code_id, data)
        async_dispatcher_send(hass, "haviewaccess_update_frontend")
        return self.json({"success": True})


@callback
def websocket_get_codes(hass, connection, msg):
    coordinator = hass.data[const.DOMAIN]["coordinator"]
    result = hass.services.call(
        "lovelace",
        "get_panels",
        {}
    )

    connection.send_result(msg["id"], result)


def async_register_code(hass):
    hass.http.register_view(haviewaccessCodeView)
    async_register_command(
        hass,
        "haviewaccess/codes",
        websocket_get_codes,
        None
        #websocket_api.BASE_COMMAND_MESSAGE_SCHEMA.extend(
            # {vol.Required("type"): "haviewaccess/codes"}
        #),
    )
