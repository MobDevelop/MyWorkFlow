var image = "";
var imageRecognized = false;
var columnCount = 6;
var table = "";
const entityList = [
  "",
  "Proprietorship",
  "Corporation",
  "LLC (Limited Liability Company)",
  "Partnership",
  "LP (Limited Partnership)",
  "Joint Ventures",
  "Trust",
  "Other",
  "LLP (Limited Liability Partnership)",
  "Ltd. (Limited Company)",
  "LTDA (Limitada)",
  "S.A. ",
  "S.A. de C.V.",
  "GmbH",
  "mbH",
  "N.V. "
];
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
  $("#trademarkInput").on("keyup", function(e) {
    if (e.keyCode == 13) {
      trademarkBlur();
    }
  });
  $("#search-input").on("keyup", function(e) {
    if (e.keyCode == 13) {
      changeSearchInput();
    }
  });
  if ($("#trademarkInput").val() != undefined) {
    // Step 1-2
    if ($("#trademarkInput").val().length == 0) {
      $("#trademarkInput").val(getCookie("trademarkName"));
    }
    trademarkBlur();
  }

  if ($("#pickListBody")[0] != undefined) {
    // Step 2-2
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
    //console.log(cookieValue);
    if (cookieValue != 0 && cookieValue != "") {
      cookieValue =
        "($199 + $275) × " + cookieValue / 474 + " = $" + cookieValue;
      $(".costSpan")[0].innerHTML = cookieValue;
      $(".costParentDiv").css("display", "inherit");
    }
  }
  if ($(".myTradeMarkName")[0] != undefined) {
    var cookieValue = getCookie("trademarkName");
    if (cookieValue != "" && cookieValue != undefined) {
      $(".myTradeMarkName")[0].innerHTML = cookieValue;
    }
  }
  if ($("#trademarkNameDivBody")[0] != undefined) {
    var cookieValue = getCookie("trademarkName");
    if (cookieValue != "" && cookieValue != undefined) {
      $("#trademarkNameDivBody")[0].innerHTML = cookieValue;
    }
  }
  if ($(".questionForm")[0] != undefined) {
    // Step 3-2
    var datepickerList = addQuestions();
    datepickerList.forEach(function(each) {
      $(each).datepicker({
        format: "mm-dd-yyyy",
        todayBtn: "linked"
      });
      $(each).on("changeDate", function(ev) {
        $(this).datepicker("hide");
      });
    });
  }

  if ($(".individualForm")[0] != undefined) {
    //step4-1
    console.log(getCookie("currentStatus"));
    console.log(getCookie("ownerForm"));
    //setCookie("currentStatus", "");
    fetch(
      "https://cors-anywhere.herokuapp.com/" +
        "https://www.trademarkia.com/services/country.ashx",
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
        data.sort((a, b) =>
          a.ShowOrder > b.ShowOrder ? -1 : b.ShowOrder > a.ShowOrder ? 1 : 0
        );
        var appendStr = "";
        data.forEach(function(each) {
          appendStr +=
            "<option value = '" +
            each.CountryID +
            "'>" +
            each.CountryName +
            "</option>";
        });
        $("#indivCitizenSelect").html(appendStr);
        $("#indivCountrySelect").html(appendStr);
        $("#organizationCountrySelect").html(appendStr);
        const currentStatus = getCookie("currentStatus");
        if (currentStatus.split("`")[0] == "1") setOwnerForm(1);
        else if (currentStatus.split("`")[0] == "2") {
          $(".currentIndividual")[0].style.display = "none";
          $("#companyButton").click();
          setOrganizationForm();
        }
      });
  }

  if ($(".additionalForm")[0] != undefined) {
    //step4-2
    fetch(
      "https://cors-anywhere.herokuapp.com/" +
        "https://www.trademarkia.com/services/country.ashx",
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
        data.sort((a, b) =>
          a.ShowOrder > b.ShowOrder ? -1 : b.ShowOrder > a.ShowOrder ? 1 : 0
        );
        var appendStr = "";
        data.forEach(function(each) {
          appendStr +=
            "<option value = '" +
            each.CountryID +
            "'>" +
            each.CountryName +
            "</option>";
        });
        $("#ownerCitizen").html(appendStr);
        const currentStatus = getCookie("currentStatus");
        const ownerForm = getCookie("ownerForm");
        console.log(currentStatus);
        console.log(ownerForm);
        if (currentStatus.split("`")[1] >= 2) {
          setOrgForm(2);
        }
      });
  }

  if ($(".acQuestionForm")[0] != undefined) {
    //step5

    fetch(
      "https://cors-anywhere.herokuapp.com/" +
        "https://www.trademarkia.com/services/country.ashx",
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
        data.sort((a, b) =>
          a.ShowOrder > b.ShowOrder ? -1 : b.ShowOrder > a.ShowOrder ? 1 : 0
        );
        var appendStr = "";
        data.forEach(function(each) {
          appendStr +=
            "<option value = '" +
            each.CountryID +
            "'>" +
            each.CountryName +
            "</option>";
        });

        $("#summaryCountrySelect").html(appendStr);
        if (getCookie("summaryForm")) {
          var summaryList = getCookie("summaryForm").split("~");
          console.log(summaryList);
          $(
            "#anotherCountryRadio-" + (summaryList[0] == "option1" ? 1 : 2)
          )[0].setAttribute("checked", "");
          $(
            "#anotherCountryRadio-" + (summaryList[0] == "option1" ? 2 : 1)
          )[0].removeAttribute("checked");
          $("#summaryCountrySelect").val(summaryList[1].split("("));
          $("#summaryDateSelect").val(summaryList[2]);
          $(
            "#priorFilingRadio" + (summaryList[3] == "option1" ? 1 : 2)
          )[0].setAttribute("checked", "");
          $(
            "#priorFilingRadio" + (summaryList[3] == "option1" ? 2 : 1)
          )[0].removeAttribute("checked");
          $("#multipleCountriesRadio-1")[0].removeAttribute("checked", "");
          $(
            "#multipleCountriesRadio-" +
              (summaryList[4] == "option1"
                ? 1
                : summaryList[4] == "option2"
                ? 2
                : 3)
          )[0].setAttribute("checked", "");
        }
      });
  }

  if ($("#reviewTrademarkName")[0] != undefined) {
    // step6
    fetch(
      "https://cors-anywhere.herokuapp.com/" +
        "https://www.trademarkia.com/services/country.ashx",
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
        let countryList = [];
        data.forEach(function(each) {
          countryList[each["CountryID"]] = each["CountryName"];
        });
        console.log(countryList);
        $("#reviewTrademarkName")[0].innerHTML = getCookie("trademarkName");
        let pickLists = getCookie("PickLists").split("~");
        let pickArray = [],
          prevPick = null;
        pickLists.forEach(function(pickEach) {
          if (pickEach != "") {
            let pickEachList = pickEach.split("`");
            let temp = 0;
            for (let i = 0; i < pickArray.length; i++) {
              if (pickArray[i][0] == pickEachList[0]) {
                pickArray[i][1] += " , " + pickEachList[1];
                temp = 1;
              }
            }
            if (temp == 0) {
              pickArray.push(pickEachList);
            }
          }
        });
        let str = "";
        pickArray.forEach(function(pickEach) {
          str += pickEach[0] + ": " + pickEach[1] + "<br/>";
        });
        $("#reviewClassItems")[0].innerHTML = str;
        let searchCookie = getCookie("searchForm");
        let searchFormLists = searchCookie.split("~");
        str = "";
        if (searchFormLists != "") {
          searchFormLists.forEach(function(searchEach) {
            if (searchEach != "") {
              let searchEachList = searchEach.split("`");
              str +=
                searchEachList[0] +
                ": <br/>&nbsp&nbsp&nbsp description: " +
                searchEachList[2] +
                "<br/>";
              if (searchEachList[3] != "") {
                str +=
                  "&nbsp&nbsp&nbsp come up with the logo: " +
                  searchEachList[3] +
                  "<br/>";
                str +=
                  "&nbsp&nbsp&nbsp start selling: " +
                  searchEachList[4] +
                  "<br/>";
              }
            }
          });
        }
        $("#reviewClassInformation")[0].innerHTML = str;
        str = "";
        let multipleForm = getCookie("summaryForm");
        let multipleFormList = multipleForm.split("~");
        str +=
          "First Country: " +
          multipleFormList[1].split("(")[1].split(")")[0] +
          "<br/>";
        var dateList = [
          "In the last 6 months",
          "More than 6 months ago",
          "Do not know"
        ];
        str +=
          "First date in other country: " +
          dateList[multipleFormList[2] - 1] +
          "<br/>";
        str +=
          "Want to try and claim priority on this prior filing: " +
          (multipleFormList[3] == "option1" ? "Yes" : "No") +
          "<br/>";
        str +=
          "Wish to register this trademark in multiple countries: " +
          (multipleFormList[4] == "option1"
            ? "Yes"
            : multipleFormList[4] == "option2"
            ? "No"
            : "Maybe Later") +
          "<br/>";
        str +=
          "Countries: " + multipleFormList[5].split("`").join(", ") + "<br/>";
        $("#reviewMultipleCountries")[0].innerHTML = str;
        const currentStatus = getCookie("currentStatus").split("`");
        const ownerForm = getCookie("ownerForm").split("~");
        console.log(currentStatus);
        if (currentStatus[0] == "1") {
          str = "Individual<br/><br/>";
          for (let i = 0; i < parseInt(currentStatus[1]); i++) {
            const ownerEach = ownerForm[i + 1].split("`");
            str +=
              "First Name: " +
              ownerEach[0] +
              "<br/>Last Name: " +
              ownerEach[1] +
              "<br/>Citizenship: " +
              countryList[ownerEach[2]] +
              "<br/>Address: " +
              ownerEach[3] +
              "<br/>City: " +
              ownerEach[4] +
              "<br/>State/Province: " +
              ownerEach[5] +
              "<br/>Country: " +
              countryList[ownerEach[6]] +
              "<br/>Zip/Postal Code: " +
              ownerEach[7];
            str += "<br/><br/>";
          }
        }
        if (currentStatus[0] == "2") {
          str = "Organization<br/><br/>";

          const ownerEach = ownerForm[1].split("`");
          str +=
            "Organinzation Name: " +
            ownerEach[0] +
            "<br/>Entity Type: " +
            entityList[ownerEach[1]] +
            "<br/>Address: " +
            ownerEach[2] +
            "<br/>City: " +
            ownerEach[3] +
            "<br/>State/Province: " +
            ownerEach[4] +
            "<br/>Zip/Postal Code: " +
            ownerEach[5] +
            "<br/>Country: " +
            countryList[ownerEach[6]] +
            "<br/>Place where legally organized: " +
            ownerEach[7] +
            "<br/>Contact Name: " +
            ownerEach[8] +
            "<br/>Contact Title: " +
            ownerEach[9] +
            "<br/> Contact Phone: " +
            ownerEach[10];

          str += "<br/><br/>Additional Owners<br/><br/>";
          for (let i = 2; i <= currentStatus[1]; i++) {
            const addEach = ownerForm[i].split("`");
            str +=
              "First Name: " +
              addEach[0] +
              "<br/>Last Name: " +
              addEach[1] +
              "<br/>Citizenship: " +
              countryList[addEach[2]];
            str += "<br/><br/>";
          }
        }
        $("#ownershipInformation")[0].innerHTML = str;
      });
  }

  if ($("#exampleTable")[0] != undefined) {
    $("#exampleTable thead tr")
      .clone(true)
      .appendTo("#exampleTable thead");
    $("#exampleTable thead tr:eq(1) th:eq(1)")[0].innerHTML = "";
    $("#exampleTable thead tr:eq(1) th").each(function(i) {
      var title = $(this).text();
      $(this).html('<input type="text" placeholder="Search ' + title + '" />');
      $("input", this).on("keyup change", function() {
        console.log(this);
        if (table.column(i).search() !== this.value) {
          table
            .column(i)
            .search(this.value)
            .draw();
        }
      });
    });

    table = $("#exampleTable").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      columnDefs: [
        {
          targets: 0,
          checkboxes: {
            selectRow: true
          }
        },
        { width: "10px", targets: [0] },
        { width: "60%", targets: [2] }
      ],
      select: {
        style: "multi"
      },
      order: [[1, "asc"]],
      initComplete: function() {}
    });

    fetch(
      "https://cors-anywhere.herokuapp.com/" +
        "https://www.trademarkia.com/services/tm_country.ashx",
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
        data.forEach(function(each) {
          table.row
            .add([
              each.CountryName,
              each.Region,
              each.CountryName + "(" + each.CountryCost + ")"
            ])
            .draw("false");
        });
        $("#exampleTable")
          .dataTable()
          .api()
          .columns([1])
          .every(function() {
            var column = this;
            var select = $('<select><option value=""></option></select>')
              .appendTo(column.context[0].nTHead.childNodes[3].childNodes[1])
              .on("change", function() {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });

            column
              .data()
              .unique()
              .sort()
              .each(function(d, j) {
                select.append('<option value="' + d + '">' + d + "</option>");
              });
          });
        $("#exampleTable thead tr:eq(1) th:eq(0)")[0].innerHTML = "";
        $("#exampleTable thead tr:eq(1) th:eq(1) input")[0].style.display =
          "none";
        $("#exampleTable thead tr:eq(1) th:eq(1) select")[0].classList =
          "form-control";
        $("#exampleTable_wrapper>div.row:eq(2)>div:eq(0)")[0].classList = "col";
        $("#exampleTable_wrapper>div.row:eq(2)>div:eq(1)")[0].classList = "col";
        countryList = getCookie("summaryForm")
          .split("~")[5]
          .split("`");

        let i = 0;
        while (1) {
          const currentRow = table.row(":eq(" + i + ")");
          if (currentRow.data() == undefined) break;
          countryList.forEach(function(countryEach) {
            if (countryEach != "") {
              if (countryEach == currentRow.data()[0]) {
                console.log(currentRow);
                currentRow.select();
              }
            }
          });
          i++;
        }
      });
  }
});

