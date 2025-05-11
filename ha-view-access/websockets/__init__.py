import voluptuous as vol
import logging

from homeassistant.components.websocket_api import async_register_command,decorators
from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .codes import haviewaccessCodeView, websocket_get_codes, async_register_code

_LOGGER = logging.getLogger(__name__)


@callback
@decorators.websocket_command({
    vol.Required("type"): "haviewaccess_config_updated",
})
@decorators.async_response
async def handle_subscribe_updates(hass, connection, msg):

    @callback
    def async_handle_event():
        connection.send_message({
            "id": msg["id"],
            "type": "event",
        })

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass,
        "haviewaccess_update_frontend",
        async_handle_event
    )
    connection.send_result(msg["id"])


async def async_register_websockets(hass):
    async_register_command(
        hass,
        handle_subscribe_updates
    )
    # hass.http.register_view(haviewaccessView)

    async_register_code(hass)
