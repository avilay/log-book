import logging
from datetime import date, datetime
from itertools import groupby
from typing import Any, Sequence

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, model_serializer
from starlette.middleware.base import BaseHTTPMiddleware

from backend.log import Log, LogService


class GroupedLogs(BaseModel):
    datestamp: date
    logs: list[Log]

    @model_serializer
    def ser(self) -> dict[str, Any]:
        if self.datestamp.year == datetime.now().year:
            ds = self.datestamp.strftime("%a, %b %d")
        else:
            ds = self.datestamp.strftime("%a, %b %d, %Y")
        return {
            "datestamp": ds,
            "logs": [
                {
                    "logId": log.log_id,
                    "timestamp": log.timestamp.strftime("%I:%M %p"),
                    "activity": log.activity,
                }
                for log in self.logs
            ],
        }


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

            if request.method == "POST" or request.method == "PUT":
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
    if grouped:
        grouped_logs = [
            GroupedLogs(datestamp=ds, logs=list(glogs))
            for ds, glogs in groupby(all_logs, key=lambda log: log.timestamp.date())
        ]
        return grouped_logs
    return all_logs


@app.post("/logs")
async def new_log(log: Log) -> Log:
    return log_svc.new_log(log)
