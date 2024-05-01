# import your controller here
from app.controllers.TripManager import TripManager
from tests.test import Test
from app.controllers.Base import ExampleController, GetTags
from app.controllers.PlaceManager import PlaceSearch, PlaceDetail, PlaceInTrip
from app.controllers.UserManager import SendVerifyEmail, UserVerification, SetUserInfo, LoginCheckUser, LoginCheckPassword, ForgetPassword, ResetPassword
from app.controllers.LedgerManager import Currency
from app.controllers.PostManager import PostManager, HeartManager
from app.controllers.GroupManager import SetGroupMember
from app.controllers.LedgerManager import ManageTransaction
from flask_restful import Api

BASE_ROUTE = '/api/v1'

# Add routes for controllers here
def initialize_routes(api: Api):
    api.add_resource(Test, f'{BASE_ROUTE}/test')
    api.add_resource(ExampleController, f'{BASE_ROUTE}/example/<string:id>')
    api.add_resource(TripManager, 
                     f'{BASE_ROUTE}/trip',
                     f'{BASE_ROUTE}/trip/<string:trip_id>',
                     f'{BASE_ROUTE}/trip/<string:trip_id>/<string:lang>')
    api.add_resource(PlaceSearch, f'{BASE_ROUTE}/place/search')
    api.add_resource(PlaceDetail, f'{BASE_ROUTE}/place/detail')
    api.add_resource(PlaceInTrip, f'{BASE_ROUTE}/single_place/<string:trip_id>',
                     f'{BASE_ROUTE}/single_place/<string:trip_id>/<string:relation_id>')
    api.add_resource(SendVerifyEmail, f'{BASE_ROUTE}/user/send_email')
    api.add_resource(UserVerification, f'{BASE_ROUTE}/user/verify')
    api.add_resource(SetUserInfo, f'{BASE_ROUTE}/user/set_info')
    api.add_resource(LoginCheckUser, f'{BASE_ROUTE}/user/check_user')
    api.add_resource(LoginCheckPassword, f'{BASE_ROUTE}/user/check_password')
    api.add_resource(ForgetPassword, f'{BASE_ROUTE}/user/forget_password')
    api.add_resource(ResetPassword, f'{BASE_ROUTE}/user/reset_password')
    api.add_resource(Currency, f'{BASE_ROUTE}/ledger/change_currency')
    api.add_resource(GetTags, f'{BASE_ROUTE}/tag/get_tags')
    api.add_resource(PostManager, f'{BASE_ROUTE}/post/<string:trip_id>',
                     f'{BASE_ROUTE}/post')
    api.add_resource(HeartManager, f'{BASE_ROUTE}/heart/<string:trip_id>')
    api.add_resource(SetGroupMember, f'{BASE_ROUTE}/schdule/set_goup_member')
    api.add_resource(ManageTransaction, f'{BASE_ROUTE}/ledger/add_transaction')