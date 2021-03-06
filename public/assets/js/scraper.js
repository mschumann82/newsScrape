// Make sure we wait to attach our handlers until the DOM is fully loaded.

$(function () {

  function handlearticles() {
    $.getJSON("/scrape", function (data) {
      // For each one
      $("#notes").empty();
      $("#articles").empty();

      for (let i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<a id = 'linkinput' href='https://www.yahoo.com/" + data[i].link + "'><p id='titleinput' data-id='" + data[i].title + "'>" + data[i].title + "<br /></p></a>" + "<p id='bodyinput'>" + data[i].post + "</p>")
        // $("#articles").append("<p>Add Comments</p>");
        // An input to enter a new title
        // $("#articles").append("<input id='titleinput' name='title' >");
        // // A textarea to add a new note body
        // $("#articles").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#articles").append("<button data-title='" + data[i].title + "'  data-link='" + data[i].link + "' data-post='" + data[i].post + "' id='savearticle'>Save Article</button><br>");
        // $("#articles").append("<a href='/comments<button data-id='" + data[i].note + "' id='viewnote'>View Comments</button><br>");

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
      .then(function (data) {
        // console.log(data);
        handlearticles(data);
      });


  });

  // When you click the savenote button
  $(document).on("click", "#savearticle", function () {
    console.log("saved articles clicked");
    // Grab the id associated with the article from the submit button
    // const thisId = $(this).attr("data-id");
    const title = $(this).attr("data-title") || "Title not saved.";
    const post = $(this).attr("data-post");
    const link = $(this).attr("data-link");
    console.log(title);
    console.log(post);
    console.log(link);

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles",
      data: {

        title: title,
        post: post,
        link: link
      }
    })
      // With that done
      .then(function (data) {

        console.log(JSON.stringify(data) + "saved articles");
        // handlearticles(data);
        // Log the response
        // console.log(data);
        // // Empty the notes section
        // $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  function savedArticles(data) {
    $.getJSON("/articles", function (data) {
      // For each one
      $("#notes").empty();
      $("#articles").empty();

      for (let i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<a id = 'linkinput' href='https://www.yahoo.com/" + data[i].link + "'><p id='titleinput' data-id='" + data[i].title + "'>" + data[i].title + "<br /></p></a>" + "<p id='bodyinput'>" + data[i].post + "</p>")

        $("#articles").append("<button data-id='" + data[i]._id + "' id='addnote'>Add Note</button><button data-id='" + data[i]._id + "' id='viewnote'>View Note</button><button data-id='" + data[i]._id + "' id='deletearticle'>Delete Article</button><br>");


      }
    });
  }

  $(document).on("click", "#viewArticles", function () {
    console.log("view articles clicked");
    savedArticles();

  });

  $(document).on("click", "#addnote", function () {
    console.log("add note clicked");
    const id = $(this).attr("data-id");
    addNote(id);

  });
  $(document).on("click", "#viewnote", function () {
    console.log("view note clicked");
    const id = $(this).attr("data-id");
    viewNote(id);

  });

  $(document).on("click", "#savenote", function () {
    console.log("save note clicked");
    const id = $(this).attr("data-id");
    saveNote(id);

  });

  $(document).on("click", "#updatenote", function () {
    console.log("update note clicked");
    const id = $(this).attr("data-id");
    updateNote(id);

  });

  $(document).on("click", "#deletearticle", function () {
    console.log("delete article clicked");
    const id = $(this).attr("data-id");
    deleteArticle(id);

  });

  $(document).on("click", "#notesave", function () {
    console.log("note save clicked");
    const id = $(this).attr("data-id");
    noteUpdated(id);

  });

  function addNote(id) {

    $("#notes").empty();
    $("#articles").empty();



    $("#notes").append("<input id='titleinput' name='title' >");
    // A textarea to add a new note body
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    // A button to submit a new note, with the id of the article saved to it
    $("#notes").append("<button data-id='" + id + "' id='savenote'>Save Note </button><br>");
    // $("#notes").append("<button id='viewnote'>View Comments</button><br>");


  }

  function saveNote(id) {


    console.log(id);
    const title = $("#titleinput").val().trim();
    const body = $("#bodyinput").val().trim();

    $.ajax({
      method: "POST",
      url: "/articles/" + id,
      data: {

        title: title,
        body: body,

      }
    })
      .then(function (data) {

        console.log("saved notes");

      });
    $("#notes").empty();
    $("#articles").empty();
    viewNote(id);
  }

  function viewNote(id) {
    console.log(id);
    $("#notes").empty();
    $("#articles").empty();

    $.getJSON("/articles/" + id, function (data) {
      const note = data.note;
      console.log(note);
      // $.getJSON("/notes/" + note, function (noteInfo) {


        $("#notes").append("<p id='notetitle' name='title' >" + note[0].title + "</p>");
        $("#notes").append("<p id='notebody' name='body' >" + note[0].body + "</p>");
        $("#notes").append("<button data-id='" + note[0]._id + "' id='updatenote'>Update Note</button><br>");
        
      // });
    });

  }

  function deleteArticle(id) {


    console.log(id);
    

    $.ajax({
      method: "DELETE",
      url: "/articles/" + id,
      // data: {

      //   _id: id,
        
      // }
      
    })
      .then(function (data) {

        console.log(JSON.stringify(data) + "deleted article");
        savedArticles(data);
      });
    
  }

  function updateNote(id) {
    console.log(id);
    $("#notes").empty();
    $("#articles").empty();



    $("#notes").append("<input id='titleinput' name='title' >");
    // A textarea to add a new note body
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    // A button to submit a new note, with the id of the article saved to it
    $("#notes").append("<button data-id='" + id + "' id='notesave'>Update Note </button><br>");
    
    
  }

  function noteUpdated (id) {
    const title = $("#titleinput").val().trim();
    const body = $("#bodyinput").val().trim();
    console.log(title + body);
    

    $.ajax({
      method: "POST",
      url: "/notes/" + id,
      data: {

        title: title,
        body: body,

      }
      
    })
      .then(function (data) {

        console.log("updated note");
        savedArticles();
      });
  }

  







});// end doc ready


