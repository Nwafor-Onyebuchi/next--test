import $ from 'jquery';

var interval;

let body = {};

body.addClass = (p, cl) => {

    const elem = document.querySelector(p);

    if(elem && !elem.classList.contains(cl)){
        elem.classList.add(cl)
    }

}

body.removeClass = (p, cl) => {

    const elem = document.querySelector(p);

    if(elem && elem.classList.contains(cl)){
        elem.classList.remove(cl)
    }

}

body.scrollToElem = (id) => {

    const elem = document.getElementById(id);

    if(elem){
        elem.scrollIntoView({ behavior: 'smooth' });
    }

}

body.changeBackground = (cn) => {

    const elem = document.querySelector('.body');

    if(elem){
        elem.classList.add(cn);
    }

}

body.dismissBackground = (cn) => {

    const elem = document.querySelector('.body');

    if(elem){
        elem.classList.remove(cn)
    }

}

body.splitQueries = (q, key) => {

    let value;

    for(let i = 0; i < q.length; i++){

        let pair = q[i].split('=');
        if(pair[0] === key){
            value = pair[1];
        }

    }

    return value;

}

body.fitMenus = () => {

    var boxMenus = document.querySelectorAll('#select-box');

    for(let i = 0; i < boxMenus.length; i++){

        var selectBoxMenu = $(boxMenus[i]).children('.menu')[0];
        var selectBoxSearch = $(selectBoxMenu).children('.menu-search')[0];
        var selectBoxSearchInput = $(selectBoxSearch).children('.menu-search__input')[0];
        var selectControl = $(boxMenus[i]).children('.control')[0];
        var selectIndicator = $(selectControl).children('.indicator-box')[0];
        var selectBoxSingle = $(selectControl).children('.single')[0];
        var indicator = $(selectIndicator).children('.indicator')[0];
        var arrow = $(indicator).children('.arrow')[0];
        var path = $(arrow).children('path')[0];

        $(selectControl).attr('id', `select-box-control-${i}`);
        $(selectBoxMenu).attr('id', `select-box-menu-${i}`);
        $(selectBoxSearch).attr('id', `select-box-search-${i}`)
        $(selectBoxSearchInput).attr('id', `select-box-input-${i}`)
        $(selectBoxSingle).attr('id', `select-box-single-${i}`);
        $(indicator).attr('id', `select-box-indicator-${i}`);
        $(arrow).attr('id', `select-box-arrow-${i}`);
        $(path).attr('id', `select-box-path-${i}`);
        
    }

}

body.hideMenu = () => {

    var boxMenus = document.querySelectorAll('#select-box');

    window.onclick=function(e) {

        // console.log(e.target);

        for(let j = 0; j < boxMenus.length; j++){

            var selectBoxMenu = document.getElementById(`select-box-menu-${j}`);
            var selectBoxSearch = document.getElementById(`select-box-search-${j}`);
            var selectBoxInput = document.getElementById(`select-box-input-${j}`);
            var selectBoxSingle = document.getElementById(`select-box-single-${j}`);
            var indicator = document.getElementById(`select-box-indicator-${j}`);
            var arrow = document.getElementById(`select-box-arrow-${j}`);
            var path = document.getElementById(`select-box-path-${j}`);
            var control = document.getElementById(`select-box-control-${j}`);

            var singleLabel = $($(control).children()[0]).children('.single__label')[0];
            var singlePlace = $($($(control).children()[0]).children('.single__placeholder')[0]).children('span');
            var singleImage = $($($(control).children()[0]).children('.single__image')[0]).children('img')[0];

            if(e.target !== selectBoxMenu && e.target !== selectBoxSingle && 
                e.target !== indicator && e.target !== arrow && e.target !== path && e.target !== singleImage
                && e.target !== selectBoxSearch && e.target !== selectBoxInput && e.target !== singlePlace
                && e.target !== control && e.target !== singleLabel) {

                if($(selectBoxMenu).hasClass('is-open')){
                    $(selectBoxMenu).removeClass('is-open');
                }
    
            }else{

                if($(selectBoxMenu).hasClass('is-open')){
                    console.log('');
                }

            }

        }
        
    }

}

body.initDrop = () => {
    body.fitMenus();
    body.hideMenu();
}

