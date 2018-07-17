var hospital = "";
var udata = [];
var json = {};

if (window.location.href.split("?")[1] != undefined) {
    udata = window.location.href.split("?")[1].split("&");
    for (var i = 0; i < udata.length; i++) {
        var d = udata[i].split("=");
        json[d[0]] = d[1];
    }
}

hospital = "hospital=" + json.hospital + "&startp=1";

function tomyurl(url) {
    window.location.href = url;
}