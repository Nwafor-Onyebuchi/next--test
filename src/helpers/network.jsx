let network = {};

network.checkStatus = () => {
    const status = window.navigator.onLine;
    return status ? true : false;
}

network.listenOnline = () => {

    let status = false;
    window.addEventListener('online', () => {
        status = true;
    });

    return status;
}

network.listenOffline = () => {
    window.addEventListener('offline', () => console.log('Became offline'));
}

export default network;