body.fixNav = () => {

    window.addEventListener('scroll', (e) => {

        // console.log(window.scrollY);
        const headBox = $('.header.header-nav');

        if(window.scrollY > 96){
            headBox.addClass('blocked');
        }else {
            headBox.removeClass('blocked');
            if(headBox.hasClass('flat')){
                headBox.addClass('blocked');
            }
        }

    })

}

body.fixSpecialNav = () => {

    window.addEventListener('scroll', (e) => {
        const navHead = $('.nav-head');

        if(window.scrollY > 40){
            navHead.addClass('blocked')
        }else {
            navHead.removeClass('blocked')
        }

    })

}

body.fixPostBar = () => {

    window.addEventListener('scroll', (e) => {

        // console.log(window.scrollY);
        const postBar = $('.post-bar');

        if(window.scrollY > 230){
            postBar.addClass('active');
        }else {
            postBar.removeClass('active');
        }

    })

}

body.getBase64Image = (data) => {

    const img = new Image();
    img.src = data;

    return img;

}

body.getBase64Dim = (data) => {

    let result = {
        width: '',
        height: ''
    }
    const img = new Image();
    img.src = data;

    img.onload = function() {
        result.width = img.naturalWidth.toString();
        result.height = img.naturalHeight.toString();
    };

    return result;

}

body.base64ImgIsSquare = (data) => {

    const rs = body.getBase64Dim(data);
    const { width, height } = rs;

    if(width === height){
        return true
    }else{
        return false;
    }

}

body.isObjectEmpty = (obj) => {
    return Object.getOwnPropertyNames(obj).length === 0 ? true : false;
}

body.isArrayEmpty = (arr) => {
    return arr.length <= 0 ? true : false;
}

body.arraymove = (arr, fromIndex, toIndex) =>  {

    const newArray = arr;
    var element = newArray[fromIndex];
    newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, element);
    return newArray;
}

body.captialize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

body.sortData = (data) => {

   const sorted = data.sort((a,b) => {
        if(a.name < b.name ) { return -1 }
        else if(a.name > b.name ) { return 1 }
        else { return 0 }
    })

    return sorted;

}

body.timer = (dur) => {


    clearInterval(interval);

    let timer = dur, minutes, seconds;
    let elem;

     interval = setInterval(function () {
        
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        elem = minutes + ":" + seconds

        if(minutes === 0){
            clearInterval(interval);
        }else{

            if (--timer < 0) {
                timer = dur;
            }
            
        }

    }, 1000);

    return elem;

}

body.daysOfWeek = () => {

    return [
        { id: 0, name: 'sunday' },
        { id: 1, name: 'monday' },
        { id: 2, name: 'tuesday' },
        { id: 3, name: 'wednesday' },
        { id: 4, name: 'thursday' },
        { id: 5, name: 'friday' },
        { id: 6, name: 'saturday' },
    ]

}

body.monthsOfYear = () => {

    return [
        { id: 0, name: 'january' },
        { id: 1, name: 'february' },
        { id: 2, name: 'march' },
        { id: 3, name: 'april' },
        { id: 4, name: 'may' },
        { id: 5, name: 'june' },
        { id: 6, name: 'july' },
        { id: 7, name: 'august' },
        { id: 8, name: 'september' },
        { id: 9, name: 'october' },
        { id: 10, name: 'november' },
        { id: 11, name: 'december' },
    ]

}

body.generate = (size = 6, isAlpha = false) => {

    const pool = isAlpha ? 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789abcdefghijklmnpqrstuvwxyz' : '0123456789';
    const rand = []; let i = -1;

    while (++i < size) rand.push(pool.charAt(Math.floor(Math.random() * pool.length)));

    return rand.join('');
 
}

body.leadZero = (val, length = 2, pad = '0') => {
    let lead = '';
    
    if(val >= 0){
        lead = val.toString().padStart(length, pad)
    }

    return lead;
}

body.getDate = (d = '') => {

    const td = d ? new Date(d) : new Date();
    const mn = body.monthsOfYear().find((x) => x.id === (td.getMonth()));
    
    let year = td.getFullYear().toString();
    let month = body.leadZero((td.getMonth() + 1).toString());
    let monthName= mn ? mn.name : '';
    let date= body.leadZero(td.getDate().toString());

    return {
        year, month, monthName, date
    }
}

export default body;