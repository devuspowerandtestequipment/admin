import axios from 'axios';
import cookie from 'react-cookies'
import ls from 'localstorage-slim';
import * as ACTION  from '../types'


//CLEAR SINGLE NOTIFICATION
export const clearSingleNotificationByURL = (url) => async dispatch => { //not_used code:9658
    axios.get(`${process.env.backendURL}/user/admin_setseen_notifications_byurl/${url}`)
    .then(response=>{
        return true;
    })
}

export const clearSingleNotificationByUserId = (user_id) => async dispatch => { 
    axios.get(`${process.env.backendURL}/user/admin_setseen_notifications_byuserid/${user_id}`)
    .then(response=>{
        return true;
    })
}

export const clearSingleNotificationByMessage = (message) => async dispatch => { 
    axios.get(`${process.env.backendURL}/user/admin_setseen_notifications_bymessage/${message}`)
    .then(response=>{
        return true;
    })
}

export const clearSingleNotificationByMessageUser = (message,user_id) => async dispatch => { 
    axios.get(`${process.env.backendURL}/user/admin_setseen_notifications_bymessage_of_user/${message}/${user_id}`)
    .then(response=>{
        return true;
    })
}

//FETCH DYNAMIC DATAS
export const fetchDynamicDatas = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/dashboard/dynamicdatas`);
    dispatch({type:'DYNAMIC_DATAS', payload:response.data})
}


//FETCH DYNAMIC DATAS
export const fetchAuthUser = (user_id) => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/user/fetch_auth_user_admin/${user_id}`);
    ls.set(ACTION.AUTH_USER_INFORMATION, response.data.data, { ttl: 86400*365*10 }); //10 years data save
    dispatch({type:'SET_USER_INFORMATION', payload:response.data.data})
}

//SET AUTH USER
export const setAuthUser = (data) => async dispatch => {
    if(data===null){
        dispatch({type:'SET_USER_INFORMATION', payload:null})
        cookie.remove('ecomadmin_authuser7569', { path: '/' })
    }else{
        ls.set(ACTION.AUTH_USER_INFORMATION, data, { ttl: 86400*365*10 }); //10 years data save
        dispatch({type:'SET_USER_INFORMATION', payload:data})
        // cookie.save('ecomadmin_authuser7569', data)
    }
}




export const fetchBrands = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/brand`);
    // cookie.save('all_brands_999', response.data.datas)
    dispatch({type:'GET_ALL_BRANDS', payload:response.data.datas})
}

//FETCH ALL BRANDS
export const fetchAttributes = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/attribute`);
    // cookie.save('all_brands_999', response.data.datas)
    dispatch({type:'GET_ALL_ATTRIBUTES', payload:response.data.datas})
}


//FETCH ALL SUBCATEGORIES
export const fetchCategories = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/category`);
    // cookie.save('all_categories_999', response.data.datas)
    dispatch({type:'GET_ALL_CATEGORIES', payload:response.data.datas})
}


//FETCH ALL CATEGORIES
export const fetchSubCategories = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/subcategory`);
    // cookie.save('all_subcategories_999', response.data.datas)
    dispatch({type:'GET_ALL_SUBCATEGORIES', payload:response.data.datas})
}


//FETCH ALL CHILDCATEGORIES
export const fetchChildCategories = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/childcategory`);
    // cookie.save('all_subcategories_999', response.data.datas)
    dispatch({type:'GET_ALL_CHILDCATEGORIES', payload:response.data.datas})
}

//FETCH ALL TAXES
export const fetchTaxes = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/tax`);
    // cookie.save('all_subcategories_999', response.data.datas)
    dispatch({type:'GET_ALL_TAXES', payload:response.data.datas})
}


