/*$(".menu-tgl").click(function() {
  $("body").addClass("swipe");
});
$(".close-tgl").click(function() {
  $("body").removeClass("swipe");
});
$(document).on("click", function(event) {
  var $trigger = $("body");
  if ($trigger !== event.target && !$trigger.has(event.target).length) {
    $("body").removeClass("swipe");
  }
});

$(document).on("click", function(event) {
  var $trigger = $(".dropMenu ");
  if ($trigger !== event.target && !$trigger.has(event.target).length) {
    $(".dropMenu ").removeClass("userOpen");
    $(".subMenuLink").slideUp();
  }
});
$(document).ready(function() {
  $(".accordion-toggle").on("click", function() {
    $(".accordion-toggle").removeClass("active");
    $(this).addClass("active");
  });
});*/
var image = "";
var imageRecognized = false;
var columnCount = 6;

function getCookie(cKey) {
  var cookieValue = document.cookie;
  var cookieArr = cookieValue.split(";");
  var temp = "";
  cookieArr.forEach(function(cookieEach) {
    var key = cookieEach.split("=")[0];
    var value = cookieEach.split("=")[1];
    if (key.trim() == cKey) {
      temp = value;
      return;
    }
  });
  return temp;
}
function setCookie(key, value) {
  document.cookie = key + "=" + value;
}

$(document).ready(function() {
  $(".tgl-subMenu > a").mouseenter(function() {
    $(this)
      .parent()
      .find(".dropdown-menu")
      .fadeIn();
  });
  $(".tgl-subMenu").mouseleave(function() {
    $(this)
      .find(".dropdown-menu")
      .fadeOut();
  });
  $("#image-input-element").change(function(input) {
    if (
      input.originalEvent.srcElement.files &&
      input.originalEvent.srcElement.files[0]
    ) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $("#imageDetailImage").attr("src", e.target.result);
        image = e.target.result;
      };

      reader.readAsDataURL(input.originalEvent.srcElement.files[0]);
      $("#imageDetailDialog").modal("show");
    }
  });
  $("#myColorInput").on("keyup", function(e) {
    if (e.keyCode == 13) {
      changeColorInput();
    }
  });
  if ($("#trademarkInput").val() != undefined) {
    if ($("#trademarkInput").val().length == 0) {
      $("#trademarkInput").val(getCookie("trademarkName"));
    }
  }
  if ($("#trademarkInput").val() != undefined) {
    trademarkBlur();
  }
  if ($("#pickListBody")[0] != undefined) {
    console.log(document.cookie);
    var cookieValue = getCookie("PickLists");
    if (cookieValue != "") {
      var picklistArr = cookieValue.split("~");
      picklistArr.forEach(function(picklistEach) {
        if (picklistEach != "") {
          var picklistitems = picklistEach.split("`");
          addShortTerm(picklistitems[0], picklistitems[1], picklistitems[2]);
        }
      });
    }
  }
  if ($(".costParentDiv")[0] != undefined) {
    var cookieValue = getCookie("CostCount");
    if (cookieValue != 0 && cookieValue != "") {
      cookieValue =
        "($199 + $275) × " + cookieValue / 474 + " = $" + cookieValue;
      $(".costSpan")[0].innerHTML = cookieValue;
      $(".costParentDiv").css("display", "inherit");
    }
  }
});

$(".tooltip-container svg").mouseover(function() {
  $(".tooltip-container span").css("opacity", "1");
});
$(".tooltip-container svg").mouseout(function() {
  $(".tooltip-container span").css("opacity", "0");
});

