// Button Funtionality

$(document).ready(function() {
  var articleContainer = $('.article-container');

  // Button Handlers
  $('.scrape-new').on('click', handleArticleScrape);
  $('.save-it').on('click', handleUpdateArticle);
  $('.delete-it').on('click', handleUpdateArticle);
  $('.new-note').on('click', handleAddNote);
  $('.save-note').on('click', handleSaveNote);
  // $('.delete-note').on('click', handleDeleteNote);

  // New Scrape
  function handleArticleScrape() {
    $.ajax('/api/scrape', {
      type: 'GET'
    }).then(function(result) {
      // Reload the page to get the updated list
      location.reload();
    });
  }

  // Save and Delete a saved article
  function handleUpdateArticle() {
    var id = $(this).data('id');
    var savedId = { saved: $(this).data('save') };
    // Send the POST request.
    $.ajax('/api/articles/' + id, {
      type: 'POST',
      data: savedId
    }).then(function() {
      console.log('changed to saved');
      // Reload the page to get the updated list
      location.reload();
    });
  }

  //  Open Add Note Modal
  function handleAddNote() {
    $('.note-container').html('');
    var artId = $(this).data('id');

    // Get notes from server
    $.ajax('/api/notes/' + artId, {
      method: 'GET'
    }).then(function(result) {
      console.log(result);

      if (result.length === 0) {
        var noOutPut =
          "<li>No notes for this article yet.</li>";
          $('.note-container').append(noOutPut);
      } else {
        for (var i = 0; i < result.length; i++) {
          var outPut =
            "<li>" + result[i].noteText + '</li>';
            $('.note-container').append(outPut);
        }
      }

      // Opens Note Modal and populates with existing notes
      $('#articleId').text(artId);
      $('.save-note').attr('data-id', artId);
      $('#noteModal').modal('show');
    });
  }

  // Save Note
  function handleSaveNote() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).data('id');

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: 'POST',
      url: '/api/articles/note/' + thisId,
      data: {
        // Value taken from note textarea
        note: $('#newNote').val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $('#newNote').val('');
        $('#noteModal').modal('hide');
      });
  }

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
