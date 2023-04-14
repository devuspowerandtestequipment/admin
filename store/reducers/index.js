import {combineReducers} from 'redux'
import { postReducer } from './postReduer'
import brandReducer from './brandReducer'
import categoryReducer from './categoryReducer'
import subcategoryReducer from './subcategoryReducer'
import childcategoryReducer from './childcategoryReducer'
import attributeReducer from './attributeReducer'
import taxReducer from './taxReducer'
import productReducer from './productReducer'
import dynamicDatasReducer from './dynamicDatasReducer'
import authReducer from './authReducer'
import shippingReducer from './shippingReducer'
import couponReducer from './couponReducer'
import orderReducer from './orderReducer'
import courierReducer from './courierReducer'
import userReducer from './userReducer'
import blogReducer from './blogReducer'
import loginrecordReducer from './loginrecordReducer'
import emailReducer from './emailReducer'
import notificationReducer from './notificationReducer'
import pageviewsReducer from './pageviewsReducer'
import cartitemsReducer from './cartitemsReducer'
import reviewReducer from './reviewReducer'
import userLastVisitedProductsReducer from './userLastVisitedProductsReducer'
import paymentHistoryReducer from './paymentHistoryReducer'

export default combineReducers({
    auth:authReducer,
    dynamic_datas:dynamicDatasReducer,
    post:postReducer,
    all_brands:brandReducer,
    all_category:categoryReducer,
    all_subcategory:subcategoryReducer,
    all_childcategory:childcategoryReducer,
    all_attributes:attributeReducer,
    all_taxes:taxReducer,
    all_coupons:couponReducer,
    all_shippings:shippingReducer,
    all_products:productReducer,
    all_orders:orderReducer,
    all_couriers:courierReducer,
    all_users:userReducer,
    all_blogs:blogReducer,
    all_loginrecords:loginrecordReducer,
    all_emails:emailReducer,
    all_notifications:notificationReducer,
    all_pageviews:pageviewsReducer,
    all_cartitems:cartitemsReducer,
    all_reviews:reviewReducer,
    all_user_last_visited_productlist:userLastVisitedProductsReducer,
    all_payment_history:paymentHistoryReducer
})