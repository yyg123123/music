var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songList;
var controlmanager;
var audio = new root.audioManager();
function bindClick() {
    $scope.on("play:change", function (event, index, flag) {
        audio.setAudioSource(songList[index].audio);
        if (audio.status == "play" || flag) {
            audio.play();
            root.pro.start();
        }
        root.pro.renderAllTime(songList[index].duration);
        root.render(songList[index]);
    })
    //移动端click有300ms延迟
    $scope.on("click", ".prev-btn", function () {
        // 先改变index值  再去触发play change
        var index = controlmanager.prev();
        $scope.trigger("play:change", index);
        if(audio.status == 'play'){
            root.pro.stop(0);
        }else{
            root.pro.update(0);            
        }
    })
    $scope.on("click", ".next-btn", function () {
        var index = controlmanager.next();
        $scope.trigger("play:change", index);
        if(audio.status == 'play'){
            root.pro.stop(0);
        }else{
            root.pro.update(0);            
        }
    })
    $scope.on("click", ".play-btn", function () {
        if (audio.status == "play") {
            audio.pause();
            root.pro.stop();
        } else {
            audio.play();
            root.pro.start();
            
        }
        $(this).toggleClass("playing");
    })
    $scope.on("click", ".list-btn", function () {
        root.playList.show(controlmanager);
    })
};


function bindTouch(){
    var left = $('.pro-bottom').offset().left;
    var width = $('.pro-bottom').offset().width;
    
    $('.slider-point').on('touchstart',function(){
        root.pro.stop();
    }).on('touchmove',function(e){
        console.log(e)
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per >=0 && per <= 1){
            root.pro.update(per);
        }
    }).on('touchend',function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per >= 0 && per <= 1){
            var duration = songList[controlmanager.index].duration;
            var curTime = per * duration;
            // 跳转歌曲时间
            audio.playTo(curTime);
            // 标记当前音乐为播放
            $('.play-btn').addClass('playing');
            audio.status = 'play';

            root.pro.start(per);
        }
    })
};

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            bindClick();
            bindTouch();
            root.playList.renderList(data);
            controlmanager = new root.controlManager(data.length);
            songList = data;
            $scope.trigger("play:change", 0);

        },
        error: function () {
            console.log("error")
        }
    })
}

getData("../mock/data.json")