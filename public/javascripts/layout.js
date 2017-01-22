$(document).ready(function(){

    //responsive table
    var img = $('img');
    for(var i=0;i<img.length;i++){
        img[i].setAttribute("class","img-responsive center-block")
    }
    var table = $('table');
    if(table){
        for (var i=0;i<table.length;i++){
            table[i].setAttribute('class',"table")
        }
    }

});