$("#imageDetailNext").click(function() {
  if ($("#imageDetailStep").val() == 1) {
    if ($(".descriptionTextArea").val() == "") {
      alert("You must type the image description");
      return;
    }
    $("#imageDetailBack").removeAttr("disabled");
    $("#descriptionDetail").css("display", "none");
    $("#textImageDetail").css("display", "inherit");
    $("#colorDetail").css("display", "none");
    $("#imageDetailDialogLongTitle").text("Add texts in your image");
    $("#imageDetailStep").val(2);
    if (!imageRecognized) {
      imageRecognized = true;
      Tesseract.recognize(image).then(function(result) {
        var words = result.words;
        console.log(words);
        var joinstr = "";
        words.forEach(function(element) {
          var replacedText = element.text.replace(/[^a-zA-Z0-9]/g, "");
          if (replacedText != "" && replacedText.length != 1)
            joinstr += replacedText + ",";
        });
        console.log(joinstr);
        $("#myTagInput").tagsinput("add", joinstr);
        $("#myTagInput").tagsinput("refresh");
        $("#textLoadingText").css("display", "none");
      });
    } else {
      $("#textLoadingText").css("display", "none");
    }
  } else if ($("#imageDetailStep").val() == 2) {
    $("#imageDetailNext").text("Confirm");
    $("#descriptionDetail").css("display", "none");
    $("#textImageDetail").css("display", "none");
    $("#colorDetail").css("display", "inherit");
    $("#imageDetailDialogLongTitle").text("Type color to protect");
    $("#imageDetailStep").val(3);
  } else if ($("#imageDetailStep").val() == 3) {
    alert("done");
    if ($("#step12continueBtn")[0].classList[2] == "disabled") {
      $("#step12continueBtn")[0].classList.remove("disabled");
    }
    $("#imageDetailDialog").modal("hide");
  }
});
$("#imageDetailBack").click(function() {
  if ($("#imageDetailStep").val() == 2) {
    $("#imageDetailBack").attr("disabled", "true");
    $("#imageDetailStep").val(1);
    $("#descriptionDetail").css("display", "inherit");
    $("#textImageDetail").css("display", "none");
    $("#colorDetail").css("display", "none");
    $("#textLoadingText").css("display", "inherit");
    $("#imageDetailDialogLongTitle").text("Type your image description");
  } else if ($("#imageDetailStep").val() == 3) {
    $("#imageDetailNext").text("Next");
    $("#imageDetailStep").val(2);
    $("#descriptionDetail").css("display", "none");
    $("#textImageDetail").css("display", "inherit");
    $("#colorDetail").css("display", "none");
    $("#imageDetailDialogLongTitle").text("Add texts in your image");
  }
});
$("#imageDetailDialog").on("hidden.bs.modal", function() {
  $("#imageDetailStep").val(1);
  imageRecognized = false;
  $("#myTagInput").tagsinput("removeAll");
  $("#imageDetailBack").attr("disabled", "true");
  $("#imageDetailNext").text("Next");
  $(".descriptionTextArea").val("");
  $("#descriptionDetail").css("display", "inherit");
  $("#textImageDetail").css("display", "none");
  $("#colorDetail").css("display", "none");
  $("#textLoadingText").css("display", "inherit");
  $("#myColorInput").val("");
  $("#imageDetailDialogLongTitle").text("Type your image description");
});

function changeColorInput() {
  if ($("#myColorInput").val().length != 0) {
    var t = $("#myColorInput").css(
      "background-color",
      $("#myColorInput").val()
    );
    if (t[0].style.backgroundColor != $("#myColorInput").val()) {
      $("#myColorInput").css("background-color", "white");
    }
  }
}
function trademarkBlur() {
  $(".chatInfo").css("display", "none");
  $(".chatText p").text(
    "Let's begin! Please enter your proposed trade mark or select an image. I’ll check for words and phrases that may be difficult to register. Note: a common mistake is being too generic or descriptive."
  );

  if ($("#trademarkInput").val().length == 0) {
    if (
      $("#step12continueBtn")[0].classList[2] != "undefined" &&
      $("#step12continueBtn")[0].classList[2] != "disabled"
    ) {
      $("#step12continueBtn")[0].classList.add("disabled");
    }
  } else {
    $("#trademarkInputSpinner").css("display", "inherit");
    fetch(
      "https://cors-anywhere.herokuapp.com/" +
        "https://www.trademarkia.com/services/search-direct.ashx?sw=" +
        $("#trademarkInput").val(),
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        }
      }
    )
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        $("#trademarkNameInput").text($("#trademarkInput").val());
        $("#chatValue").text(data.Count);
        var cookievalue = $("#trademarkInput").val() + ";";
        setCookie("trademarkName", cookievalue);
        $(".chatInfo").css("display", "inherit");
        $(".chatText p").text(
          "Ok, the next step is to identify your goods and services. Let’s continue."
        );
        if ($("#step12continueBtn")[0].classList[2] == "disabled") {
          $("#step12continueBtn")[0].classList.remove("disabled");
        }
        $("#trademarkInputSpinner").css("display", "none");
      });
  }
}

