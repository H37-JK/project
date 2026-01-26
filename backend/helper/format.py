import datetime

def format_date(date):
    if isinstance(date, list):
        date = date[0]

    if isinstance(date, datetime.datetime):
        return date.strftime("%Y-%m-%d %H:%M:%S")

    if isinstance(date, str):
        return date.replace("T", " ")

    return str(date) if date else "Unknown"


def format_list(value):
    if isinstance(value, list):
        return ", ".join(str(v) for v in value)
    return str(value) if value else "Unknown"