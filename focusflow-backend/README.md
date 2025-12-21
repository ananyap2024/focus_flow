# FocusFlow Backend

An autonomous, agent-based backend that prioritizes notifications during focus sessions and summarizes missed notifications using Google Gemini.

## Features

- **Focus Agent**: Determines user context.
- **Classification Agent**: Deterministically filters notifications (ALLOW vs QUEUE).
- **Summary Agent**: Uses Gemini AI to summarize queued notifications.
- **Notification Service**: Orchestrates the agent workflow.

## Architecture

The system uses a layered architecture:
- **Routes**: API endpoints (`/api/notify`, `/api/summary`)
- **Services**: Orchestration logic (`NotificationService`)
- **Agents**: Specialized logic units (`FocusAgent`, `ClassificationAgent`, `SummaryAgent`)
- **Storage**: In-memory queue (MVP)

## Project Structure

```
focusflow-backend/
├── focusflow/
│   ├── agents/         # AI/Logic agents
│   ├── models/         # Pydantic models
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic orchestrator
│   ├── storage/        # Data persistence
│   └── main.py         # App entry point
```

## Setup & Running

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   - Create a `.env` file (see `.env.example` or just `.env`)
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_key_here
     ```

3. **Run Locally**
   ```bash
   uvicorn focusflow.main:app --reload
   ```
   Access API docs at `http://127.0.0.1:8000/docs`.

## Deployment (Railway)

1. Connect your repo to Railway.
2. Set the `GEMINI_API_KEY` environment variable in Railway.
3. Set the start command to:
   ```bash
   uvicorn focusflow.main:app --host 0.0.0.0 --port $PORT
   ```
