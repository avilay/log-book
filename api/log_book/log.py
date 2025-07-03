from __future__ import annotations

import logging
import os
import random
import sqlite3 as sq3
from datetime import datetime, timedelta, timezone
from typing import Any, Sequence

import shortuuid
from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict, field_serializer, field_validator
from pydantic.alias_generators import to_camel

load_dotenv()

logger = logging.getLogger(__name__)


class Log(BaseModel):
    user_id: str | None = None
    log_id: str | None = None
    created_at_utc: datetime
    activity: str

    @field_validator("created_at_utc", mode="after")
    @classmethod
    def ensure_utc(cls, val: Any) -> datetime:
        if isinstance(val, datetime) and val.tzinfo == timezone.utc:
            return val
        else:
            raise ValueError(f"{val} must be a datetime object in UTC!")

    @field_serializer("created_at_utc")
    def serialize_timestamp(self, created_at_utc: datetime, _info) -> str:
        return created_at_utc.isoformat(timespec="minutes")

    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_alias=True,
        validate_by_name=True,
        serialize_by_alias=True,
    )

    @staticmethod
    def log_factory(cursor: sq3.Cursor, row: sq3.Row) -> Log:
        fields = [col[0] for col in cursor.description]
        return Log.model_validate({k: v for k, v in zip(fields, row)})


class LogService:
    def __init__(self, semver: str):
        db = os.environ["DB"].format(semver=semver)
        self.conn = sq3.connect(db)
        self.conn.row_factory = Log.log_factory

    def new_log(self, user_id: str, log: Log) -> Log:
        log.log_id = shortuuid.uuid()
        log.user_id = user_id
        logger.debug(log.model_dump(by_alias=False))
        self.conn.execute(
            """
            INSERT INTO logs (user_id, log_id, created_at_utc, activity)
            VALUES (:user_id, :log_id, :created_at_utc, :activity)
            """,
            log.model_dump(by_alias=False),
        )
        self.conn.commit()
        return log

    def logs(
        self, user_id, from_ds: datetime | None = None, to_ds: datetime | None = None
    ) -> Sequence[Log]:
        sql = """
        SELECT user_id, log_id, created_at_utc, activity
        FROM logs
        WHERE user_id = :user_id
        """
        params = {"user_id": user_id}

        if from_ds:
            sql += " AND created_at_utc >= :from_ds"
            params["from_ds"] = from_ds.isoformat(timespec="minutes")

        if to_ds:
            sql += " AND created_at_utc <= :to_ds"
            params["to_ds"] = to_ds.isoformat(timespec="minutes")
        logger.debug(params)
        return self.conn.execute(sql, params).fetchall()

    def update_log(self, updated_log: Log) -> None:
        self.conn.execute(
            """
            UPDATE logs
            SET created_at_utc = :created_at_utc, activity = :activity
            WHERE log_id = :log_id AND user_id = :user_id
            """,
            updated_log.model_dump(by_alias=False),
        )
        self.conn.commit()

    def delete_log(self, user_id: str, log_id: str) -> None:
        self.conn.execute(
            "DELETE FROM logs WHERE log_id = ? AND user_id = ?",
            (log_id, user_id),
        )
        self.conn.commit()

    def gen_demo(self, user_id: str) -> None:
        logs: list[dict[str, Any]] = []
        now = datetime.now(timezone.utc)
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
                days=random.randint(0, 4),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59),
            )
            created_at = now - delta
            activity = random.choice(activities)
            log = Log(
                user_id=user_id,
                log_id=log_id,
                created_at_utc=created_at,
                activity=activity,
            )
            logs.append(log.model_dump(by_alias=False))
        self.conn.executemany(
            """
            INSERT INTO logs (user_id, log_id, created_at_utc, activity)
            VALUES (:user_id, :log_id, :created_at_utc, :activity)
            """,
            logs,
        )
        self.conn.commit()
