var xlsx = require("node-xlsx");
var Hospital = require("../schemas/hospital");
var getData = require("./getData");

var multer = require("multer");
var storage = multer.diskStorage({
    destination: "static/xls",
    filename: function (req, file, cb) {
        var end = file.originalname.split(".")[1];
        cb(null, `yiyuan.${end}`);
    }
});
var upload = multer({
    storage
});

module.exports = function (app) {

    app.use(upload.single("xls"));

    app.get("/index", function (req, res) {
        var hospital = req.query.hospital;
        getData.getHospitalData(hospital).then(function (data) {
            res.render("index", {
                data,
            });
        });
    });

    app.get("/detail", function (req, res) {
        var hospital = req.query.hospital;
        getData.getHospitalData(hospital).then(function (data) {
            data.contents = data.content.split("\r\n");
            res.render("detail", {
                data,
            });
        });
    });

    app.get("/condition", function (req, res) {
        res.render("condition");
    });

    app.get("/disease", function (req, res) {
        var hospital = req.query.hospital;
        var keshi = req.query.keshi;
        var bingqing = req.query.bingqing;
        getData.getDiseaseData(hospital, keshi, bingqing).then(function (data) {
            res.render("disease", {
                data,
            });
        });
    });

    app.get("/xls", function (req, res) {
        res.render("xls");
    });

    app.get("/admin", function (req, res) {
        var currentPage = req.query.page || 1;
        getData.getAdminData(currentPage).then(function (data) {
            res.render("admin", {
                data,
            });
        });
    });

    app.post("/postHospitalData", getData.postHospitalData);

    app.post("/xls", function (req, res) {
        var obj = xlsx.parse("./static/xls/yiyuan.xlsx");
        var sheet = obj[0].data;
        var title = sheet[0][0];
        var content = sheet[1][0];
        sheet = sheet.splice(3, sheet.length);
        Hospital.findOne({ title, }, function (err, hosp) {
            if (hosp == null) {
                var hosp = new Hospital({
                    title,
                    content,
                    data: sheet,
                });
                hosp.save(function (err, h) {
                    res.json({ title, content, sheet, result: 1 });
                });
            } else {
                res.json({ result: 0 });
            }
        });

    });

    app.post("/delHospital", function (req, res) {
        var hid = req.body.hid;
        Hospital.remove({ _id: hid }, function (err, h) {
            res.json({ result: 1 });
        });
    });

}