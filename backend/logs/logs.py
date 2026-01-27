from loguru import logger
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
log_file_path = os.path.join(current_dir, 'app.log')

logger.add(
    log_file_path,
    format = "{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <6} | {process.name}:{thread.name} | {file}:{line: <4} | {message}",
    level = "INFO",
    rotation = "10 MB",
    retention = "7 days",
    compression = "zip"
)

