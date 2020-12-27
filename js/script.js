$(function(){ // same as document.addListener("DOMContentLoaded",.....)
 
 //same as document.queryselector("#navbar-toggle").addEventListener("blur",...)
 $("#navbar-toggle").blur(function(event){
    var screenWidth=window.innerWidth;
    if(screenWidth<768){
    	$("#collapsable-nav").collapse('hide')
    }
 
   });

});

//******************X**********************
(function(global){

var dc={};
var homeHtml="snippets/home-snippet.html";
var allCategoriesUrl="https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml="snippets/categories-title-snippet.html";
var categoryHtml="snippets/category-snippet.html";

//Convenience for inserting inner HTML for select
var insertHtml=function(selector,html){
	var targetElem=document.querySelector(selector);
	targetElem.innerHTML=html;
}

// Show loading icon inside element identified by 'selector'.
var showLoading=function(selector){
var html="<div class='text-center'>";
html+="<img src='images/ajax-loader.gif'></div>";
insertHtml(selector,html);
}

//Return substitute of "{{propNmae}}"
//with propValue in given "string"
var insertProperty=function(string,propName,propValue){
var propToReplace="{{" +propName+ "}}";
    string=string //for every string class
      .replace(new RegExp(propToReplace,"g"),propValue);
    return string; //"g" means replace every means every where with propValue
  }


document.addEventListener("DOMContentLoaded",function(event){
showLoading("#main-content")
$ajaxUtils.sendGetRequest(homeHtml,
   function(responseText){
   	document.querySelector("#main-content")
   	.innerHTML=responseText;
   },
	false);

});//end of addeventlistener.

//load the new categories view
dc.loadMenuCategories=function(){
  showLoading("main-content")
  $ajaxUtils.sendGetRequest(  //1st call
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

// builds html for the categories page based on the data
//form the server
function buildAndShowCategoriesHTML(categories){ //here categories hold json data which is coming from server
//load title snippet of categories page
$ajaxUtils.sendGetRequest( //2nd call
  categoriesTitleHtml,
  function(categoriesTitleHtml){ // categoriesTitleHtml hold data of title "Substituting white rice with....."
    //retrive single category snippet
    $ajaxUtils.sendGetRequest( //3rd call
      categoryHtml,
      function(categoryHtml){ // menu items noodles ,rice etc
        var categoriesViewHtml=
        buildCategoriesViewHtml(categories,
                                   categoriesTitleHtml,
                                   categoryHtml);
        insertHtml("main-content",categoriesViewHtml)
      },

      false);//false for 3rd call as its html not json
  },
  false // false for 2nd call as its html not json
  );

}//end of buildAndShowCategorieshtml


function buildCategoriesViewHtml(categories,
                                categoriesTitleHtml,
                                categoryHtml){


  var finalHtml=categoriesTitleHtml;
  finalHtml+="<section class='row'>";

  // Loop over categories
  for(var i=0;i< categories.length;i++){
   //insert category value
   var html=categoryHtml;//which is coming from category snippet
   var name= "" +categories[i].name;
   var short_name=categories[i].short_name;
   html=insertProperty(html,"name",name);
   html=insertProperty(html,"short_name",short_name);
   finalHtml+=html;
   finalHtml+="</section>";
   return finalHtml;


  }



}//end of buildcategoriesviewhtml




global.$dc=dc;

})(window);














