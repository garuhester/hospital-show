var Hospital = require("../schemas/hospital");

var getHospitalData = function (title) {
    return new Promise(function (resolve, reject) {
        var data = {};
        hospitalData(data, title, function (data) {
            resolve(data);
        });
    });
}

var postHospitalData = function (req, res) {
    var hospital = req.body.hospital;
    var data = {};
    hospitalData(data, hospital, function (data) {
        res.json({ result: data });
    });
}

var getDiseaseData = function (title, keshi, bingqing) {
    return new Promise(function (resolve, reject) {
        var data = {};
        data.title = title;
        data.keshi = keshi;
        data.bingqing = bingqing;
        var temp = "";
        Hospital.findOne({ title, }, function (err, hosp) {
            if (hosp != null) {
                var hospitalData = hosp.data;
                for (var i = 0; i < hospitalData.length; i++) {
                    if (hospitalData[i][0] != null) {
                        temp = hospitalData[i][0];
                    }
                    if (keshi == temp && bingqing == hospitalData[i][1]) {
                        data.info1 = hospitalData[i][2].split("\r\n");
                        data.info2 = hospitalData[i][3].split("\r\n");
                        data.info3 = hospitalData[i][4].split("\r\n");
                    }

                }
            }
            resolve(data);
        });
    });
}

function hospitalData(data, title, func) {
    Hospital.findOne({ title, }, function (err, hosp) {
        if (hosp != null) {
            data.title = hosp.title;
            data.content = hosp.content;
            data.logo = hosp.logo;
            var hospitalData = hosp.data;
            var bing = {};
            var keshis = [];
            var tempArr = [];
            for (var i = 0; i < hospitalData.length; i++) {
                var keshi = hospitalData[i][0];
                if (keshi != null) {
                    keshis.push(keshi);
                    bing[keshi] = [];
                    tempArr = bing[keshi];
                }
                tempArr.push(hospitalData[i][1]);
            }
            data.bing = bing;
            data.keshis = keshis;
            func(data);
        } else {
            func(0);
        }
    });
}

var getAdminData = function (currentPage) {
    return new Promise(function (resolve, reject) {
        var gotoUrl = "/admin/?page=";
        var data = {};
        //一页最大条数
        var pageSize = 50;
        var skipNum = (currentPage - 1) * pageSize;
        //页面跳转字符
        data.goto = gotoUrl;
        //当前页码
        data.currentPage = currentPage;
        Hospital.find({}).skip(skipNum).limit(pageSize).sort({ 'createTime': -1 }).exec(function (err, hosp) {
            data.hosp = hosp;
            Hospital.count({}, function (err, q) {
                data.allPage = (q % pageSize == 0) ? ~~(q / pageSize) : ~~((q / pageSize) + 1);
                if (data.allPage == 0) {
                    data.allPage = 1;
                }
                resolve(data);
            });
        });
    });
}

module.exports = {
    getHospitalData,
    postHospitalData,
    getDiseaseData,
    getAdminData,
}