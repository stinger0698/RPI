window.LastQueryText = '';
window.NextPageTokenLoad= '';
window.Loading = false;

function GetQueryString(parameters){
    var string = '';
    for (i in parameters){
        string += i + '=' + parameters[i] + '&';
    }
    return string;
}

function GetResultFromYouTube(input){
    
    if(input) {
        window.LastQueryText = input;
    }else{}
    
    var QueryParameters = {
        part: 'id,snippet',
        videoDuration: 'any',
        key: 'AIzaSyDo9X0EBinoo1_OJj5VxEfZIp3y5BVhIkI',
        q: window.LastQueryText+' in:video',
        maxResults: 20,
    };
    
    if(window.NextPageTokenLoad){
        QueryParameters.pageToken = window.NextPageTokenLoad;
    }
    window.LoadingFlag = true;
    var xhr = getXhrObject();
    xhr.open('GET', 'https://www.googleapis.com/youtube/v3/search?'+GetQueryString(QueryParameters), true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200){
        var result = JSON.parse(xhr.responseText);
        AddResult(result);
      }
    }
    xhr.send(null);

}

function getXhrObject(){
  if(typeof XMLHttpRequest === 'undefined'){
    XMLHttpRequest = function() {
      try { return new window.ActiveXObject( "Microsoft.XMLHTTP" ); }
        catch(e) {}
    };
  }
  return new XMLHttpRequest();
}

document.addEventListener("DOMContentLoaded", function(event) {

    var MousePosition, to;
    var clicked = false;
    
    
    var contentBlock = document.getElementById('contentBlock');
    var ratio = 4;
    
    contentBlock.addEventListener("mousedown", onDragStart, false);
    contentBlock.addEventListener("mousemove", onDrag, false);
    document.addEventListener("mouseup", onDragEnd, false);
    
    function onDragStart(e) {
        console.log(e);
        MousePosition = e.screenX;
        clicked = true;
        return;
    }
    function onDrag(e) {
        if(!clicked) return;
        console.log(e);
        
        clearTimeout(to);
        var delta = (e.screenX - MousePosition) * ratio;
        to = setTimeout(function () { 
            contentBlock.scrollLeft = contentBlock.offsetLeft + contentBlock.scrollLeft - delta;
            MousePosition = e.screenX;
            if(!window.LoadingFlag && (contentBlock.scrollWidth - contentBlock.offsetWidth - contentBlock.scrollLeft)<100) getResultFromYouTube();
        }, 10);
        
    }
    function onDragEnd(e){
        clicked = false;
        setTimeout(function () { 
			contentBlock.scrollLeft = Math.floor(contentBlock.scrollLeft/318) * 318;
		},20);
        return;
    }

},false);

function AddResult(result){
    var cont = document.getElementById('contentBlock');
    console.log(result);
    if(result.nextPageToken) {
        window.NextPageTokenLoad = result.nextPageToken;
    }
    for (i in result.items){
        var NewItem = document.createElement('div');
        NewItem.className = 'output';
        NewItem.innerHTML = OutputResultToForm(result.items[i]);
        cont.appendChild(NewItem);
    }
    window.LoadingFlag = false;
}

function GetOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function OutputResultToForm(result){
    
    return ''+
    '<div>'+
        '<a href="https://www.youtube.com/watch?v='+result.id.videoId+'">'+
            '<img src="'+result.snippet.thumbnails.medium.url+'" alt="Result thumbnail">'+
        '</a>'+
    '</div>'+
    '<div>'+
        '<div class="title">'+result.snippet.title+'</div><br>'+
        '<div class="channel"><a href="https://www.youtube.com/channel/'+result.snippet.channelId+'?autoplay=1">'+result.snippet.channelTitle+'</a></div>'+
        '<div style="font-family: fantasy">Дата публикации: '+result.snippet.publishedAt.substring(0,10)+'</div><br>'+
        '<div class="curs">'+result.snippet.description+'</div><br> '+
    '</div>';
    
}   
