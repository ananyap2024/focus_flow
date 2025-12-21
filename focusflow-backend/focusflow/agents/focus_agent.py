class FocusAgent:
    def is_focus_mode(self, user_context: dict) -> bool:
        """
        Determines if the user is in focus mode.
        Simple boolean observer for MVP.
        """
        return user_context.get("focus_mode", False)
