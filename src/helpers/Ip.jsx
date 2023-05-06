import $ from 'jquery';

let ip = {};

ip.getAddress = () => {

    return new Promise((resolve, reject) => {
        $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {

            // Convert to JSON like data
            data = data.trim().split('\n').reduce(function(obj, pair) {
                pair = pair.split('=');
                return obj[pair[0]] = pair[1], obj;
            }, {});

            if(data){
                resolve(data);
            }else{
                reject('No IP data returned');
            }

        });
    })
}




export default ip;