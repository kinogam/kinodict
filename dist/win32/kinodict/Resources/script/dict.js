/// <reference path="jquery-1.7.min.js" />

(function (window) {
    var d = function () {
        this.hasInited = false;
        this.wordTagRender = document.getElementById("wordtag");
        this.wordDescRender = document.getElementById("worddesc");
        this.historyRender = document.getElementById("history");
        this.descHelper = new DescHelper(this);
        this.historyHelper = new HistoryHelper(this);
        this.words = {};
    };

    var p = {
        setEvent: function () {
            var that = this;
            $(this.wordTagRender).on("click", "li", function () {
                var word = this.className.replace(/\s?selected\s?/, "").replace("tag_", "");
                that.descHelper.switchTo(word);
            });
        }
    };
    d.prototype = {
        init: function () {
            this.historyRender.innerHTML = "<h4>History</h4><ul></ul>";
            this.historyHelper.setList();
            p.setEvent.call(this);
            this.hasInited = true;
        },
        lookup: function (word) {
            if (!this.hasInited)
                this.init();
            if (this.words[word] != null)
                this.descHelper.showWord(word);
            else {
                this.words[word] = true;
                this.historyHelper.addWord(word);
                this.descHelper.addWord(word);
            }
        },
        switchTo: function (word) {
            this.descHelper.switchTo(word);
        }
    };

    window.DictHelper = d;
})(window);

(function (window) {
    var d = function(dh){
        this.dh = dh;
    }
    var p = {
        addTag: function (word) {
            var html = "<li class='tag_" + word + " selected'><a href='javascript:void(0)'>" + word + "</a><strong>x</strong></li>";
            this.dh.wordTagRender.innerHTML += html;
        },
        removeSelected:function(){
            $(this.dh.wordTagRender).find("li").removeClass("selected");
        },
        addLoading: function () {
            $(this.dh.wordDescRender).addClass("loading");
        },
        addDesc: function(word){
            $(this.dh.wordDescRender).append("<div class='wdesc desc_" + word + "'></div>");
        },
        hideDesc: function(){
            $(this.dh.wordDescRender).find(".wdesc").hide();
        },
        removeLoading: function () {
            $(this.dh.wordDescRender).removeClass("loading");
        },
        setPros: function (descPanle, word, data) {
            
            var html = "<div class='pros'>";
            var pro = data.ROOT.PROS.PRO;
            for (var i = 0; i < pro.length; i++)
                html += "<span>" + pro[i]["$L"] + ":" + pro[i]["$"] + "</span>";
            html += "</div>"
            descPanle.append(html);
        },
        setDef: function (descPanle, word, data) {
            var html = "";
            var sens = data.ROOT.DEF[0].SENS;
            for (var i = 0; i < sens.length; i++) {
                var pos = sens[i]["$POS"];
                if (pos == "na" || pos == "web" || pos == "adv")
                    continue;

                html += "<div class='def'><div class='pos'>" + sens[i]["$POS"] + "</div><ol>";
                var sen = sens[i].SEN;
                for (var j = 0; j < sen.length; j++)
                    html += "<li>" + sen[j].D.$ + "</li>";
                html += "</ol></div>";
            }
            descPanle.append(html);
        }
    };
    d.prototype = {
        addWord: function(word){
            var that = this;
            
            //取消所有标签的选中状态
            p.removeSelected.call(that);
            p.hideDesc.call(that);

            p.addTag.call(that, word);
            p.addDesc.call(that, word);
            p.addLoading.call(that);
            this.getJson(word, function (data) {
                var descPanle = $(that.dh.wordDescRender).find(".desc_" + word);
                p.removeLoading.call(that, word);
                p.setPros.call(that, descPanle, word, data);
                p.setDef.call(that, descPanle, word, data);
            });
        },
        switchTo: function(word){
            //取消所有标签的选中状态
            p.removeSelected.call(this);
            p.hideDesc.call(this);
            $(this.dh.wordTagRender).find("li.tag_" + word).addClass("selected");
            $(this.dh.wordDescRender).find(".desc_" + word).show();
        },
        getJson: function (word, callback) {
            var param = {
                q: word,
                t: "dict",
                ut: "default",
                ulang: "ZH-CN",
                tlang: "EN-US"
            };
            $.getJSON("http://dict.bing.com.cn/io.aspx", param, callback);
        }
    };
    window.DescHelper = d;
})(window);

(function (window) {
    var h = function(dh){
        this.dh = dh;
    }
    h.prototype = {
        setList: function(){
            
        },
        addWord: function(word){
            var hr = $(this.dh.historyRender).find("ul");
            var html = "<li><a href='javascript:void(0)'>" + word + "</a></li>";
            if(hr.find("li").length == 0)
                hr.append(html);
            else
                hr.prepend(html);
            var x = hr;
        }
    };
    window.HistoryHelper = h;
})(window);