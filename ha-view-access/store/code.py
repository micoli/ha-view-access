import attr
import voluptuous as vol

from homeassistant.helpers import config_validation as cv
from homeassistant.const import ATTR_NAME,ATTR_CODE

from .. import const


@attr.s(slots=True, frozen=True)
class DigicodeCodeEntry:
    code_id = attr.ib(type=str, default=None)
    name = attr.ib(type=str, default="")
    enabled = attr.ib(type=bool, default=True)
    code = attr.ib(type=str, default="")
    expiry = attr.ib(type=int, default=-1)
    comment = attr.ib(type=str, default="")

def CodeRequestDataValidator():
    return vol.Schema(
        {
            vol.Optional(const.ATTR_CODE_ID): cv.string,
            vol.Optional(const.ATTR_REMOVE): cv.boolean,
            vol.Optional(ATTR_NAME): cv.string,
            vol.Optional(const.ATTR_ENABLED): cv.boolean,
            vol.Optional(const.ATTR_EXPIRY): cv.string,
            vol.Optional(const.ATTR_COMMENT): cv.string,
            vol.Optional(ATTR_CODE): cv.string
        }
    )
