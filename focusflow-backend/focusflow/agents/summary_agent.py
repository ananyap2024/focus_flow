from typing import List
from focusflow.models.notification import NotificationBase
import logging
import os
import google.generativeai as genai


# Configure logger
logger = logging.getLogger(__name__)

class SummaryAgent:
    def __init__(self):
        # ... (init code remains similar but cleaner)
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            logger.warning("GEMINI_API_KEY not found. Summary agent will use fallback.")
            self.model = None

    def summarize(self, notifications: List[NotificationBase]) -> str:
        """
        Summarizes queued notifications using Gemini.
        Falls back to simple count if Gemini fails or is not configured.
        """
        if not notifications:
            return "No notifications to summarize."

        count = len(notifications)
        fallback_text = f"You missed {count} notifications while focusing."

        if not self.model:
            return fallback_text

        try:
            prompt = "Summarize the following missed notifications for a user who just finished a focus session. Group them by app and highlight anything important:\n\n"
            for n in notifications:
                prompt += f"- App: {n.app_name}, Title: {n.title}, Message: {n.message}\n"

            response = self.model.generate_content(prompt)
            if response.text:
                return response.text
            else:
                raise ValueError("Empty response from Gemini")
        except Exception as e:
            logger.error(f"Gemini summarization failed: {e}")
            return fallback_text