function setOrgForm(num) {
  if (num == 1) {
    $("#ownerFirstName").val("");
    $("#ownerLastName").val("");
    $("#ownerCitizen").val("US");

    $(".currentIndividual")[0].style.display = "none";
    return;
  }
  const orgList = getCookie("ownerForm")
    .split("~")
    [num].split("`");
  $("#ownerFirstName").val(orgList[0]);
  $("#ownerLastName").val(orgList[1]);
  $("#ownerCitizen").val(orgList[2]);
  let currentStatus = getCookie("currentStatus");
  setCookie("currentStatus", "2`" + currentStatus.split("`")[1] + "`" + num);
  currentStatus = getCookie("currentStatus");
  $(".currentIndividual")[0].style.display = "inherit";
  $(".currentIndividual")[0].innerHTML =
    parseInt(currentStatus.split("`")[2] - 1) +
    "/" +
    parseInt(currentStatus.split("`")[1] - 1);
}

function setOrganizationForm() {
  const orgList = getCookie("ownerForm")
    .split("~")[1]
    .split("`");
  console.log(orgList);
  $("#organizationName").val(orgList[0]);
  $("#entityTypeSelect").val(orgList[1]);
  $("#organizationAddress").val(orgList[2]);
  $("#organizationCity").val(orgList[3]);
  $("#organizationState").val(orgList[4]);
  $("#organizationZip").val(orgList[5]);
  $("#organizationCountrySelect").val(orgList[6]);
  $("#organizationPlace").val(orgList[7]);
  $("#organizationContactName").val(orgList[8]);
  $("#organizationContactTitle").val(orgList[9]);
  $("#organizationContactPhone").val(orgList[10]);
}

