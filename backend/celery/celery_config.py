from celery import Celery
from datetime import timedelta

app = Celery (
    'monitor_app',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0',
    include=['backend.celery.tasks']
)

app.conf.update (
    result_expires=3600,
    timezone='Asia/Seoul',
)

app.conf.beat_schedule = {
    'schedule-every-10-seconds': {
        'task': 'backend.celery.tasks.schedule_monitoring_tasks',
        'schedule': timedelta(seconds = 10)
    }
}