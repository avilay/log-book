import configparser
import logging
import traceback
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Annotated, Sequence

import firebase_admin
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from firebase_admin import auth
from firebase_admin._auth_utils import InvalidIdTokenError
from log_book.log import Log, LogService
from starlette.middleware.base import BaseHTTPMiddleware

# Default log file path
DEFAULT_LOG_PATH = "/var/log/logbook-api/access.log"


def get_log_file_path():
    """Parse the uvicorn logger config to get the log file path."""
    config_path = Path("../uvicorn_logger.ini")

    if not config_path.exists():
        return DEFAULT_LOG_PATH

    config = configparser.ConfigParser()
    config.read(config_path)

    try:
        args_str = config["handler_logfile"]["args"]
        # Strip leading ( and split on comma to get first element
        # From "('/var/log/logbook-api/access.log','a')" -> "'/var/log/logbook-api/access.log'"
        first_arg = args_str.lstrip("(").split(",")[0]
        # Strip quotes
        return first_arg.strip("'\"")
    except Exception:
        return DEFAULT_LOG_PATH


load_dotenv()

log_file_path = get_log_file_path()
handlers = [logging.FileHandler(log_file_path)]
logformat = "%(asctime)s:%(levelname)s:%(name)s:%(message)s"
logging.basicConfig(
    format=logformat,
    level=logging.DEBUG,
    handlers=handlers,
)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

log_svc = LogService("1.0.0")

fb_app = firebase_admin.initialize_app()


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            body = await request.body()
            x_token = request.headers.get("x-token", "None")
            logger.debug(
                f"Incoming request: {request.method} {request.url}\n\tX-Token: {x_token}\n\tPayload: {body.decode('utf-8')}"
            )
        except Exception as e:
            logger.warning(f"Could not read request body: {e}")

        try:
            response = await call_next(request)
            return response
        except InvalidIdTokenError as tok_err:
            logger.error(f"Exception during request: {tok_err}")
            logger.error(traceback.format_exc())
            return JSONResponse(status_code=400, content={"detail": "Invalid token!"})
        except Exception as exc:
            logger.error(f"Exception during request: {exc}")
            logger.error(traceback.format_exc())
            return JSONResponse(
                status_code=500, content={"detail": "Internal Server Error"}
            )


app.add_middleware(LoggingMiddleware)


@app.get("/version")
async def version() -> str:
    return "0.0.1"


@app.get("/logs")
async def logs(
    x_token: Annotated[str | None, Header()],
    days: int = 3,
    offset_days: int = 0
) -> Sequence[Log]:
    token = auth.verify_id_token(x_token)
    uid = token["uid"]

    # Calculate date range for pagination
    now = datetime.now(timezone.utc)
    to_ds = now - timedelta(days=offset_days)
    from_ds = now - timedelta(days=offset_days + days)

    logger.info(f"Fetching logs for user {uid} from {from_ds} to {to_ds}")

    all_logs = sorted(
        log_svc.logs(uid, from_ds, to_ds), key=lambda log: log.created_at_utc, reverse=True
    )
    if not all_logs:
        logger.info(f"No logs to process for user {uid} in date range")
    return all_logs


@app.post("/logs")
async def new_log(x_token: Annotated[str | None, Header()], log: Log) -> Log:
    token = auth.verify_id_token(x_token)
    uid = token["uid"]
    logger.info(f"Creating a new log {log} for user {uid}")
    return log_svc.new_log(uid, log)


@app.delete("/logs/{log_id}")
async def delete_log(x_token: Annotated[str | None, Header()], log_id: str) -> None:
    token = auth.verify_id_token(x_token)
    uid = token["uid"]
    logger.info(f"Deleting log {log_id} for user {uid}")
    log_svc.delete_log(uid, log_id)
    return


@app.put("/logs")
async def update_log(x_token: Annotated[str | None, Header()], log: Log) -> None:
    token = auth.verify_id_token(x_token)
    uid = token["uid"]
    logger.info(f"Updating log {log.log_id} for user {uid}")
    try:
        log_svc.update_log(log)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return


@app.get("/gen-demo")
async def gen_demo(x_token: Annotated[str | None, Header()]) -> None:
    token = auth.verify_id_token(x_token)
    uid = token["uid"]
    logger.info(f"Generating demo data for user {uid}")
    log_svc.gen_demo(uid)


if __name__ == "__main__":
    print("hello!")
