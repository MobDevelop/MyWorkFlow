function Submit_Value(validateGroup, el) {
    if (typeof (Page_ClientValidate) == 'function') {
        if (validateGroup == "")
            Page_ClientValidate(); //all 
        else 
            Page_ClientValidate(validateGroup); //group

        if (Page_IsValid == false) {
            return false;
        }
        else {
            $(el).toggleClass('active');
        }
    }
    else
    { $(el).toggleClass('active');  }
}
/* RESUME. Hard-coded cost */
function loadCost(tid)
{
    try {
        $.ajax({
            url: "/services/loadcost.ashx",
            type: "POST",
            data: ({ 'tid': tid}),
            dataType: "html",
            cache: false,
            timeout: 60000,
            success: function (content) {
                $("#spanCost").text(content);
            },
            error: function (req) {
                $("#spanCost").text('$199');
            }
        });
    }
    catch (e) {
        $("#spanCost").text('$199');
    }
}

function RequestPhoneCall(tid,phone)
{
    try {
        $.ajax({
            url: "/services/mobile_phone.ashx",
            type: "POST",
            data: ({ 'tid': tid, 'PhoneNumber': phone }),
            dataType: "html",
            cache: false,
            timeout: 60000,
            success: function (content) {
                    //do not want to show anything.
            },
            error: function (req) {
            }
        });
    }
    catch (e) {
    }
}