function setOwnerForm(num) {
  let ownerList = getCookie("ownerForm").split("~");
  if (num == 0) {
    $("#indivFirstName").val("");
    $("#indivLastName").val("");
    $("#indivCitizenSelect").val("US");
    $("#indivAddress").val("");
    $("#indivCity").val("");
    $("#indivState").val("");
    $("#indivCountrySelect").val("US");
    $("#indivZip").val("");
    $(".currentIndividual")[0].style.display = "none";
  }
  if (getCookie("ownerForm") == "") {
    return;
  }
  const currentStatus = getCookie("currentStatus");
  let currentOwner = ownerList[num];
  if (currentStatus.split("`")[0] == "1") {
    let currentOwnerList = currentOwner.split("`");
    $("#indivFirstName").val(currentOwnerList[0]);
    $("#indivLastName").val(currentOwnerList[1]);
    $("#indivCitizenSelect").val(currentOwnerList[2]);
    $("#indivAddress").val(currentOwnerList[3]);
    $("#indivCity").val(currentOwnerList[4]);
    $("#indivState").val(currentOwnerList[5]);
    $("#indivCountrySelect").val(currentOwnerList[6]);
    $("#indivZip").val(currentOwnerList[7]);
  }
  if (num == 1) {
    setCookie(
      "currentStatus",
      currentStatus.split("`")[0] + "`" + currentStatus.split("`")[1] + "`2"
    );
  } else {
    setCookie(
      "currentStatus",
      currentStatus.split("`")[0] +
        "`" +
        currentStatus.split("`")[1] +
        "`" +
        (parseInt(num) + 1)
    );
  }
  $(".currentIndividual")[0].style.display = "inherit";
  $(".currentIndividual")[0].innerHTML =
    parseInt(getCookie("currentStatus").split("`")[2] - 1) +
    "/" +
    getCookie("currentStatus").split("`")[1];
  console.log(getCookie("currentStatus"));
}

