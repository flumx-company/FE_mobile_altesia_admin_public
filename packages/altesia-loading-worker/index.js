import {createApp} from 'vue';
import Loading from "./Loading";


const startSpinner = () => {
    window && window.loading && typeof window.loading.start === 'function' &&  window.loading.start();
};

const finishSpinner = () => {
    window && window.loading && typeof window.loading.finish === 'function' &&  window.loading.finish();
};

const createLoader = () => {
    window.loading = createApp(Loading)
        .mount('#loading');
    startSpinner()
};

export {
    startSpinner,
    finishSpinner,
    createLoader
}
