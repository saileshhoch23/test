import {
    ADD_CANTEEN,
    ADD_CATGORY,
    ADS_CATGOERY,
    ADS_TEMPALET,
    CANTEEN_COUNT,
    CANTEEN_DETAILS,
    CANTEEN_PAYMENT,
    OTP,
    SET_TOKEN,
    SET_USER,
    USER_DETAILS,
} from "./action-types";

import {REHYDRATE} from 'redux-persist/lib/constants';
let initialState = {
    token: null,
    user:null,
    cart:[],
    Adscatgoery:[],
    cateen:null,
    catgory:null,
    count:"",
    canteenDetails:null,

   otp:null,
   cateenPyment:null,
   adsTemplate:null,
   userdata:null,
};

export const setToken = (token) => ({type: SET_TOKEN, token});
export const setUser  = (user) =>({type: SET_USER, user})
export const setCanteenData  = (canteenDetails) =>({type:CANTEEN_DETAILS, canteenDetails})
export const setAddCanteen  = (cateen) =>({type: ADD_CANTEEN, cateen})
export const setcateenPyment = (cateenPyment) =>({type:CANTEEN_PAYMENT, cateenPyment})
export const setAddcatgory  = (catgory) =>({type: ADD_CATGORY, catgory})
export const setuserdetials  = (userdata) =>({type: USER_DETAILS, userdata})
export const setCanteenCount  = (count) =>({type: CANTEEN_COUNT, count})
export const setAdstemplate  = (adsTemplate) =>({type: ADS_TEMPALET, adsTemplate})
export const setAdscatgoery  = (Adscatgoery) =>({type: ADS_CATGOERY, Adscatgoery})
export const setOtp  = (otp) =>({type: OTP, otp})
export const logout = () => ({type: REHYDRATE, payload: initialState});