$("#chatInfo").click(function() {
  window.open(
    "https://search.ipaustralia.gov.au/trademarks/search/directSearch?status=PENDING_REGISTERED&classList=&wp=" +
      $("#trademarkInput").val()
  );
});
function goBack() {
  window.history.back();
}
function goNext(fileName) {
  $("#section").load(fileName + ".html");
}
/******** step2-2 ********/
$("#inlineCheckbox1").click(function() {
  if ($("#inlineCheckbox2")[0].checked == false && this.checked == false) {
    this.checked = true;
  }
  changeSearchInput();
});
$("#inlineCheckbox2").click(function() {
  if ($("#inlineCheckbox1")[0].checked == false && this.checked == false) {
    this.checked = true;
  }
  changeSearchInput();
});

function calcCosts() {
  var goodBody = $("#selectedGoodsListBody")[0];
  var serviceBody = $("#selectedServicesListBody")[0];
  var total = 0;
  if (goodBody.innerHTML.trim() != "No goods selected") {
    total += goodBody.childNodes.length * 474;
  }
  if (serviceBody.innerHTML.trim() != "No services selected") {
    total += serviceBody.childNodes.length * 474;
  }
  if (total == 0) {
    $(".costParentDiv").css("display", "none");
    if (
      $("#step22continueBtn")[0].classList[2] != "undefined" &&
      $("#step22continueBtn")[0].classList[2] != "disabled"
    ) {
      $("#step22continueBtn")[0].classList.add("disabled");
    }
  } else {
    setCookie("CostCount", total);
    total = "($199 + $275) × " + total / 474 + " = $" + total;
    $(".costSpan")[0].innerHTML = total;
    $(".costParentDiv").css("display", "inherit");
    if ($("#step22continueBtn")[0].classList[2] == "disabled") {
      $("#step22continueBtn")[0].classList.remove("disabled");
    }
  }
}

function removePickListItem(spanItem) {
  var ulItem = spanItem.parentNode.parentNode;
  if (ulItem == null) return;
  if (ulItem.childNodes.length == 1) {
    var divItem = ulItem.parentNode;
    var bodyItem = divItem.parentNode;
    if (bodyItem == null) return;
    if (bodyItem.childNodes.length == 1) {
      typeText = bodyItem.parentNode.parentNode.childNodes[1].innerText;
      if (typeText == "Selected goods")
        bodyItem.innerHTML = "No goods selected";
      else if (typeText == "Selected services")
        bodyItem.innerHTML = "No services selected";
      $("#selectTypeChatText p")[0].innerHTML =
        "Please select at least one good or service to continue.To restrict your search to goods or services, use the filter options.";
    } else {
      bodyItem.removeChild(divItem);
    }
  } else {
    ulItem.removeChild(spanItem.parentNode);
  }
  calcCosts();
}

function removeTextFromCookie(text) {
  var cookieValue = getCookie("PickLists");
  var newCookieValue = "";
  if (cookieValue != "") {
    var picklistArr = cookieValue.split("~");
    picklistArr.forEach(function(picklistEach) {
      if (picklistEach != "") {
        var picklistitems = picklistEach.split("`");
        if (text.data != picklistitems[1])
          newCookieValue = newCookieValue + "~" + picklistEach;
      }
    });
  }
  setCookie("PickLists", newCookieValue);
}

