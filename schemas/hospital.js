var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HospitalSchema = new Schema({
    title: String, // 医院名称
    content: String, // 医院简介
    logo: { type: String, default: "" },
    data: Array, // 科室及病情
    createTime: { type: Date, default: Date.now } // 创建时间
});

module.exports = mongoose.model("Hospital", HospitalSchema);