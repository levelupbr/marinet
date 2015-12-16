'use strict';

module.exports =  {
    "NOT_FOUND": {"code": 404, "error": "Not Found", "reason": "Request not found"},
    "FORBIDDEN": {"code": 403, "error": "Forbidden ", "reason": "I’m sorry. I know who you are. I believe who you say you are, but you just don’t have permission to access this resource. Maybe if you ask the system administrator nicely, you’ll get permission. But please don’t bother me again until your predicament changes."},
    "UNAUTHORIZED": {"code": 401, "error": "Unauthorized", "reason": "You aren’t authenticated. Either not authenticated at all or authenticated incorrectly, please reauthenticate and try again."},
    "DEFAULT": {"code": 503, "error": "bad_gateway", "reason": "You aren’t authenticated. Either not authenticated at all or authenticated incorrectly, please reauthenticate and try again."}
};