function ownerBack() {
  const currentStatus = getCookie("currentStatus");
  if (parseInt(currentStatus.split("`")[2]) <= 2) {
    self.location = "step3-2.html";
  } else {
    setCookie(
      "currentStatus",
      currentStatus.split("`")[0] +
        "`" +
        currentStatus.split("`")[1] +
        "`" +
        (parseInt(currentStatus.split("`")[2]) - 1)
    );
    setOwnerForm(parseInt(currentStatus.split("`")[2]) - 2);
    console.log(currentStatus);
  }
}

function orgBack() {
  const currentStatus = getCookie("currentStatus").split("`");
  if (parseInt(currentStatus[2]) <= 2) {
    self.location = "step4-1.html";
  } else {
    setCookie(
      "currentStatus",
      currentStatus[0] +
        "`" +
        currentStatus[1] +
        "`" +
        (parseInt(currentStatus[2]) - 1)
    );
    setOrgForm(parseInt(currentStatus[2]) - 1);
  }
}

function continueClicked() {
  console.log("123qwerqwer");
}

function orgFormSubmit() {
  let orgList = getCookie("ownerForm").split("~");
  const currentStatus = getCookie("currentStatus").split("`");
  const orgStr =
    $("#ownerFirstName").val() +
    "`" +
    $("#ownerLastName").val() +
    "`" +
    $("#ownerCitizen").val();
  if (currentStatus[1] == "1") {
    orgList.push(orgStr);
    setCookie("currentStatus", "2`2`2");
  } else {
    orgList[parseInt(currentStatus[2])] = orgStr;
  }
  console.log(orgList);
  setCookie("ownerForm", orgList.join("~"));
  if (parseInt(currentStatus[2]) < parseInt(currentStatus[1])) {
    setCookie(
      "currentStatus",
      "2`" + currentStatus[1] + "`" + (parseInt(currentStatus[2]) + 1)
    );
    setOrgForm(parseInt(currentStatus[2]) + 1);
    return false;
  }
  document.orgForm.action = "step5.html";
  return true;
}

