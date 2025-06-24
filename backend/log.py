import random
from datetime import datetime, timedelta
from typing import Sequence

import shortuuid
from pydantic import BaseModel, ConfigDict, field_serializer
from pydantic.alias_generators import to_camel


class Log(BaseModel):
    log_id: str | None = None
    timestamp: datetime
    activity: str

    @field_serializer("timestamp")
    def serialize_timestamp(self, timestamp: datetime, _info) -> str:
        return timestamp.isoformat(timespec="minutes")

    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_alias=True,
        validate_by_name=True,
        serialize_by_alias=True,
    )


class LogService:
    def __init__(self):
        self._logs: dict[str, Log] = {}
        now = datetime.now()
        activities = [
            "Short",
            "A very long activity name",
            "what am I doing?",
            "Medium",
            "Need better names",
        ]
        for _ in range(50):
            log_id = shortuuid.uuid()
            delta = timedelta(
                days=random.randint(0, 49),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59),
            )
            created_at = now - delta
            activity = random.choice(activities)
            log = Log(log_id=log_id, timestamp=created_at, activity=activity)
            self._logs[log_id] = log

    def new_log(self, log: Log) -> Log:
        log.log_id = shortuuid.uuid()
        self._logs[log.log_id] = log
        return log

    def logs(
        self, from_ds: datetime | None = None, to_ds=datetime.now()
    ) -> Sequence[Log]:
        return list(self._logs.values())

    def log(self, log_id: str) -> Log | None:
        return self._logs.get(log_id, None)

    def update_log(self, updated_log: Log) -> None:
        if updated_log.log_id not in self._logs:
            raise ValueError(f"Log ID {updated_log.log_id} does not exist!")
        self._logs[updated_log.log_id] = updated_log

    def delete_log(self, log_id: str) -> None:
        del self._logs[log_id]
