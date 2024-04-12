from datetime import datetime, date, timedelta

def array_to_date(array):
    return date(array[0], array[1], array[2])

def date_to_array(date):
    return [date.year, date.month, date.day]

def check_date_status(start_date, end_date):
    # -1: past, 0: else, 1: current, 2: in 7 days
    today = datetime.now().date()
    if end_date < today:
        return -1
    elif start_date <= today and end_date >= today:
        return 1
    elif start_date < today + timedelta(days=7):
        return 2
    else:
        return 0
    
def str_to_array(string, t=','):
    return string.split(t)

def array_to_str(array, t=','):
    return t.join(array)