function changeSelectedStatusInPickListBody(itemText, selectedText) {
  var invalid = false;
  $("#pickListBody")[0].childNodes.forEach(function(childHeader) {
    if (invalid) return;
    if (childHeader.nodeName != "#text") {
      childHeader.childNodes.forEach(function(childBody) {
        if (invalid) return;
        if (childBody.nodeName != "#text") {
          if (childBody.childNodes[0].textContent == itemText.textContent) {
            invalid = true;
            childBody.childNodes[1].textContent = selectedText;
            return;
          }
        }
      });
    }
  });
}

function addShortTerm(className, pickName, typeName) {
  var goodBody = $("#selectedGoodsListBody")[0];
  var serviceBody = $("#selectedServicesListBody")[0];
  // If there is not class Div, then create one
  if ($("#pickListClassDiv" + className.trim().split(" ")[1])[0] == undefined) {
    var fdiv = document.createElement("div");
    fdiv.id = "pickListClassDiv" + className.trim().split(" ")[1];
    var h6 = document.createElement("h6");
    h6.appendChild(document.createTextNode(className.trim()));
    h6.classList.add("pickListh6Text");
    fdiv.appendChild(h6);
    if (typeName == "goods") {
      if (goodBody.innerHTML.trim() == "No goods selected")
        goodBody.innerHTML = "";
      goodBody.appendChild(fdiv);
    } else {
      if (serviceBody.innerHTML.trim() == "No services selected")
        serviceBody.innerHTML = "";
      serviceBody.appendChild(fdiv);
    }
    $("#selectTypeChatText p")[0].innerHTML =
      "Perform as many searches as you like. Once you have selected all appropriate goods and services, continue to the next step.";
  }
  // Find It's class Div and append the pickList item.
  var pickListClassDiv = $(
    "#pickListClassDiv" + className.trim().split(" ")[1]
  )[0];
  // If there is no ul tag then create add
  if (pickListClassDiv.getElementsByClassName("pickListGroup").length == 0) {
    var itemListDiv = document.createElement("ul");
    itemListDiv.classList.add("pickListGroup");
    pickListClassDiv.appendChild(itemListDiv);
  }
  // Find ul tag and add li tag
  var pickListGroup = pickListClassDiv.getElementsByClassName(
    "pickListGroup"
  )[0];
  var pickListContainer = document.createElement("li");
  pickListContainer.classList.add("pickListContainer");
  var pickSpan = document.createElement("span");
  pickSpan.classList.add("pickSpan");
  var pickSpanText = document.createTextNode(pickName);
  pickSpan.appendChild(pickSpanText);
  var pickRemoveSpan = document.createElement("span");
  pickRemoveSpan.appendChild(document.createTextNode("x"));
  pickRemoveSpan.classList.add("removeSpan");
  pickSpan.appendChild(pickRemoveSpan);
  pickSpan.classList.add("btn");
  pickSpan.classList.add("btn-primary");
  pickSpan.classList.add("btn-sm");
  pickSpan.id = "pickSpan" + pickName.trim();
  pickSpan.title = pickName.trim();
  pickListContainer.appendChild(pickSpan);
  pickListGroup.append(pickListContainer);
  calcCosts();
  $(".removeSpan").on("click", function(e) {
    var itemText = e.target.parentNode.childNodes[0];
    changeSelectedStatusInPickListBody(itemText, "select");
    removeTextFromCookie(itemText);
    removePickListItem(itemText.parentNode);
  });
}

