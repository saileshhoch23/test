import { ADD_CANTEEN, ADD_CATGORY, ADS_CATGOERY, ADS_TEMPALET, CANTEEN_COUNT, CANTEEN_DETAILS, CANTEEN_PAYMENT, OTP, SET_TOKEN, SET_USER, USER_DETAILS } from "./action-types";
import { REHYDRATE } from "redux-persist/lib/constants";

let initial = {
  token: null,
  user:null,
  canteenDetails:null,
  cateen:null,
  catgory:null,
  otp:null,
  cateenPyment:null,
  userdata:null,
  count:"",
  adsTemplate:null,
  cart:[],
  Adscatgoery:[]
};

const reducer = (state = initial, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return Object.assign({}, state, { token: action.token });
    case SET_USER:
      return Object.assign({}, state, { user: action.user });
    case CANTEEN_DETAILS:
      return Object.assign({}, state, { canteenDetails: action.canteenDetails });
    case ADD_CANTEEN:
      return Object.assign({}, state, { cateen: action.cateen });
    case ADD_CATGORY:
      return Object.assign({}, state, { catgory: action.catgory });
    case USER_DETAILS:
      return Object.assign({}, state, { userdata: action.userdata });
    case ADS_TEMPALET:
      return Object.assign({}, state, { adsTemplate: action.adsTemplate });
    case OTP:
      return Object.assign({}, state, { otp: action.otp });
    case CANTEEN_PAYMENT:
      return Object.assign({}, state, { cateenPyment: action.cateenPyment });
      case ADS_CATGOERY:
        return{
          ...state,
          Adscatgoery: action.Adscatgoery // Replace the entire array with the new one
        };
      case CANTEEN_COUNT:
      return { ...state, count: action.count };
    case REHYDRATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
