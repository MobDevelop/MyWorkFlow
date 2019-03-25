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
  addEventListener("blur", chatInfoBlur, true);
  $("#image-input-element").change(function(input) {
    if (
      input.originalEvent.srcElement.files &&
      input.originalEvent.srcElement.files[0]
    ) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $("#imageDetailImage").attr("src", e.target.result);
      };

      reader.readAsDataURL(input.originalEvent.srcElement.files[0]);
    }
    $("#imageDetailDialog").modal("show");
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
    $("#descriptionDetail").css("display", "none");
    $("#textImageDetail").css("display", "inherit");
    $("#imageDetailStep").value(2);
  }
});

function chatInfoBlur() {
  if ($("#trademarkInput").val().length == 0) {
    $(".chatInfo").css("display", "none");
  } else {
    $("#trademarkNameInput").text($("#trademarkInput").val());
    $("#chatValue").text("1");
    $(".chatInfo").css("display", "inherit");
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