function changeState(el) {
    if (el.readOnly) el.checked = el.readOnly = false;
    else if (!el.checked) el.readOnly = el.indeterminate = true;
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
function popitup(url) {
    newwindow = window.open(url, 'name', 'height=650,width=890,scrollbars=1');
    if (window.focus) { newwindow.focus() }
    return false;
}
function tabOnEnter (field, evt) {  
   var keyCode = document.layers ? evt.which : document.all ? evt.keyCode : evt.keyCode;
   if (keyCode != 13 && keyCode !=9)
     return true;
   else {
     var el=getNextElement(field);
     if (el.type!='hidden')
        el.focus(); 
     else
        while (el.type=='hidden')
           el=getNextElement(el); 
        el.focus(); 
     return false;
   }
 }

function getNextElement (field) {
   var form = field.form;
   for (var e = 0; e < form.elements.length; e++) { 
     if (field == form.elements[e])
         break;
   }
   return form.elements[++e % form.elements.length];
 }
     
function initRollovers() {
	if (!document.getElementById) return
	
	var aPreLoad = new Array();
	var tagsToConsider = new Array("img", "input");
	var sTempSrc;
	
	for (var j = 0; j < tagsToConsider.length; j++) {
		var aImages = document.getElementsByTagName(tagsToConsider[j]);
		
		for (var i = 0; i < aImages.length; i++) {
		    var parentClass = "";
		    if (aImages[i].parentNode) parentClass = aImages[i].parentNode.className;		
			if (aImages[i].className == 'imgover' || parentClass == "imgover") {
				var src = aImages[i].getAttribute('src');
				var ftype = src.substring(src.lastIndexOf('.'), src.length);
				var hsrc = src.replace(ftype, '_over'+ftype);
	
				aImages[i].setAttribute('hsrc', hsrc);
				
				aPreLoad[i] = new Image();
				aPreLoad[i].src = hsrc;
				
				aImages[i].onmouseover = function() {
					sTempSrc = this.getAttribute('src');
					this.setAttribute('src', this.getAttribute('hsrc'));
				}	
				
				aImages[i].onmouseout = function() {
					if (!sTempSrc) sTempSrc = this.getAttribute('src').replace('_over'+ftype, ftype);
					this.setAttribute('src', sTempSrc);
				}
			}
		}
	}
}


/* Widely used functions */
function OpenDiscount() {
window.open("/discount.aspx", 'news', 'scrollbars,resizable,width=620,height=620');
return false;        
}

function OpenWindow(url, title, width, height) {
window.open(url, title, 'scrollbars,resizable,width=' + width + ',height=' + height);  
return false;      
}

/* Utility functions */

function addLoadListener(fn)
{
  if (typeof window.addEventListener != 'undefined')
  {
    window.addEventListener('load', fn, false);
  }
  else if (typeof document.addEventListener != 'undefined')
  {
    document.addEventListener('load', fn, false);
  }
  else if (typeof window.attachEvent != 'undefined')
  {
    window.attachEvent('onload', fn);
  }
  else
  {
    var oldfn = window.onload;
    if (typeof window.onload != 'function')
    {
      window.onload = fn;
    }
    else
    {
      window.onload = function()
      {
        oldfn();
        fn();
      };
    }
  }
}

function attachEventListener(target, eventType, functionRef, capture)
{
  if (typeof target.addEventListener != "undefined")
  {
    target.addEventListener(eventType, functionRef, capture);
  }
  else if (typeof target.attachEvent != "undefined")
  {
    target.attachEvent("on" + eventType, functionRef);
  }
  else
  {
    eventType = "on" + eventType;

    if (typeof target[eventType] == "function")
    {
      var oldListener = target[eventType];

      target[eventType] = function()
      {
        oldListener();

        return functionRef();
      }
    }
    else
    {
      target[eventType] = functionRef;
    }
  }

  return true;
}

function getEventTarget(event) {
    var targetElement = null;

    if (typeof event.target != "undefined") {
        targetElement = event.target;
    }
    else {
        targetElement = event.srcElement;
    }

    while (targetElement.nodeType == 3 && targetElement.parentNode != null) {
        targetElement = targetElement.parentNode;
    }

    return targetElement;
}

function getScrollingPosition() {
    //array for X and Y scroll position
    var position = [0, 0];

    //if the window.pageYOffset property is supported
    if (typeof window.pageYOffset != 'undefined') {
        //store position values
        position = [
            window.pageXOffset,
            window.pageYOffset
        ];
    }

    //if the documentElement.scrollTop property is supported
    //and the value is greater than zero
    if (typeof document.documentElement.scrollTop != 'undefined'
      && document.documentElement.scrollTop > 0) {
        //store position values
        position = [
            document.documentElement.scrollLeft,
            document.documentElement.scrollTop
        ];
    }

        //if the body.scrollTop property is supported
    else if (typeof document.body.scrollTop != 'undefined') {
        //store position values
        position = [
            document.body.scrollLeft,
            document.body.scrollTop
        ];
    }

    //return the array
    return position;
}

function getElementsByAttribute(attribute, attributeValue) {
    var elementArray = new Array();
    var matchedArray = new Array();

    if (document.all) {
        elementArray = document.all;
    }
    else {
        elementArray = document.getElementsByTagName("*");
    }

    for (var i = 0; i < elementArray.length; i++) {
        if (attribute == "class") {
            var pattern = new RegExp("(^| )" + attributeValue + "( |$)");

            if (elementArray[i].className.match(pattern)) {
                matchedArray[matchedArray.length] = elementArray[i];
            }
        }
        else if (attribute == "for") {
            if (elementArray[i].getAttribute("htmlFor") || elementArray[i].getAttribute("for")) {
                if (elementArray[i].htmlFor == attributeValue) {
                    matchedArray[matchedArray.length] = elementArray[i];
                }
            }
        }
        else if (elementArray[i].getAttribute(attribute) == attributeValue) {
            matchedArray[matchedArray.length] = elementArray[i];
        }
    }

    return matchedArray;
}

function replaceInnerText(element, text) {
    var elem = document.getElementById(element);
    if (elem != null) {
        if (typeof (elem.text) != 'undefined')
            elem.text = text;
        else if (typeof (elem.textContent) != 'undefined')
            elem.textContent = text;
        else if (typeof (elem.innerText) != 'undefined')
            elem.innerText = text;
    }
}
function op_jump(objSelect) {
    if (objSelect.selectedIndex <= 0) return false;
    var objOpt = objSelect.options[objSelect.selectedIndex];
    window.location.href = objOpt.value;
}
function initTooltips() {
    var imageArrays = getElementsByAttribute("class", "imageArray");

    for (var i = 0; i < imageArrays.length; i++) {
        var theimages = imageArrays[i].getElementsByTagName("img");
        for (var j = 0; j < theimages.length; j++) {
            attachEventListener(theimages[j], "mouseover", showTip, false);
            attachEventListener(theimages[j], "mouseout", hideTip, false);
            attachEventListener(theimages[j], "mousemove", moveTip, false);
        }

    }
    return true;
}

var ALREADY_SET = false;
function showTip(event) {
    if (ALREADY_SET) return;

    if (typeof event == "undefined") {
        event = window.event;
    }

    var target = getEventTarget(event);

    var tip = document.createElement("div");
    var content = target.getAttribute("alt");

    if (content == "") return;

    target.tooltip = tip;
    target.oldtile = target.getAttribute("alt");

    target.setAttribute("title", "");

    if (target.getAttribute("id") != "") {
        tip.setAttribute("id", target.getAttribute("id") + "tooltip");
    }

    tip.className = "tooltip";

    content = content.replace(/&lt;/g, "<");
    content = content.replace(/&gt;/g, ">");
    content = content.replace(/%/g, "/");

    if (content.substr(0, 2) == "--") {
        content = content.substring(2, content.length);
    }
    else {
        if (content.indexOf(" - ") == -1) {
            content = "<b>" + content + "</b>";
        } else {
            content = "<b>" + content.replace(" - ", "</b><br />");
        }
    }

    tip.innerHTML = content;

    var scrollingPosition = getScrollingPosition();
    var cursorPosition = [0, 0];

    if (typeof event.pageX != "undefined" && typeof event.x != "undefined") {
        cursorPosition[0] = event.pageX;
        cursorPosition[1] = event.pageY;
    }
    else {
        cursorPosition[0] = event.clientX + scrollingPosition[0];
        cursorPosition[1] = event.clientY + scrollingPosition[1];
    }

    tip.style.position = "absolute";
    tip.style.left = cursorPosition[0] + 10 + "px";
    tip.style.top = cursorPosition[1] + 10 + "px";
    document.getElementsByTagName("body")[0].appendChild(tip);
    ALREADY_SET = true;

    return true;
}

function hideTip(event) {
    if (typeof event == "undefined") {
        event = window.event;
    }

    var target = getEventTarget(event);

    if (target.tooltip != null) {
        target.setAttribute("title", target.tooltip.childNodes[0].nodeValue);
        target.tooltip.parentNode.removeChild(target.tooltip);
    }

    ALREADY_SET = false;

    return false;
}

function moveTip(event) {
    if (typeof event == "undefined") {
        event = window.event;
    }

    var target = getEventTarget(event);

    if (target.tooltip != null) {
        var scrollingPosition = getScrollingPosition();
        var cursorPosition = [0, 0];

        if (typeof event.pageX != "undefined" && typeof event.x != "undefined") {
            cursorPosition[0] = event.pageX;
            cursorPosition[1] = event.pageY;
        }
        else {
            cursorPosition[0] = event.clientX + scrollingPosition[0];
            cursorPosition[1] = event.clientY + scrollingPosition[1];
        }

        target.tooltip.style.left = cursorPosition[0] + 10 + "px";
        target.tooltip.style.top = cursorPosition[1] + 10 + "px";


    }

    return false;
}

function ShowRecent(num) {
    for (i = 1; i < 4; i++) {
        if (i == num) {
            document.getElementById("recentArray" + i).style.display = "block";
            document.getElementById("recentArrayLink" + i).style.visibility = "hidden";
        } else {
            document.getElementById("recentArray" + i).style.display = "none";
            document.getElementById("recentArrayLink" + i).style.visibility = "visible";
        }
    }
    return false;
}

function getImgSize(id) {

    var pic = document.getElementById(id);

    if (pic) {
        var h = pic.offsetHeight;
        var w = pic.offsetWidth;
        var maxWidth = 160;
        var maxHeight = 80;

        if (h == 0)
            h = 80;

        if (w == 0)
            w = 160;

        var widthScaleFactor = maxWidth / w;
        var heightScaleFactor = maxHeight / h;
        var finalScaleFactor = 0;


        if (widthScaleFactor < heightScaleFactor) {
            if (h * widthScaleFactor > maxHeight) {
                heightScaleFactor = (maxHeight * widthScaleFactor) / h;
                finalScaleFactor = widthScaleFactor * heightScaleFactor;
            }
            else {
                finalScaleFactor = widthScaleFactor;
            }
        }
        else if (widthScaleFactor > heightScaleFactor) {
            if (w * heightScaleFactor > maxWidth) {
                widthScaleFactor = (maxWidth * heightScaleFactor) / w;
                finalScaleFactor = widthScaleFactor * heightScaleFactor;
            }
            else {
                finalScaleFactor = heightScaleFactor;
            }
        }
        else {
            finalScaleFactor = widthScaleFactor;
        }

        pic.style.width = w * finalScaleFactor + "px";
        pic.style.height = h * finalScaleFactor + "px";
    }
}


function isValidEmail(str) {
    return (str.indexOf(".") > 2) && (str.indexOf("@") > 0);
}

 
function removejscssfile(filename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
    var allsuspects = document.getElementsByTagName(targetelement)
    for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}

