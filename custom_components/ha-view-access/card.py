import logging
import voluptuous as vol

from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.components.websocket_api import decorators,async_register_command

from . import const

_LOGGER = logging.getLogger(__name__)


@decorators.websocket_command({
    vol.Required("type"): "haviewaccess_updated",
})
@decorators.async_response
async def handle_subscribe_updates(hass, connection, msg):

    @callback
    def handle_event(event: str, area_id: str, args: dict = {}):
        data = dict(**args, **{
            "event": event,
            "area_id": area_id
        })
        connection.send_message({
            "id": msg["id"],
            "type": "event",
            "event": {
                "data": data
            }
        })

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass,
        const.EVENT,
        handle_event
    )
    connection.send_result(msg["id"])


async def async_register_card(hass):
    async_register_command(
      hass,
      handle_subscribe_updates
    )
