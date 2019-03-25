$(document).ready(function() {
  $(".accordion-toggle").bind("click", function() {
    $(".accordion-toggle").removeClass("active");
    $(this).addClass("active");
  });

  $("#trademarkInput").focus();

  $(document).bind("click", function(event) {
    var $trigger = $(".serviceDrop");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
      $(".dropSubLink").removeClass("topheaderDrop");
    }
  });
  $(document).bind("click", function(event) {
    var $trigger = $("body");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
      $("body").removeClass("swipe");
    }
  });
  $(document).bind("click", function(event) {
    var $trigger = $(".dropMenu ");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
      $(".dropMenu ").removeClass("userOpen");
      $(".subMenuLink").slideUp();
    }
  });

  $(".menu-tgl").click(function() {
    $("body").addClass("swipe");
  });
  $(".close-tgl").click(function() {
    $("body").removeClass("swipe");
  });
  $(".serviceDrop > a").click(function() {
    $(".dropSubLink").toggleClass("topheaderDrop");
  });

  $("li.dropMenu > a").click(function() {
    $(this)
      .parent()
      .find(".subMenuLink")
      .slideToggle();
    $(this)
      .parent()
      .toggleClass("userOpen");
    $(this)
      .parent()
      .siblings()
      .removeClass("userOpen");
    $(this)
      .parent()
      .siblings()
      .find(".subMenuLink")
      .slideUp();
  });
});
