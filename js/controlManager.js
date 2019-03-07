(function($,root){
    function controlManager(len){
        this.index = 0;
        this.len = len;
    }
    controlManager.prototype = {
        prev : function(){
            return this.getIndex(-1);
        },
        next : function(){
            return this.getIndex(1);
        },
        getIndex : function(val){
            var index = this.index;
            var len = this.len;
            var curIndex = (index + val + len) % len;
            this.index = curIndex;
            return curIndex;
        }
    }
    root.controlManager = controlManager;
})(window.Zepto,window.player || (window.player = {}));