/// <reference path="qunit/qunit.js" />
/// <reference path="../script/mockdata.js" />
/// <reference path="../script/dict.js" />
/// <reference path="../script/jquery-1.7.min.js" />

var dh;
QUnit.testStart = function () {
    dh = new DictHelper();
    dh.wordTagRender = document.createElement("div");
    dh.wordDescRender = document.createElement("div");
    dh.historyRender = document.createElement("div");
    dh.historyRender.innerHTML = "<h4>History</h4><ul></ul>";
    dh.descHelper.getJson = function (word, callback) {
        callback(mockdata);
    };
}

module("look up dict");

test("check word tags panel", function () {
    dh.lookup("good");
    var wt = $(dh.wordTagRender).find("li");
    equal(wt.length, 1, "word tag panel should has a new item when look up finished");
    equal(wt.hasClass("selected"), true, "the new li has selected class");
    equal(wt.find("a").html(), "good", "check tag name");
});

asyncTest("check word description panel", function () {
    dh.descHelper.getJson = function (word, callback) {
        setTimeout(function () {
            start();
            callback(mockdata);
            equal(wd.hasClass("loading"), false, "remove loading when look up finished");
            equal(wd.find(".pros").length, 1, "should has pronunciation");
            ok(wd.find(".def").length > 0, "should has word define");
        }, 0);
    };
    dh.lookup("good");
    var wd = $(dh.wordDescRender);
    equal(wd.hasClass("loading"), true, "add loading");

});

test("check history panel", function () {
    dh.lookup("good");
    var h = $(dh.historyRender);
    equal($(h).find("li").length, 1);
});

test("lookup other word will hide previou one", function () {
    dh.lookup("good");
    dh.lookup("bad");
    equal($(dh.wordTagRender).find("li.selected").length, 1, "only one selected tag exist");
});

test("switch word tag", function () {
    dh.lookup("good");
    dh.lookup("bad");
    dh.switchTo("good");
    equal($(dh.wordTagRender).find("li.selected a").html(), "good");
});

test("trigge tag switch event", function () {
    dh.lookup("good");
    dh.lookup("bad");

    $(dh.wordTagRender).find("li.tag_good").trigger("click");
    equal($(dh.wordTagRender).find("li.selected a").html(), "good");
});
