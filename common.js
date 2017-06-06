//var server = require("./curl");
var fs = require('fs');
var cheerio = require("cheerio");
//const monk = require('monk');
var execSync = require("child_process").execSync;
var mongoose = require("mongoose");
var Grid = require('gridfs-stream');
var request = require('request');
mongoose.connect('mongodb://127.0.0.1/test');
var conn = mongoose.connection;
var Schema = mongoose.Schema;
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);


function getUrlImgName(path)
{
var filename;
if(path.indexOf("/")>0)//如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
{
filename=path.substring(path.lastIndexOf("/")+1,path.length);
}
else
{
filename=path;
}
return filename;
}


function urlPicToGridfs(picUrl){
    wiritePicName=getUrlImgName(picUrl);
    objId = mongoose.Types.ObjectId();
    console.log(objId);
    var writestream = gfs.createWriteStream({
        _id: objId,
        filename:wiritePicName
    });
    request(picUrl).pipe(writestream);
      return objId;

}

//output = execSync('php test.php ' + url);
exports.getFoodsDetailInfos = function (pageIndex) {
    url = "http://www.xxx.com/shiwu/" + pageIndex;
    console.log(url);
    foodInfos = new Object();
    
    
    output = execSync('node test.js ' + url);
    if (output) {
        var $ = cheerio.load(output, {decodeEntities: false});

        tempArray = $('.crumb').text().split("/");

        foodInfos["name"] = tempArray[2];

        foodInfos["basicInfoTitle"] = $('.widget-food-detail h3').eq(0).text();
        foodInfos["pageIndex"] = pageIndex; //"jid;
        foodInfos["basicInfos"] = Object();

        picUrl = $('.widget-food-detail .content .food-pic a img').attr('src');

        foodInfos["basicInfos"].picUrl = urlPicToGridfs(picUrl);
        foodInfos["basicInfos"].detailInfos = Object();
        $('.widget-food-detail .content .basic-infor li').each(function (i, elem) {
            foodInfos["basicInfos"].detailInfos[i] = $(this).html();
        });

        foodInfos["basicInfos"].comment = $('.widget-food-detail .content p').html();

        foodInfos["itemsInfos"] = Object();
        foodInfos["uniteInfos"] = Object();
        foodInfos["relateInfos"] = Object();
        foodInfos["itemsInfos"].basicItemsInfos = Object();

        foodInfos["itemsInfos"].moreItemssInfos = Object();

        $('.widget-food-detail .nutr-tag .content dl').not('.header').
                slice(0, 4).each(function (i, e) {
            i2String = $(this).find("dd").eq(0).find(".dt").text() + "@" + $(this).find("dd").eq(0).find(".dd").text();
            i21String = $(this).find("dd").eq(1).find(".dt").text() + "@" + $(this).find("dd").eq(1).find(".dd").text();
            foodInfos["itemsInfos"].basicItemsInfos[i * 2] = i2String;// $(this).find("dd").eq(0).html();
            foodInfos["itemsInfos"].basicItemsInfos[i * 2 + 1] = i21String;// $(this).find("dd").eq(1).html();
        });

        $('.widget-food-detail .nutr-tag .content dl').not('.header').
                slice(4, 13).each(function (i, e) {
            i2String = $(this).find("dd").eq(0).find(".dt").text() + "@" + $(this).find("dd").eq(0).find(".dd").text();
            i21String = $(this).find("dd").eq(1).find(".dt").text() + "@" + $(this).find("dd").eq(1).find(".dd").text();

            foodInfos["itemsInfos"].moreItemssInfos[i * 2] = i2String; //$(this).find("dd").eq(0).html();
            foodInfos["itemsInfos"].moreItemssInfos[i * 2 + 1] = i21String; //$(this).find("dd").eq(1).html();
        })
        $('.widget-food-detail .widget-unit .content table tbody tr')
                .each(function (i, e) {
                    foodInfos["uniteInfos"][i] = Object();
                    foodInfos["uniteInfos"][i]["nameHtml"] = $(this).find("td").eq(0).html();
                    foodInfos["uniteInfos"][i]["valeHtml"] = $(this).find("td").eq(1).html();

                })
        $('.widget-food-detail .widget-relative .content ul li a')
                .each(function (i, e) {

                    foodInfos["relateInfos"][i] = Object();
                    foodInfos["relateInfos"][i]["urlTag"] = $(this).attr("href").split("/")[2];
                    foodInfos["relateInfos"][i]["src"] =urlPicToGridfs($(this).find("img").attr('src')) ;
                    foodInfos["relateInfos"][i]["name"] = $(this).find("span").text();
                });

        return foodInfos;
    } else
    {
        console.log("error");
    }

};
exports.mongoObjtoJsonObj = function (val) { //cal is a mongo search return objs or others
    return cToObj = eval("(" + JSON.stringify(val) + ")");
};

//export.mongoDB=function(){
//    
//    
//    var mongoose = require("mongoose");
//mongoose.connect('mongodb://127.0.0.1/test');
//var conn = mongoose.connection;
//}