function loadMoreEvent(pickListId) {
  $(".loadMore").on("click", function(e) {
    e.preventDefault();
    $("#pickListBody div:hidden")
      .slice(0, 40)
      .slideDown();
    /*if ($("#pickListBody div:hidden").length == 0) {
      $("#load").fadeOut("fast");
    }*/
    console.log($("body").height());
    $("html,body").animate(
      {
        scrollTop: $("body").height()
      },
      1000
    );
  });
  $(pickListId).on("click", function(e) {
    var item = e.target.parentNode;
    var pickItemType = item.parentNode.childNodes[1].childNodes[1].textContent;
    if (item.childNodes[1].innerHTML == "select") {
      item.childNodes[1].innerHTML = "✓";
      changeSelectedStatusInPickListBody(item.childNodes[0], "✓");
    } else {
      item.childNodes[1].innerHTML = "select";
      itemText = item.childNodes[0];
      changeSelectedStatusInPickListBody(itemText, "select");
      removeTextFromCookie(itemText);
      var spanItem = $("[id='pickSpan" + itemText.textContent.trim() + "']")[0];
      removePickListItem(spanItem);
      return;
    }
    addShortTerm(
      item.parentElement.childNodes[1].childNodes[0].innerHTML,
      item.childNodes[0].textContent,
      pickItemType
    );
    var cookieValue = getCookie("PickLists");
    cookieValue =
      cookieValue +
      "~" +
      item.parentElement.childNodes[1].childNodes[0].innerHTML +
      "`" +
      item.childNodes[0].textContent +
      "`" +
      pickItemType;
    setCookie("PickLists", cookieValue);
  });
}

function cookieContainsCurrentValue(pickValue) {
  var cookieValue = getCookie("PickLists");
  var boolValue = false;
  if (cookieValue != "") {
    var picklistArr = cookieValue.split("~");
    picklistArr.forEach(function(picklistEach) {
      if (picklistEach != "") {
        var picklistitems = picklistEach.split("`");
        if (picklistitems[1] == pickValue) boolValue = true;
      }
    });
  }
  return boolValue;
}

function changeSearchInput() {
  $("#pickListDiv").css("display", "none");
  $("#searchInputSpinner").css("display", "inherit");
  if ($("#search-input").val().length != 0) {
    fetch(
      "https://cors-anywhere.herokuapp.com/" +
        "https://www.trademarkia.com/services/goodservice-recom.ashx?sw=" +
        $("#search-input").val(),
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        }
      }
    )
      .then(response => response.json())
      .then(function(data) {
        console.log(data);
        var list = data;
        var inlineStatus = 0;
        $("#pickListBody")[0].innerHTML = "";
        if ($("#inlineCheckbox1")[0].checked) {
          inlineStatus = inlineStatus + 1;
        }
        if ($("#inlineCheckbox2")[0].checked) {
          inlineStatus = inlineStatus + 2;
        }
        list.forEach(function(lEach) {
          if (
            (inlineStatus == 1 && lEach.CID < 35) ||
            (inlineStatus == 2 && lEach.CID > 34) ||
            inlineStatus == 3
          ) {
            lEach.GSPhrase.forEach(function(each) {
              var selectType = cookieContainsCurrentValue(each.Sentence)
                ? "✓"
                : "select";
              if (
                !$("#pickListBody")[0].innerHTML.includes("Class " + lEach.CID)
              ) {
                $("#pickListBody").append(
                  "<div id = 'pickListChildHeader" +
                    lEach.CID +
                    "'> <div class = 'pickListChildHeader'><span> Class " +
                    lEach.CID +
                    "</span><span class = 'pickListTypeSpan'>" +
                    (lEach.CID < 35 ? "goods" : "services") +
                    "</span></div> <div title = '" +
                    each.Sentence +
                    "' class = 'pickListChildBody'>" +
                    each.Sentence +
                    "<span class = 'pickListChildBodySelect btn btn-primary btn-sm'>" +
                    selectType +
                    "</span></span></div> </div>"
                );
              } else {
                //console.log($("#pickListChildHeader" + each.class)[0]);
                var x = document.createElement("div");
                x.appendChild(document.createTextNode(each.Sentence));
                var child = document.createElement("span");
                child.appendChild(document.createTextNode(selectType));
                child.classList.add("pickListChildBodySelect");
                child.classList.add("btn");
                child.classList.add("btn-primary");
                child.classList.add("btn-sm");
                x.classList.add("pickListChildBody");
                x.title = each.Sentence;
                x.appendChild(child);
                $("#pickListChildHeader" + lEach.CID)[0].appendChild(x);
              }
            });
          }
        });
        var x = document.createElement("a");
        x.appendChild(document.createTextNode("Load More"));
        x.classList.add("loadMore");
        $("#pickListBody")[0].appendChild(x);
        $("#pickListDiv").css("display", "inherit");
        $("#pickListBody div")
          .slice(0, 10)
          .show();

        loadMoreEvent(".pickListChildBodySelect");
        $("#selectTypeChatText p")[0].innerHTML =
          "Please select at least one good or service to continue.To restrict your search to goods or services, use the filter options.";
        $("#searchInputSpinner").css("display", "none");
      });
  } else {
    $("#selectTypeChatText p")[0].innerHTML =
      "Ok, let’s search for your goods and services. Enter a keyword and I'll display results as you type. You can conduct multiple searches, so please enter just one term at a time.";
  }
}

