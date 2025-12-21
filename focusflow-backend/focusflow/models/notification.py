from enum import Enum
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationDecision(str, Enum):
    ALLOW = "ALLOW"
    QUEUE = "QUEUE"

class NotificationBase(BaseModel):
    app_name: str
    title: str
    message: str
    timestamp: Optional[datetime] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    decision: NotificationDecision
    reason: str
