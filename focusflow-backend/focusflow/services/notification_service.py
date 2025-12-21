from focusflow.agents.focus_agent import FocusAgent
from focusflow.agents.classification_agent import ClassificationAgent
from focusflow.agents.summary_agent import SummaryAgent
from focusflow.storage.queue import NotificationQueue
from focusflow.models.notification import NotificationCreate, NotificationResponse, NotificationDecision

class NotificationService:
    def __init__(self):
        self.focus_agent = FocusAgent()
        self.classification_agent = ClassificationAgent()
        self.summary_agent = SummaryAgent()
        self.queue = NotificationQueue()

    def handle_notification(self, notification_data: NotificationCreate, focus_mode: bool) -> NotificationResponse:
        """
        Orchestrates the handling of a new notification.
        """
        # 1. Determine Context (passed in or determined by FocusAgent)
        is_focused = self.focus_agent.is_focus_mode({"focus_mode": focus_mode})

        # 2. Classify
        decision, reason = self.classification_agent.classify(notification_data, is_focused)

        # 3. Action
        if decision == NotificationDecision.QUEUE:
            self.queue.add(notification_data)

        return NotificationResponse(
            **notification_data.model_dump(),
            decision=decision,
            reason=reason
        )

    def get_summary(self) -> dict:
        """
        Retrieves summarized notifications and clears the queue.
        """
        notifications = self.queue.get_all()
        count = len(notifications)
        summary = self.summary_agent.summarize(notifications)
        # Typically we might want to clear or archive. For this MVP, we clear after summary.
        self.queue.clear()
        return {
            "total_notifications": count,
            "summary": summary
        }

