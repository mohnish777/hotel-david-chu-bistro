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
var menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

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
//remove the class "active" from home and switch to menu button
var switchMenuToActive=function(){
//remove active from home button
var classes=document.querySelector("#navHomeButton").className;
classes=classes.replace(new RegExp("active","g"),"");
document.querySelector("#navHomeButton").className=classes;

//add "active" to menu button if not already there
classes=document.querySelector("#navMenuButton").className;
if(classes.indexOf("active")===-1){
   classes+=" active";
   document.querySelector("#navMenuButton").className=classes;
  }
};

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
  showLoading("#main-content")
  
  $ajaxUtils.sendGetRequest(  //1st call
    allCategoriesUrl,
    buildAndShowCategoriesHTML,true);
};

//Load the menu items view
// categoryShort is the short name for a category(lunch,soups)
dc.loadMenuItems=function(categoryShort){
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  menuItemsUrl + categoryShort,
  buildAndShowMenuItemsHTML);
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

        switchMenuToActive();
        var categoriesViewHtml=
        buildCategoriesViewHtml(categories,
                                   categoriesTitleHtml,
                                   categoryHtml);
       
        insertHtml("#main-content",categoriesViewHtml)
        
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

}
   finalHtml+="</section>";
   return finalHtml;

}//end of buildcategoriesviewhtml



//builds html for the single category page based on the data
//from the server
function buildAndShowMenuItemsHTML(categoryMenuItems){
  // load title snippet of menu item page
  console.log("mohnish2")
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function(menuItemsTitleHtml){
      //Retrive single menu items snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function(menuItemHtml){
          var menuItemsViewHtml=
          buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);

    },false);
}
//Using category and menu items data and snippts html
// build menu items view html to be inserted into page

function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml){
  console.log("mohnish3")
  menuItemsTitleHtml=
  insertProperty(menuItemsTitleHtml,
                  "name",
                  categoryMenuItems.category.name);

  menuItemsTitleHtml=
  insertProperty(menuItemsTitleHtml,
                 "special_instructions",
                 categoryMenuItems.category.special_instructions)



  var finalHtml=menuItemsTitleHtml
  finalHtml+="<section class='row'>";

  //loop over menu items
  var menuItems=categoryMenuItems.menu_items;
  var catShortName=categoryMenuItems.category.short_name;//eg L,A,B
  for(var i = 0; i < menuItems.length; i++){
    //Insert menu items values
    var html=menuItemHtml;
    html=
        insertProperty(html,"short_name",menuItems[i].short_name);
    html=
        insertProperty(html,"catShortName",catShortName);
    html=
        insertItemPrice(html,
                       "price_small",
                        menuItems[i].price_small);
    html=
        insertItemPortionName(html,
                              "small_portion_name",
                              menuItems[i].small_portion_name);
    html=
        insertItemPrice(html,
                        "price_large",
                        menuItems[i].price_large);
    html=
        insertItemPortionName(html,
                              "large_portion_name",
                              menuItems[i].large_portion_name)
    html=
        insertProperty(html,
                      "name",
                      menuItems[i].name);

    html=
        insertProperty(html,
                      "description",
                      menuItems[i].description);
    // Add clearfix after every second menu item

    if(i%2!=0){
      html+="<div class='clearfix visible-lg-block visible-md-block'></div>"
    }

    finalHtml+=html;

  }//end of for loop

finalHtml+="</section>";
return finalHtml
}//end of function

//if not specified with "$" if price exists
function insertItemPrice(html,
                         pricePropName,
                         priceValue){


  //if not specified replace it with empty string
  if(!priceValue){
    return insertProperty(html,pricePropName,"");// reason we can't leave it with curly braces if price in not specified 
  }
  priceValue= "$" + priceValue.toFixed(2);
  html=insertProperty(html,pricePropName,priceValue);
  return html
}

//append portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue){
// if not specified,return original string
if(!portionPropName){
  return insertProperty(html,portionPropName,"");
}
portionValue="("+ portionValue +")";
html=insertProperty(html,portionPropName,portionValue);
return html;

}



global.$dc=dc;

})(window);














