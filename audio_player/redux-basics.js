const redux = require('redux');
const createStore = redux.createStore;

const initialState = {
  huy: 0
};

//Reducer
const rootReducer = (state = initialState, action) => {
  if (action.type === 'ADD_LIKE') {
    return {
      ...state,
      huy: ++state.huy
    }
  }

  return state;
}

//Store
const store = createStore(rootReducer);

//Subscription
store.subscribe(() => {
  console.log('[Subcription]', store.getState());
});

//Dispatching Action
store.dispatch({type: 'ADD_LIKE', id: 'ooo'});