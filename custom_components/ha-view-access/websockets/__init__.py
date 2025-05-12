import pprint
from typing import Any
import voluptuous as vol
import logging
import json

from homeassistant.components.websocket_api import async_register_command,decorators
from homeassistant.core import callback
from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .codes import haviewaccessCodeView, websocket_get_codes, async_register_code

_LOGGER = logging.getLogger(__name__)


def make_serializable(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: make_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_serializable(item) for item in obj]
    elif isinstance(obj, tuple):
        return [make_serializable(item) for item in obj]
    elif isinstance(obj, set):
        return [make_serializable(item) for item in obj]
    elif hasattr(obj, '__dict__'):
        # Pour les objets personnalisés, convertir en dict
        return make_serializable(obj.__dict__)
    elif isinstance(obj, (str, int, float, bool, type(None))):
        # Ces types sont déjà JSON serializables
        return obj
    else:
        # Pour les autres types, convertir en string
        try:
            return str(obj)
        except Exception:
            return None



async def get_lovelace_config(hass):
    """Récupère la configuration Lovelace via l'API WebSocket."""

    _LOGGER.info(make_serializable(hass.data.items()))
    panels = hass.data.get("frontend_panels", {})
    lovelace_panels = {}

    #_LOGGER.info(make_serializable(panels.items()))
    for panel_name, panel_data in panels.items():
        if panel_name == "lovelace" or (hasattr(panel_data, "component_name") and panel_data.component_name == "lovelace"):
            lovelace_panels[panel_name] = {
                "name": panel_name
            }

    return lovelace_panels

    # result = await hass.data["websocket_api"].async_call_websocket_command({
    #     "type": "lovelace/config",
    #     "url_path": url_path,
    # })
    #
    # if "result" in result:
    #     return result["result"]
        # try:
        #     serializable_result = json.loads(json.dumps(result["result"]))
        #     return serializable_result
        # except (TypeError, ValueError, IOError) as json_err:
        #     _LOGGER.warning("La réponse contient des objets non-serializables, nettoyage en cours: %s", json_err)
        #
        #     return make_serializable(result["result"])

        # dashboard_info = []
        #
        # for dashboard_name, dashboard_data in result["result"]['views'].items():
        #     dashboard_info.append({
        #         "name": dashboard_name,
        #         "path": dashboard_data['path'],
        #         "title": dashboard_data['title']
        #         #"visible": dashboard_data['visible']
        #     })
        #
        # return dashboard_info
    return None

class HaViewAccessCodeView(HomeAssistantView):
    url = "/api/pidoorbell/codes"
    name = "api:pidoorbell:codes"

#    @RequestDataValidator(CodeRequestDataValidator())
    async def post(self, request):
        hass = request.app["hass"]
        result = await get_lovelace_config(hass)
        # result = hass.services.call(
        #     "lovelace",
        #     "get_panels",
        #     {}
        # )
        # print(result)
        #coordinator = hass.data[const.DOMAIN]["coordinator"]
        # code_id = None
        # if const.ATTR_CODE_ID in data:
        #     code_id = data[const.ATTR_CODE_ID]
        #     del data[const.ATTR_CODE_ID]
        # coordinator.async_update_code_config(code_id, data)
        # async_dispatcher_send(hass, "pidoorbell_update_frontend")
        return self.json({"success": result})

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
    hass.http.register_view(HaViewAccessCodeView)
    async_register_command(
        hass,
        handle_subscribe_updates
    )

    async_register_code(hass)
