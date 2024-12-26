import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./root-reducer";
import rootSaga from "./root-saga";

const bindMiddleware = (middleware:any) => {
    return applyMiddleware(...middleware);
  };

  const initStore = (initialState = {}) => {
    const sagaMiddleware = createSagaMiddleware();
  
    const store = createStore(
      rootReducer,
      initialState,
      composeWithDevTools(bindMiddleware([sagaMiddleware]))
    );
  
    (store as any).sagaTask = sagaMiddleware.run(rootSaga);
  
    return store;
  };
  
  export default initStore;