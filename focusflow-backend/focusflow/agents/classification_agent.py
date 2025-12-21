from focusflow.models.notification import NotificationBase, NotificationDecision

class ClassificationAgent:
    def __init__(self):
        self.urgent_apps = {"calendar", "slack", "phone", "pagerduty"}

    def classify(self, notification: NotificationBase, is_focused: bool) -> tuple[NotificationDecision, str]:
        """
        Classifies the notification as ALLOW or QUEUE.
        Returns a tuple of (Decision, Reason).
        """
        if not is_focused:
            return NotificationDecision.ALLOW, "User is not in focus mode."

        app_lower = notification.app_name.lower()
        
        if any(urgent in app_lower for urgent in self.urgent_apps):
            return NotificationDecision.ALLOW, f"App '{notification.app_name}' is marked as urgent."
        
        return NotificationDecision.QUEUE, "Focus mode is active and app is not urgent."