function ownerFormSubmit() {
  if ($(".companyForm")[0].classList.length == 1) {
    //Organization Button Clicked
    if (
      $("#entityTypeSelect").val() == 2 ||
      $("#entityTypeSelect").val() == 3
    ) {
      document.ownerForm.action = "step4-2.html";
    } else document.ownerForm.action = "step5.html";
    const orgStr =
      $("#organizationName").val() +
      "`" +
      $("#entityTypeSelect").val() +
      "`" +
      $("#organizationAddress").val() +
      "`" +
      $("#organizationCity").val() +
      "`" +
      $("#organizationState").val() +
      "`" +
      $("#organizationZip").val() +
      "`" +
      $("#organizationCountrySelect").val() +
      "`" +
      $("#organizationPlace").val() +
      "`" +
      $("#organizationContactName").val() +
      "`" +
      $("#organizationContactTitle").val() +
      "`" +
      $("#organizationContactPhone").val();
    let currentStatus = getCookie("currentStatus").split("`");
    if (currentStatus[0] == "1") {
      setCookie("currentStatus", "2`1`1");
      setCookie("ownerForm", "");
      currentStatus = getCookie("currentStatus").split("`");
    }
    if (currentStatus[0] == "2" && parseInt(currentStatus[1]) > 1) {
      setCookie("currentStatus", "2`" + currentStatus[1] + "`2");
      let ownerList = getCookie("ownerForm").split("~");
      ownerList[1] = orgStr;
      setCookie("ownerForm", ownerList.join("~"));
    } else {
      setCookie("ownerForm", "~" + orgStr);
      setCookie("currentStatus", "2`1`1");
    }
  } else {
    //Individual
    let currentStatus = getCookie("currentStatus");
    const indivStr =
      $("#indivFirstName").val() +
      "`" +
      $("#indivLastName").val() +
      "`" +
      $("#indivCitizenSelect").val() +
      "`" +
      $("#indivAddress").val() +
      "`" +
      $("#indivCity").val() +
      "`" +
      $("#indivState").val() +
      "`" +
      $("#indivCountrySelect").val() +
      "`" +
      $("#indivZip").val();

    if (
      currentStatus == "" ||
      currentStatus.split("`")[0] == "2" ||
      currentStatus.split("`")[1] == "0"
    ) {
      setCookie("ownerForm", "");
      setCookie("currentStatus", "1`1`2");
      currentStatus = getCookie("currentStatus");
    }
    const ownerCookie = getCookie("ownerForm");
    let ownerList = ownerCookie.split("~");
    ownerList[parseInt(currentStatus.split("`")[2]) - 1] = indivStr;
    setCookie("ownerForm", ownerList.join("~"));
    if (
      parseInt(currentStatus.split("`")[1]) >=
      parseInt(currentStatus.split("`")[2])
    ) {
      setOwnerForm(currentStatus.split("`")[2]);
      return false;
    }
    document.ownerForm.action = "step5.html";
  }
  return true;
}

function onSummarySubmit() {
  var summaryStr =
    $("input[name = anotherCountryOptions]:checked").val() +
    "~" +
    $("#summaryCountrySelect").val() +
    "(" +
    $("#summaryCountrySelect")[0].options[
      $("#summaryCountrySelect")[0].selectedIndex
    ].text +
    ")" +
    "~" +
    $("#summaryDateSelect").val() +
    "~" +
    $("input[name = priorFilingOptions]:checked").val() +
    "~" +
    $("input[name = multipleCountriesOptions]:checked").val() +
    "~";
  var checkboxSel = table.column(0).checkboxes.selected();
  //var checkboxStr = "";
  for (var i = 0; i < checkboxSel.length; i++) {
    //console.log(checkboxSel[i]);
    summaryStr += checkboxSel[i] + "`";
  }
  console.log(summaryStr);
  setCookie("summaryForm", summaryStr);
  return true;
}

function ownerSearchAfterSubmit(e) {
  var questionFormStr = "";
  var form = $(".questionForm");
  form[0].childNodes.forEach(function(each) {
    if (each.nodeName != "#text") {
      var selectedClass = each.childNodes[0].childNodes[1].innerHTML
        .split("-")[0]
        .trim();

      questionFormStr +=
        "~" +
        selectedClass +
        "`" +
        $(
          "input[name = radioOption" +
            selectedClass.split(" ")[1].trim() +
            "]:checked"
        ).val() +
        "`" +
        each.childNodes[1].childNodes[1].childNodes[0].childNodes[1]
          .childNodes[0].value +
        "`" +
        each.childNodes[1].childNodes[1].childNodes[1].childNodes[0]
          .childNodes[1].childNodes[0].value +
        "`" +
        each.childNodes[1].childNodes[1].childNodes[1].childNodes[1]
          .childNodes[1].childNodes[0].value;
    }
  });
  //console.log(questionFormStr);
  setCookie("searchForm", questionFormStr);
  return true;
}

$(".tooltip-container svg").mouseover(function() {
  $(".tooltip-container span").css("opacity", "1");
});
$(".tooltip-container svg").mouseout(function() {
  $(".tooltip-container span").css("opacity", "0");
});

/*$("#continueBtn").click(function() {
  $("#submitBtn").click();
});*/

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

