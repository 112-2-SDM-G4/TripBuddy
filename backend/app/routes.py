# import your controller here
from app.controllers.TripManager import TripManager, AITripGeneration, WeatherManager
from tests.test import Test
from app.controllers.Base import ExampleController, GetTags
from app.controllers.PlaceManager import PlaceSearch, PlaceDetail, PlaceInTrip
from app.controllers.UserManager import SendVerifyEmail, UserVerification, SetUserInfo, LoginCheckUser, LoginCheckPassword, ForgetPassword, ResetPassword, GetUserInfo, HandleGoogleLogin, HandleGoogleLoginCallback
from app.controllers.LedgerManager import Currency
from app.controllers.PostManager import PostManager, HeartManager
from app.controllers.GroupManager import SetGroupMember
from app.controllers.LedgerManager import ManageTransaction, CheckBalance
# from app.controllers.SocketTripManager import SocketTripManager
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
    api.add_resource(WeatherManager, 
                     f'{BASE_ROUTE}/weather',
                     f'{BASE_ROUTE}/weather/<string:trip_id>')
    api.add_resource(AITripGeneration, f'{BASE_ROUTE}/trip/ai_generate')
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
    api.add_resource(HandleGoogleLogin, f'{BASE_ROUTE}/user/google_login')
    api.add_resource(HandleGoogleLoginCallback, f'{BASE_ROUTE}/user/google_login/callback')
    api.add_resource(Currency, f'{BASE_ROUTE}/ledger/change_currency')
    api.add_resource(GetTags, f'{BASE_ROUTE}/tag/get_tags')
    api.add_resource(PostManager, f'{BASE_ROUTE}/post/<string:trip_id>',
                     f'{BASE_ROUTE}/post')
    api.add_resource(HeartManager, f'{BASE_ROUTE}/heart/<string:trip_id>')
    api.add_resource(SetGroupMember, f'{BASE_ROUTE}/group/set_group_member')
    api.add_resource(ManageTransaction, f'{BASE_ROUTE}/ledger/manage_transaction')
    api.add_resource(CheckBalance, f'{BASE_ROUTE}/ledger/check_balance')
    api.add_resource(GetUserInfo, f'{BASE_ROUTE}/user/get_info')
    # api.add_resource(SocketTripManager, f'{BASE_ROUTE}/socket_trip')