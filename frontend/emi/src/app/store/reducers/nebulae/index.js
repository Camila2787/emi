import {combineReducers} from 'redux';
import serviceWorker from './service-worker.reducer';

const nebulaeReducers = combineReducers({
    serviceWorker
});

export default nebulaeReducers;