function radioBtnClicked(id) {
  if (id.split("-")[1] == "1") {
    $(
      "#" + id
    )[0].parentElement.parentElement.parentElement.parentElement.childNodes[1].childNodes[1].style.display =
      "inherit";
    var inputTags = $(
      "#" + id
    )[0].parentElement.parentElement.parentElement.parentElement.childNodes[1].childNodes[1].getElementsByTagName(
      "input"
    );
    for (var i = 0; i < inputTags.length; i++) {
      var each = inputTags[i];
      each.setAttribute("required", "");
    }
  } else {
    $(
      "#" + id
    )[0].parentElement.parentElement.parentElement.parentElement.childNodes[1].childNodes[1].style.display =
      "none";
    var inputTags = $(
      "#" + id
    )[0].parentElement.parentElement.parentElement.parentElement.childNodes[1].childNodes[1].getElementsByTagName(
      "input"
    );
    for (var i = 0; i < inputTags.length; i++) {
      var each = inputTags[i];
      each.removeAttribute("required");
    }
  }
}

function anotherCountryFunction(id) {
  if (id.split("-")[1] == "1") {
    $(
      "#" + id
    )[0].parentElement.parentElement.parentElement.childNodes[3].style.display =
      "inherit";
  } else {
    $(
      "#" + id
    )[0].parentElement.parentElement.parentElement.childNodes[3].style.display =
      "none";
  }
}

function getRadio(text, className, num) {
  var yesRadio = document.createElement("div");
  yesRadio.setAttribute("class", "form-check form-check-inline");
  var yesInputRadio = document.createElement("input");
  yesInputRadio.setAttribute("class", "form-check-input");
  yesInputRadio.setAttribute("type", "radio");
  yesInputRadio.setAttribute(
    "name",
    "radioOption" + className.split(" ")[1].trim()
  );
  yesInputRadio.setAttribute(
    "id",
    "radioOption" + className.split(" ")[1].trim() + "-" + num
  );
  yesInputRadio.setAttribute("value", num == 1 ? "Yes" : "No");
  yesInputRadio.setAttribute("onclick", "radioBtnClicked(id)");
  if (num == 2) {
    yesInputRadio.setAttribute("checked", "");
  }
  var yesLabelRadio = document.createElement("label");
  yesLabelRadio.innerHTML = text;
  yesLabelRadio.setAttribute("class", "form-check-label");
  yesLabelRadio.setAttribute(
    "for",
    "radioOption" + className.split(" ")[1].trim() + "-" + num
  );
  yesRadio.appendChild(yesInputRadio);
  yesRadio.appendChild(yesLabelRadio);
  return yesRadio;
}

function getDatePicker(text, className, num) {
  var datepipckerContainer = document.createElement("div");
  var datepickerHeader = document.createElement("div");
  datepickerHeader.setAttribute("class", "datepickerHeader");
  var redMul = document.createElement("span");
  redMul.innerHTML = "*";
  redMul.setAttribute("class", "redMul");
  var datepickerText = document.createElement("span");
  datepickerText.innerHTML = text;
  datepickerHeader.appendChild(redMul);
  datepickerHeader.appendChild(datepickerText);
  datepipckerContainer.appendChild(datepickerHeader);
  var datepickerDiv = document.createElement("div");
  datepickerDiv.setAttribute("class", "form-group");
  var datepicker = document.createElement("input");
  datepicker.setAttribute("type", "text");
  datepicker.setAttribute("class", "datepicker form-control");
  datepicker.setAttribute("value", "");
  datepicker.setAttribute(
    "id",
    "dp" + className.split(" ")[1].trim() + "-" + num
  );

  datepickerDiv.appendChild(datepicker);
  datepipckerContainer.appendChild(datepickerDiv);
  return datepipckerContainer;
}

