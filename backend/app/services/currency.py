# ref: https://www.exchangerate-api.com/
from typing import Optional
import requests

def change_currency(standard: str, exchange: str) -> Optional[float]:
    """Get exchange rate for `exchange` dollar in `standard` dollar"""
    url = f'https://api.exchangerate-api.com/v4/latest/{exchange}'
    try:
        res = requests.get(url)
        data = res.json()
        rate = data['rates'][standard]
    except: # invalid currency code
        rate = None
    return rate
