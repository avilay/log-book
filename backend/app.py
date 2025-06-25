import logging
from datetime import datetime
from itertools import groupby
from typing import Sequence

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_serializer
from starlette.middleware.base import BaseHTTPMiddleware

from backend.log import Log, LogService


class GroupedLogs(BaseModel):
    datestamp: datetime
    logs: list[Log]

    @field_serializer("datestamp")
    def serialize_datestamp(self, datestamp: datetime, _info) -> str:
        return datestamp.isoformat(timespec="minutes")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

handlers = [logging.StreamHandler()]
logformat = "%(asctime)s:%(levelname)s:%(name)s:%(message)s"
logging.basicConfig(
    format=logformat,
    level=logging.DEBUG,
    handlers=handlers,
)
logger = logging.getLogger(__name__)

log_svc = LogService()


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            body = await request.body()

            if (
                request.method == "POST"
                or request.method == "PUT"
                or request.method == "DELETE"
            ):
                logger.info(
                    f"Incoming request: {request.method} {request.url} Payload: {body.decode('utf-8')}"
                )
        except Exception as e:
            logger.warning(f"Could not read request body: {e}")
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            logger.error(f"Exception during request: {exc}")
            return JSONResponse(
                status_code=500, content={"detail": "Internal Server Error"}
            )


app.add_middleware(LoggingMiddleware)


@app.get("/logs")
async def logs(grouped=False) -> Sequence[Log] | Sequence[GroupedLogs]:
    all_logs = sorted(log_svc.logs(), key=lambda log: log.timestamp, reverse=True)
    tz = all_logs[0].timestamp.tzinfo
    if grouped:
        grouped_logs = [
            GroupedLogs(
                datestamp=datetime(year=ds.year, month=ds.month, day=ds.day, tzinfo=tz),
                logs=list(glogs),
            )
            for ds, glogs in groupby(all_logs, key=lambda log: log.timestamp.date())
        ]
        return grouped_logs
    return all_logs


@app.post("/logs")
async def new_log(log: Log) -> Log:
    return log_svc.new_log(log)


@app.delete("/logs/{log_id}")
async def delete_log(log_id: str) -> None:
    log_svc.delete_log(log_id)
    return


@app.put("/logs")
async def update_log(log: Log) -> None:
    try:
        log_svc.update_log(log)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return