function loadPickListTerms() {
  fetch("./data/picklist.json")
    .then(response => response.json())
    .then(function(data) {
      var id = $("#browserPickListSelect")
        .find("option:selected")
        .attr("id");
      var picklistArray = [];
      data.picklist.forEach(function(each) {
        if (each.class == id) {
          picklistArray.push(each);
        }
      });
      $("#browserPickListTableDiv")[0].innerHTML = "";
      picklistArray.forEach(function(each) {
        if (
          !$("#browserPickListTableDiv")[0].innerHTML.includes(
            "Class " + each.class
          )
        ) {
          var spanItem = $("[id='pickSpan" + each.term.trim() + "']")[0];
          var selectItemText = spanItem == undefined ? "select" : "✓";
          $("#browserPickListTableDiv").append(
            "<div id = 'browserPickListChildHeader" +
              each.class +
              "'> <div class = 'browserPickListChildHeader'><span> Class " +
              each.class +
              "</span><span class = 'browserPickListTypeSpan'>" +
              (each.class < 35 ? "goods" : "services") +
              "</span></div> <div class = 'browserPickListChildBody'>" +
              each.term +
              "<span class = 'browserPickListChildBodySelect btn btn-primary btn-sm'>" +
              selectItemText +
              "</span></div> </div>"
          );
        } else {
          //console.log($("#pickListChildHeader" + each.class)[0]);
          var spanItem = $("[id='pickSpan" + each.term.trim() + "']")[0];
          var selectItemText = spanItem == undefined ? "select" : "✓";
          var x = document.createElement("div");
          x.appendChild(document.createTextNode(each.term));
          var child = document.createElement("span");
          child.appendChild(document.createTextNode(selectItemText));
          child.classList.add("browserPickListChildBodySelect");
          child.classList.add("btn");
          child.classList.add("btn-primary");
          child.classList.add("btn-sm");
          x.classList.add("browserPickListChildBody");
          x.appendChild(child);
          $("#browserPickListChildHeader" + each.class)[0].appendChild(x);
        }
      });
      $("#browserPickListTableDiv div")
        .slice(0, columnCount + 2)
        .show();
      if ($("#browserPickListTableDiv")[0].childNodes.length > 0) {
        $("#totalIndex").text($("#browserPickListTableDiv>div div").length - 1);
        $("#startIndex").text("1");
        $("#endIndex").text(
          $("#totalIndex").text() < columnCount
            ? $("#totalIndex").text()
            : columnCount
        );
        $("#browserPickListTableControl").css("display", "-webkit-box");
        $("#browserPickListTableControl").css("display", "flex");
        $("#pickListPrevBtn")[0].classList.add("disabled");
        if ($("#totalIndex").text() < columnCount)
          $("#pickListNextBtn")[0].classList.add("disabled");
        else {
          if ($("#pickListNextBtn")[0].classList[2] == "disabled")
            $("#pickListNextBtn")[0].classList.remove("disabled");
        }
      } else {
        $("#browserPickListTableControl").css("display", "none");
      }
      loadMoreEvent(".browserPickListChildBodySelect");
      $("#browserPickListSelect").css("display", "inherit");
    });
}
function browsePickList() {
  $("#browsePickListDiv").modal("show");
  $("#browserPickListSelect")
    .empty()
    .append('<option selected="selected" id="0">All Classes...</option>');
  for (var i = 1; i <= 45; i++) {
    var option = document.createElement("option");
    option.id = i;
    option.appendChild(document.createTextNode("Class" + i));
    $("#browserPickListSelect")[0].appendChild(option);
  }
  $("#browserPickListTableDiv")[0].innerHTML = "";
  $("#browserPickListTableControl").css("display", "none");
  $("#browserPickListSelect").on("change", function(e) {
    loadPickListTerms();

    $("#currentPickListIndex").val(2 + columnCount);
  });
}
function listTablePagination(direction) {
  var current = parseInt($("#currentPickListIndex").val());
  if (direction == 1) {
    if ($("#pickListPrevBtn")[0].classList[2] == "disabled") return;
    if ($("#pickListNextBtn")[0].classList[2] == "disabled")
      $("#pickListNextBtn")[0].classList.remove("disabled");
    $("#browserPickListTableDiv div")
      .slice(current - columnCount, current)
      .hide();
    $("#browserPickListTableDiv div")
      .slice(current - columnCount * 2, current - columnCount)
      .show();
    $("#currentPickListIndex").val(current - columnCount);
    $("#startIndex").text(current - columnCount * 2 - 1);
    $("#endIndex").text(current - columnCount - 2);
    if ($("#startIndex").text() == 1)
      $("#pickListPrevBtn")[0].classList.add("disabled");
  }
  if (direction == 2) {
    if ($("#pickListNextBtn")[0].classList[2] == "disabled") return;
    if ($("#pickListPrevBtn")[0].classList[2] == "disabled")
      $("#pickListPrevBtn")[0].classList.remove("disabled");
    $("#browserPickListTableDiv div")
      .slice(current - columnCount, current)
      .hide();
    $("#browserPickListTableDiv div")
      .slice(current, current + columnCount)
      .show();
    $("#currentPickListIndex").val(current + columnCount);
    $("#startIndex").text(current - 1);
    $("#endIndex").text(
      current + columnCount - 2 > $("#totalIndex").text()
        ? $("#totalIndex").text()
        : current + columnCount - 2
    );
    if ($("#endIndex").text() == $("#totalIndex").text())
      $("#pickListNextBtn")[0].classList.add("disabled");
  }
}
$(window).scroll(function() {
  if ($(this).scrollTop() > 50) {
    $(".totop").fadeIn();
  } else {
    $(".totop").fadeOut();
  }
});
/**************step4.html *****************/
$("#companyButton").click(function() {
  //console.log($("#indivButton")[0].classList);
  $("#indivButton")[0].classList.replace("btn-primary", "btn-outline-primary");
  $("#companyButton")[0].classList.replace(
    "btn-outline-primary",
    "btn-primary"
  );
  if (!$(".individualForm")[0].classList.contains("hide"))
    //console.log($("#individualForm"));
    $(".individualForm")[0].classList.add("hide");
  $(".companyForm")[0].classList.remove("hide");
});
$("#indivButton").click(function() {
  //console.log($("#indivButton")[0].classList);
  $("#companyButton")[0].classList.replace(
    "btn-primary",
    "btn-outline-primary"
  );
  $("#indivButton")[0].classList.replace("btn-outline-primary", "btn-primary");
  if (!$(".companyForm")[0].classList.contains("hide"))
    $(".companyForm")[0].classList.add("hide");
  $(".individualForm")[0].classList.remove("hide");
});
