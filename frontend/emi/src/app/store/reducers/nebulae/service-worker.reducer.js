import * as Actions from 'app/store/actions/nebulae';

const initialState = {
    serviceWorkerInitialized: false,
    serviceWorkerUpdated: false,
    serviceWorkerRegistration: undefined
};

const serviceWorker = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SW_INIT:
        {
            return {
                ...state,
                serviceWorkerInitialized: !state.serviceWorkerInitialized
            };
        }
        case Actions.SW_UPDATE:
        {
            return {
                ...state,
                serviceWorkerUpdated: true,
                serviceWorkerRegistration: action.payload
            };
        }
        case Actions.SW_HIDE_UPDATE:
        {
            return {
                ...state,
                serviceWorkerUpdated: false
            };
        }
        default:
        {
            return state;
        }
    }
};

export default serviceWorker;
