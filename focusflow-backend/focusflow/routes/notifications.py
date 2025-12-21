from fastapi import APIRouter, Depends, Query
from focusflow.models.notification import NotificationCreate, NotificationResponse
from focusflow.services.notification_service import NotificationService

router = APIRouter()

# Dependency for service injection (Singleton-ish for MVP)
_service = NotificationService()
def get_notification_service():
    return _service

@router.post("/notify", response_model=NotificationResponse)
async def normalize_notification(
    notification: NotificationCreate,
    focus_mode: bool = Query(False, description="Is the user in focus mode?"),
    service: NotificationService = Depends(get_notification_service)
):
    """
    Ingest a new notification.
    """
    return service.handle_notification(notification, focus_mode)

@router.get("/summary")
async def get_summary(
    service: NotificationService = Depends(get_notification_service)
):
    """
    Get a summary of queued notifications.
    """
    """
    Get a summary of queued notifications.
    """
    return service.get_summary()

