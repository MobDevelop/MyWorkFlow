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
});

$(".tooltip-container svg").mouseover(function() {
  $(".tooltip-container span").css("opacity", "1");
});
$(".tooltip-container svg").mouseout(function() {
  $(".tooltip-container span").css("opacity", "0");
});

$("#imageDetailNext").click(function() {
  if ($("#imageDetailStep").val() == 1) {
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
  if ($("#trademarkInput").val().length == 0) {
    $(".chatInfo").css("display", "none");
    $(".chatText p").text(
      "Let's begin! Please enter your proposed trade mark or select an image. I’ll check for words and phrases that may be difficult to register. Note: a common mistake is being too generic or descriptive."
    );
  } else {
    $("#trademarkNameInput").text($("#trademarkInput").val());
    $("#chatValue").text("1");
    $(".chatInfo").css("display", "inherit");
    $(".chatText p").text(
      "Ok, the next step is to identify your goods and services. Let’s continue."
    );
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
});
$("#inlineCheckbox2").click(function() {
  if ($("#inlineCheckbox1")[0].checked == false && this.checked == false) {
    this.checked = true;
  }
});
function loadMoreEvent() {
  $(".loadMore").on("click", function(e) {
    e.preventDefault();
    $("#pickListBody div:hidden")
      .slice(0, 40)
      .slideDown();
    if ($("#pickListBody div:hidden").length == 0) {
      $("#load").fadeOut("fast");
    }
    console.log($("body").height());
    $("html,body").animate(
      {
        scrollTop: $("body").height()
      },
      1000
    );
  });
}
function changeSearchInput() {
  $("#pickListDiv").css("display", "none");
  fetch("./data/picklist.json")
    .then(response => response.json())
    .then(function(data) {
      var list = data[0].picklist;
      $("#pickListBody")[0].innerHTML = "";
      list.forEach(function(each) {
        if (!$("#pickListBody")[0].innerHTML.includes("Class " + each.class)) {
          $("#pickListBody").append(
            "<div id = 'pickListChildHeader" +
              each.class +
              "'> <div class = 'pickListChildHeader'><span> Class " +
              each.class +
              "</span><span class = 'pickListTypeSpan'>" +
              (each.type == undefined ? "goods" : each.type) +
              "</span></div> <div class = 'pickListChildBody'>" +
              each.term +
              "</div> </div>"
          );
        } else {
          //console.log($("#pickListChildHeader" + each.class)[0]);
          var x = document.createElement("div");
          x.appendChild(document.createTextNode(each.term));
          x.classList.add("pickListChildBody");
          $("#pickListChildHeader" + each.class)[0].appendChild(x);
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

      loadMoreEvent();
    });
}