function addQuestions() {
  let questionForm = $(".questionForm")[0];
  var cookieValue = getCookie("PickLists");
  var datepickerIdList = [];
  if (cookieValue != "") {
    var picklistArr = cookieValue.split("~");
    picklistArr.forEach(function(picklistEach) {
      if (picklistEach != "") {
        var picklistitems = picklistEach.split("`");
        var classId = questionForm.querySelector(
          "#classId" + picklistitems[3].split("-")[0].trim()
        );
        if (classId == null) {
          var className = picklistitems[0].trim();
          var questionClassDiv = document.createElement("div");
          questionClassDiv.setAttribute("class", "questionClassDiv");
          var questionClassHeader = document.createElement("div");
          questionClassHeader.setAttribute("class", "questionClassHeader");
          var imageElement = document.createElement("img");
          imageElement.setAttribute("src", "./images/businessman.svg");
          imageElement.setAttribute("class", "questionImage");
          var questionTitle = document.createElement("div");
          questionTitle.innerHTML = "Class " + picklistitems[3].trim();
          questionTitle.setAttribute("class", "questionTitle");
          questionTitle.setAttribute(
            "id",
            "classId" + picklistitems[3].split("-")[0].trim()
          );
          var imageDiv = document.createElement("div");
          imageDiv.appendChild(imageElement);
          questionClassHeader.appendChild(imageDiv);
          questionClassHeader.appendChild(questionTitle);

          var questionBody = document.createElement("div");
          questionBody.setAttribute("class", "questionBody");
          var questionText = document.createElement("div");
          questionText.innerHTML =
            "Are you currently selling any " +
            picklistitems[3]
              .trim()
              .split("-")[1]
              .trim() +
            " using this logo in The United States?";
          questionText.setAttribute("class", "questionText");
          var questionRadioDiv = document.createElement("div");
          questionRadioDiv.appendChild(getRadio("Yes", className, 1));
          questionRadioDiv.appendChild(getRadio("No", className, 2));
          questionRadioDiv.setAttribute("class", "questionRadioDiv");
          questionText.appendChild(questionRadioDiv);
          var questionsDiv = document.createElement("div");
          questionsDiv.setAttribute("class", "questionsDiv");
          var mainQuestion = document.createElement("div");
          mainQuestion.setAttribute("class", "mainQuestion");
          var mainQuestionTitle = document.createElement("div");
          mainQuestionTitle.setAttribute("class", "mainQuestionTitle");
          var redMul = document.createElement("span");
          redMul.innerHTML = "*";
          redMul.setAttribute("class", "redMul");
          mainQuestionTitle.appendChild(redMul);
          var mainQuestionTitleText = document.createElement("span");
          mainQuestionTitleText.innerHTML =
            "Describe what kind of " +
            picklistitems[3]
              .trim()
              .split("-")[1]
              .trim() +
            " products  you will offer on which the logo trademark appears";
          mainQuestionTitle.appendChild(mainQuestionTitleText);
          mainQuestion.appendChild(mainQuestionTitle);
          var mainQuestionBody = document.createElement("div");
          mainQuestionBody.setAttribute("class", "mainQuestionBody form-group");
          var mainQuestionTextArea = document.createElement("textarea");
          mainQuestionTextArea.innerHTML = picklistitems[1];
          mainQuestionTextArea.setAttribute("class", "form-control");
          mainQuestionTextArea.setAttribute(
            "id",
            "textArea" + className.split(" ")[1].trim()
          );
          mainQuestionTextArea.setAttribute("required", "");
          mainQuestionBody.appendChild(mainQuestionTextArea);
          mainQuestion.appendChild(mainQuestionBody);
          var otherQuestion = document.createElement("div");
          otherQuestion.setAttribute("class", "otherQuestion");
          otherQuestion.appendChild(
            getDatePicker(
              "When did you come up with the logo trademark for your business",
              className,
              1
            )
          );
          otherQuestion.appendChild(
            getDatePicker(
              "When did start selling products using the logo trademark in The United States?",
              className,
              2
            )
          );
          datepickerIdList.push(
            "#dp" + className.split(" ")[1].trim() + "-" + 1
          );
          datepickerIdList.push(
            "#dp" + className.split(" ")[1].trim() + "-" + 2
          );
          questionsDiv.appendChild(mainQuestion);
          questionsDiv.appendChild(otherQuestion);
          questionBody.appendChild(questionText);
          questionBody.appendChild(questionsDiv);
          questionClassDiv.appendChild(questionClassHeader);
          questionClassDiv.appendChild(questionBody);
          questionForm.appendChild(questionClassDiv);
        } else {
          classId.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[0].childNodes[1].childNodes[0].innerHTML +=
            " , " + picklistitems[1];
        }
      }
    });
    var searchCookie = getCookie("searchForm");
    var searchFormLists = searchCookie.split("~");
    if (searchFormLists != "" && $(".questionForm")[0].childNodes.length != 0) {
      searchFormLists.forEach(function(searchEach) {
        if (searchEach != "") {
          console.log(searchEach);

          var inputedData = searchEach.split("`");
          var questionDiv = $("#classId" + inputedData[0].split(" ")[1]);
          questionDiv = questionDiv[0].parentNode.parentNode;

          radioBtnClicked(
            "radioOption" +
              inputedData[0].split(" ")[1] +
              "-" +
              (inputedData[1] == "Yes" ? 1 : 2)
          );
          $(
            "#radioOption" +
              inputedData[0].split(" ")[1] +
              "-" +
              (inputedData[1] == "Yes" ? 1 : 2)
          )[0].setAttribute("checked", "");
          $(
            "#radioOption" +
              inputedData[0].split(" ")[1] +
              "-" +
              (inputedData[1] == "Yes" ? 2 : 1)
          )[0].removeAttribute("checked");
          $("#textArea" + inputedData[0].split(" ")[1]).val(inputedData[2]);
          $("#dp" + inputedData[0].split(" ")[1] + "-1").val(inputedData[3]);
          $("#dp" + inputedData[0].split(" ")[1] + "-2").val(inputedData[4]);
        }
      });
    }
  }
  return datepickerIdList;
}

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
  setCookie("CostCount", total);
  if (total == 0) {
    $(".costParentDiv").css("display", "none");
    if (
      $("#step22continueBtn")[0].classList[2] != "undefined" &&
      $("#step22continueBtn")[0].classList[2] != "disabled"
    ) {
      $("#step22continueBtn")[0].classList.add("disabled");
    }
  } else {
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
      pickItemType +
      "`" +
      item.parentNode.childNodes[1].childNodes[2].textContent;
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
  if ($("#search-input").val().length != 0) {
    $("#searchInputSpinner").css("display", "inherit");
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
                    "</span><span class = 'pickListClassName'>" +
                    lEach.CName +
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
        if (list.length != 0) {
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
        } else {
          $("#selectTypeChatText p")[0].innerHTML =
            "No Suggested Goods or Services been found. Please re-enter the description of those Products or services that you are selling or trying to sell, so that we can recommend you the relevant Goods & Services";
        }
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
  var form = $(".individualForm .form-control");
  for (var i = 0; i < form.length; i++) {
    var each = form[i];
    each.removeAttribute("required");
  }
  var form = $(".companyForm .form-control");
  for (var i = 0; i < form.length; i++) {
    var each = form[i];
    each.setAttribute("required", "");
  }
  $(".currentIndividual")[0].style.display = "none";
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
  var form = $(".companyForm .form-control");
  for (var i = 0; i < form.length; i++) {
    var each = form[i];
    each.removeAttribute("required");
  }
  var form = $(".individualForm .form-control");
  for (var i = 0; i < form.length; i++) {
    var each = form[i];
    each.setAttribute("required", "");
  }
  $(".currentIndividual")[0].style.display = "inherit";
});
function addMoreOrgs() {
  const orgStr =
    $("#ownerFirstName").val() +
    "`" +
    $("#ownerLastName").val() +
    "`" +
    $("#ownerCitizen").val();
  let ownerCookie = getCookie("ownerForm");
  setCookie("ownerForm", ownerCookie + "~" + orgStr);
  var statusCookie = getCookie("currentStatus");
  setCookie(
    "currentStatus",
    "2`" +
      (parseInt(statusCookie.split("`")[1]) + 1) +
      "`" +
      (parseInt(statusCookie.split("`")[1]) + 1)
  );
  setOrgForm(parseInt(statusCookie.split("`")[1]) + 1);
}
function deleteOrg() {
  let ownerCookie = getCookie("ownerForm").split("~");
  const currentStatus = getCookie("currentStatus").split("`");
  ownerCookie.splice(parseInt(currentStatus[2]), 1);
  let statusStr = "2`" + (parseInt(currentStatus[1]) - 1);
  if (currentStatus[1] == currentStatus[2]) {
    statusStr += "`" + (parseInt(currentStatus[2]) - 1);
  } else {
    statusStr += "`" + currentStatus[2];
  }
  setCookie("currentStatus", statusStr);
  setCookie("ownerForm", ownerCookie.join("~"));
  setOrgForm(getCookie("currentStatus").split("`")[2]);
}

