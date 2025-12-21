from typing import List, Deque
from collections import deque
from focusflow.models.notification import NotificationBase

class NotificationQueue:
    def __init__(self):
        self._queue: Deque[NotificationBase] = deque()

    def add(self, notification: NotificationBase):
        """Add a notification to the queue."""
        self._queue.append(notification)

    def get_all(self) -> List[NotificationBase]:
        """Retrieve all notifications from the queue."""
        return list(self._queue)

    def clear(self):
        """Clear all notifications from the queue."""
        self._queue.clear()
        
    def count(self) -> int:
        """Return the number of queued notifications."""
        return len(self._queue)
