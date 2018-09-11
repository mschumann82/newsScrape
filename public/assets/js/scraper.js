// Make sure we wait to attach our handlers until the DOM is fully loaded.

$(function () {

  function handlearticles (data) {
  $.getJSON("/articles", function(data) {
    // For each one
    $("#notes").empty();
    $("#articles").empty();
    
    for (let i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<a href='https://www.yahoo.com/news/><p data-id='" + data[i]._id + "'>" + data[i].title + "<br /></p></a>" + "<p>" + data[i].post + "</p>")
      $("#articles").append("<p>Add Comments</p>");
          // An input to enter a new title
          $("#articles").append("<input id='titleinput' name='title' >");
          // A textarea to add a new note body
          $("#articles").append("<textarea id='bodyinput' name='body'></textarea>");
          // A button to submit a new note, with the id of the article saved to it
          $("#articles").append("<button data-id='" + data[i]._id + "' id='savenote'>Save Note</button><br>");
          $("#articles").append("<a href='/comments<button data-id='" + data[i].note + "' id='viewnote'>View Comments</button><br>");
    
          // If there's a note in the article
          // if (data[i].note.length > 1) {
          //   $("#notes").append("<p>" + data[i].title + "</p>");
          //   $.getJSON("/notes", function(note) {
          //     for (let i = 0; i < note.length; i ++) {
          //     if (data[i].note === note[i]._id ){
          //   $("#notes").append("<p>" + note[i].title + "</p><br><p>" + note[i].body + "</p>")
          //     }
          //     }
          //   });
          
          // };
    }
  });
}
  
  $("#scrape").on("click", function () {
    console.log("clicked");
   
      // Empty the notes from the note section
      $("#notes").empty();
      $("#articles").empty();
      // Save the id from the p tag
      // const thisId = $(this).attr("data-id");
    
      // Now make an ajax call for the Article
      $.ajax({
        method: "GET",
        url: "/scrape" 
      })
        // With that done, add the note information to the page
        .then(function(data) {
          // console.log(data);
          handlearticles(data);
    });
    
   
  });

  // When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  const thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      handlearticles(data);
      // Log the response
      // console.log(data);
      // // Empty the notes section
      // $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});



});// end doc ready


