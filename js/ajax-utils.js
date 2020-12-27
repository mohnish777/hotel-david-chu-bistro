(function(global){

  var ajaxUtils={};

  //Returns an http request object
  function getRequestObject(){
  if (global.XMLHttpRequest){
  	return (new XMLHttpRequest());
  }
  else if (global.ActiveObject){
   // for very old ie browser(obtional)
   return (new ActiveObject("Microsoft.XMLHTTP"));
  }
  else{
  	global.alert("Ajax in not supported!");
  	return(null)// its imp to pass null as smtng has to be stored in request var
  }

}//end of get request object fn

ajaxUtils.sendGetRequest=
function(requestUrl,responseHandler,isJsonResponse){

var request= getRequestObject();
request.onreadystatechange=
function(){
	handleResponse(request,responseHandler,isJsonResponse);
};
request.open("GET",requestUrl,true);
request.send(null);  

};//end of sendgetrequest


function handleResponse(request,responseHandler,isJsonResponse){

	if((request.readyState==4)&&(request.status==200)){
    //isJsonResponse=undefined||true
    // the above one is shortcut you can also use the below if statement
		
    if(isJsonResponse==undefined){
      isJsonResponse=true
    }

    if(isJsonResponse){
      responseHandler(JSON.parse(request.responseText))
    }
    else{
      responseHandler(request.responseText)
    }




	}

}//end of handleresponse
global.$ajaxUtils=ajaxUtils;

})(window);