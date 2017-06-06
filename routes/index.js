var express = require('express');
var router = express.Router();
var Grid = require('gridfs-stream');
var fs = require('fs');
var common = require('../common');
//url = 'mongodb://testz:123456aaa@ds161001.mlab.com:61001/testz';
//const url = "localhost:27017/test";
var mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1/test');
var conn = mongoose.connection;
var Schema = mongoose.Schema;
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
var getFoodsDetailInfos=common.getFoodsDetailInfos;

/* GET home page. */
router.get('/', function (req, res, next) {
//    var thingSchema = new conn.Schema({}, {strict: false});
    var thingSchema = new Schema({}, {strict: false});
    var Thing = mongoose.model('Thing', thingSchema);
    var thing = new Thing({iAmNotInTheSchema: true});
    thing.save(); // iAmNotInTheSchema is now saved to the db!!
    res.render('index', {title: 'Express22'});
});
router.get('/grids', function (req, res, next) {
//    var Grid = require('gridfs-stream');
    // 写文件
    objId = mongoose.Types.ObjectId();
    console.log(objId);
    var writestream = gfs.createWriteStream({
        _id: objId,
        filename: 'mongo_file1.txt'
    });
    fs.createReadStream('./aa1.txt').pipe(writestream);
    writestream.on('close', function (file) {
        console.log(file.filename + ' Written To DB');
    });
//    var gfs = Grid(db.db);
//    // 写文件
//    var fs_write_stream = fs.createWriteStream('./write.txt');
    res.render('index', {title: 'Express22'});
});

router.get('/gridsRead', function (req, res, next) {
    var readstream = gfs.createReadStream({
        _id: mongoose.Types.ObjectId("593617b185a61d21f4719294")
    });
    readstream.pipe(process.stdout);
    res.render('index', {title: 'Express22'});
});
router.get('/test2', function (req, res, next) {
    console.log(44545);
    
    console.log(getFoodsDetailInfos("keteduojinxiangjiaojiaoniunaiqiaokelijingqiaozhuang"));
//    ;
    
    console.log(mongoose.Types.ObjectId());
});
module.exports = router;
