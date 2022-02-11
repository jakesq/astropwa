var customTemplate = 
    "<article onclick='document.querySelector(\".TAG\").showModal();'>\n\
        <div class='articleItem'>\
            <h3>NAME</h3>\n\
        </div>\
        <div class='articleItem'>\
            <div class='sunDistance'>\
                <p>POS</p>\
                <img src='media/ssystem/loading.gif' data-src='media/ssystem/TAG.png' alt='NAME'>\n\
                <p class='description'>DISTANCE km from the sun</p>\
            </div>\
        </div>\
        <div class='articleItem'>\
            <div class='sunDistance'>\
                diameter: <strong>DIAMETER km</strong>\n\
            </div>\
        </div>\
    </article>\n\
    <dialog class='customDialog TAG'>\n\
        <div class='sunDistance'>\
        <h4 class='mdl-dialog__title'>NAME</h4>\n\
            <br>\
            <img data-src='media/ssystem/TAG.png' alt='NAME'>\n\
            <p>ABOUT</p>\
        </div>\n\
        <div class='mdl-dialog__actions'>\n\
        <button type='button' class='mdl-button close' id='ID' onclick='document.querySelector(\".TAG\").close();'>Done</button>\n\
        </div>\n\
    </dialog>\n\
    ";

var content = '';
for (var i = 0; i < planets.length; i++) {
    var entry = customTemplate.replace(/POS/g, i)
        .replace(/TAG/g, planets[i].tag)
        .replace(/NAME/g, planets[i].name)
        .replace(/DISTANCE/g, planets[i].distance)
        .replace(/DIAMETER/g, planets[i].diameter)
        .replace(/ABOUT/g, planets[i].about);
    entry = entry.replace('<a href=\'http:///\'></a>', '-');
    content += entry;
};
document.getElementById('planets').innerHTML = content;

var dialog = document.querySelector('dialog.mdl-dialog');

dialogContent = dialog.innerHTML;
for (var i = 0; i < planets.length; i++) {
    var entry = dialogContent.replace(/NAME/g, planets[i].name);
    content += entry;
}

dialog.innerHTML = dialogContent;

//Service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

//progressive loading images, replaces placeholder with desired image as the site loads
let imagesToLoad = document.querySelectorAll('img[data-src]');

const loadImages = function(image) {
    image.setAttribute('src', image.getAttribute('data-src'));
    image.onload = function() {
        image.removeAttribute('data-src');
    };
};

//used to load each image as they come into frame (on demand), instead of all at once
if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (items, observer) {
        items.forEach(function(item) {
            if (item.isIntersecting) {
                loadImages(item.target);
                observer.unobserve(item.target);
            }
        });
    });
    imagesToLoad.forEach(function(img) {
        observer.observe(img);
    });
} else {
    imagesToLoad.forEach(function (img) {
        loadImages(img);
    });
}