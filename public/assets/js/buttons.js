// Button Funtionality

$(document).ready(function() {
  var articleContainer = $('.article-container');

  // Button Handlers
  $('.scrape-new').on('click', handleArticleScrape);
  $('.save-it').on('click', handleUpdateArticle);
  $('.delete-it').on('click', handleUpdateArticle);
  // $('.new-note').on('click', handleNewNote);
  // $('.delete-note').on('click', handleDeleteNote);


   // New Scrape
  function handleArticleScrape() {
    $.ajax('/api/scrape', {
      type: 'GET',
    }).then(function(result) {
      // Reload the page to get the updated list
      location.reload();
    });
  }

  // Save and Delete a saved article
  function handleUpdateArticle() {
    var id = $(this).data('id');
    var savedId = {saved: $(this).data('save')};
        // Send the POST request.
        $.ajax('/api/articles/' + id, {
          type: 'POST',
          data: savedId
        }).then(function() {
          console.log('changed to saved');
          // Reload the page to get the updated list
          location.reload();
        });
  };


  //  Add a note
  // function handleNewNote() {
    $(document).on("click", "#savenote", function() {
      // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("data-id");
    
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
        .done(function(data) {
          // Log the response
          console.log(data);
          // Empty the notes section
          $("#notes").empty();
        });
      });

  //   Delete a note
  //    function handleDeleteNote() {
  //     var id = $(this).data('id');
  //     // Send the PUT request.
  //     $.ajax('/api/expense/delete/' + id, {
  //       type: 'PUT'
  //     }).then(function() {
  //       console.log('deleted note');
  //       // Reload the page to get the updated list
  //       location.reload();
  //     });
  //   };
});