function deleteOwners() {
  let ownerCookie = getCookie("ownerForm").split("~");
  const currentStatus = getCookie("currentStatus").split("`");
  console.log(currentStatus);
  ownerCookie.splice(parseInt(currentStatus[2]) - 1, 1);
  console.log(ownerCookie);
  let statusStr = "1`" + (parseInt(currentStatus[1]) - 1);
  if (parseInt(currentStatus[1]) < parseInt(currentStatus[2])) {
    statusStr += "`" + (parseInt(currentStatus[2]) - 1);
  } else {
    statusStr += "`" + currentStatus[2];
  }
  setCookie("currentStatus", statusStr);
  setCookie("ownerForm", ownerCookie.join("~"));
  setOwnerForm(getCookie("currentStatus").split("`")[2] - 1);
  //ownerCookie.splice(parseInt(currentStatus[2]), 1);
}

function addMoreOwners() {
  var indivStr =
    $("#indivFirstName").val() +
    "`" +
    $("#indivLastName").val() +
    "`" +
    $("#indivCitizenSelect").val() +
    "`" +
    $("#indivAddress").val() +
    "`" +
    $("#indivCity").val() +
    "`" +
    $("#indivState").val() +
    "`" +
    $("#indivCountrySelect").val() +
    "`" +
    $("#indivZip").val();
  var ownerInputs = $(".individualForm input:not(#country_selector)");
  for (var i = 0; i < ownerInputs.length; i++) {
    var each = ownerInputs[i];
    each.value = "";
  }

  var statusCookie = getCookie("currentStatus");
  if (statusCookie.split("`")[0] == "2") {
    setCookie("ownerForm", "");
    setCookie("currentStatus", "");
    statusCookie = getCookie("currentStatus");
  }
  var ownerCookie = getCookie("ownerForm");
  setCookie("ownerForm", ownerCookie + "~" + indivStr);

  if (statusCookie == "") {
    setCookie("currentStatus", "1`1`1");
  } else {
    setCookie(
      "currentStatus",
      "1`" +
        (parseInt(statusCookie.split("`")[1]) + 1) +
        "`" +
        (parseInt(statusCookie.split("`")[1]) + 2)
    );
  }

  setOwnerForm(parseInt(getCookie("currentStatus").split("`")[1]));
}

function onFinish() {
  alert("End");
}
