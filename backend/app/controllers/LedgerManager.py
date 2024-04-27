from flask_restful import Resource
from flask import request, make_response
from typing import Dict
from app.services.currency import change_currency

class Currency(Resource):
    def get(self) -> Dict:
        standard = request.args.get('standard')
        exchange = request.args.get('exchange')
        exchange_rate = change_currency(standard, exchange)
        if exchange_rate:
            return make_response({'exchange_rate': exchange_rate}, 200)
        else:
            return make_response({'exchange_rate': exchange_rate}, 400)
