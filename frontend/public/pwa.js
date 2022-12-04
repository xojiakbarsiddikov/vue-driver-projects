import {APP_VERSION} from "../src/helper";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register(`/service-worker.js?v=${APP_VERSION}`)
        .catch();
}
