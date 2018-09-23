var index=0;
var data=[];
$(document).ready(function() {
  $("#version").html("v0.14");

  $("#searchbutton").click( function (e) {
    displayModal();
  });

  $("#searchfield").keydown( function (e) {
    if(e.keyCode == 13) {
      displayModal();
    }
  });

  function displayModal() {
    $(  "#myModal").modal('show');

    $("#status").html("Searching...");
    $("#dialogtitle").html("Search for: "+$("#searchfield").val());
    $("#previous").hide();
    $("#next").hide();
    $.getJSON('/search/' + $("#searchfield").val() , function(data) {
      renderQueryResults(data);
    });
  }

  $("#next").click( function(e) {
    if(index+1 > (data.length/4)){
      console.log(index);
    }
    else{
      index++;
      $("#p0").attr('src', data.results[index*4])
      $("#p1").attr('src', data.results[1 + index*4])
      $("#p2").attr('src', data.results[2 + index*4])
      $("#p3").attr('src', data.results[3 + index*4])
    }
  });

  $("#previous").click( function(e) {
    if(index-1 < 0){
      console.log(index);
    }
    else{
      index--;
      $("#p0").attr('src', data.results[index*4])
      $("#p1").attr('src', data.results[1 + index*4])
      $("#p2").attr('src', data.results[2 + index*4])
      $("#p3").attr('src', data.results[3 + index*4])
    }
  });

  function renderQueryResults(data) {

    if (data.error != undefined) {
      $("#status").html("Error: "+data.error);
      $("#p0").attr('src', '')
      $("#p1").attr('src', '')
      $("#p2").attr('src', '')
      $("#p3").attr('src', '')
    } else {
      this.data = data;
      $("#status").html(""+data.num_results+" result(s)");
      if(data.results.length == 0){
        $("#p0").attr('src', '')
        $("#p1").attr('src', '')
        $("#p2").attr('src', '')
        $("#p3").attr('src', '')
      }
      $("#p0").attr('src', data.results[0])
      $("#p1").attr('src', data.results[1])
      $("#p2").attr('src', data.results[2])
      $("#p3").attr('src', data.results[3])

      $("#next").show();
      $("#previous").show();

     }
   }
});