//FETCH ALL COUPONS
export const fetchCoupons = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/coupon`);
    // cookie.save('all_subcategories_999', response.data.datas)
    dispatch({type:'GET_ALL_COUPONS', payload:response.data.datas})
}

//FETCH ALL SHIPPING
export const fetchShipping = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/shipping`);
    // cookie.save('all_subcategories_999', response.data.datas)
    dispatch({type:'GET_ALL_SHIPPING', payload:response.data.datas})
}

//FETCH ALL SHIPPING
export const fetchShippingRules = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/shippingrule`);
    // cookie.save('all_subcategories_999', response.data.datas)
    dispatch({type:'GET_ALL_SHIPPING_RULE', payload:response.data.datas})
}

//FETCH ALL PRODUCTS
export const fetchProducts = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/product`);
    // cookie.save('all_subcategories_999', response.data.datas)
    dispatch({type:'GET_ALL_PRODUCTS', payload:response.data.datas})
}

//FETCH ORDERS
export const fetchOrders = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/order`);
    // cookie.save('all_subcategories_999', response.data.datas)
    dispatch({type:'GET_ALL_ORDERS', payload:response.data.datas})
}


//FETCH COURIER
export const fetchCourier = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/courier`);
    // cookie.save('all_subcategories_999', response.data.datas)
    dispatch({type:'GET_ALL_COURIER', payload:response.data.datas})
}

//FETCH USERS
export const fetchUsers = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/user`);
    dispatch({type:'GET_ALL_USERS', payload:response.data.datas})
}

//FETCH BLOGS
export const fetchBlogs = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/blog`);
    dispatch({type:'GET_ALL_BLOGS', payload:response.data.datas})
}


//FETCH BLOGS
export const fetchLoginRecords = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/user/admin_view_all_loginrecords`);
    dispatch({type:'GET_ALL_LOGIN_RECORDS', payload:response.data.datas})
}

//FETCH BLOGS
export const fetchEmailRecords = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/user/admin_view_all_emailrecords`);
    dispatch({type:'GET_ALL_EMAIL_RECORDS_DATA', payload:response.data.datas})
}

//FETCH NOTIFICATIONS
export const fetchNotifications = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/user/admin_all_notifications`);
    dispatch({type:'GET_ALL_NOTIFICATION_DATA', payload:response.data.datas})
}

//FETCH PAGE VIEWS
export const fetchPageViews = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/user/admin_all_pagevisit_records`);
    dispatch({type:'GET_ALL_PAGEVIEW_DATA', payload:response.data.datas})
}

//FETCH ALL CART ITEMS
export const fetchCartItems = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/user/admin_all_cart_items`);
    dispatch({type:'GET_ALL_CRAT_PRODUCTS', payload:response.data.datas})
}



//FETCH ALL PRODUCT REVIEWS
export const fetchAllReviews = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/product/admin_all_reviews`);
    dispatch({type:'GET_ALL_REVIEWS', payload:response.data.datas})
}


//FETCH ALL LAST VISITED PRODUCT
export const fetchAllLastVisitedProducts = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/user/admin_user_all_productvisit_list`);
    dispatch({type:'GET_ALL_VISITED_PRODUCTS', payload:response.data.datas})
}

//FETCH ALL PAYMENT HISTORY
export const fetchAllPaymentHistory = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/order/admin_all_paymenthistory`);
    dispatch({type:'GET_ALL_PAYMENT_HISTORY', payload:response.data.datas})
}

//FETCH ALL CURRENCY
export const fetchAllCurrency = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/currency`);
    dispatch({type:'SET_CURRENCY_LIST', payload:response.data.datas})
}

//FETCH ALL ROLES
export const fetchAllRoles = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/rolesadmin`);
    dispatch({type:'GET_ALL_ROLES', payload:response.data.datas})
}


//FETCH ALL PAYMENT HISTORY
export const fetchAllContacts = () => async dispatch => {
    const response = await axios.get(`${process.env.backendURL}/contact`);
    dispatch({type:'GET_ALL_CONTACTS', payload:response.data.datas})
}