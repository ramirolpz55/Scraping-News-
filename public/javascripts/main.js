// GRABS THE ARTICLES AS A JSON
//==============================
$.getJSON('/articles', function(data) {
    // FOR EACH ARTICLE 
    for (var i = 0; i < data.length; i++) {
        // DISPLAYS INFROMATION ON THE PAGE
        $('.articles').append('<div class="well"><div class="media">' +
            '<div class="media-left media-middle">' +
            '<i class="fa fa-sticky-note fa-3x" aria-hidden="true" data-id="' + data[i]._id + '"></i>' + '</div>' + '<div class="media-body">' + '<h4 class="media-heading">' + data[i].title + '</h4><a href="' + data[i].link + '" target="_blank">' + data[i].link + '</a></div>' + '</div>' + '</div>');
    }
});

// WHENEVER SOMEONE CLICKS A P TAG
//==============================
$(document).on('click', 'i', function() {
    // EMPTYS THE NOTES FROM THE NOTE SECTION
    $('.notes').empty();
    // SAVE THE ID FROM THE P TAGE THAT WAS CLICKED
    var thisId = $(this).attr('data-id');

    // AJAX CALL FOR THE ARTICLE THAT WAS CLICKED 
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    // ADDS INFORMATION TO THE PAGE 
        .done(function(data) {
        console.log(data);
        // TITLE OF THE ARTICLE 
        $('.notes').append('<h2>' + data.title + '</h2><form><div class="form-group"><input id="titleinput" class="form-control" name="title" placeholder="Note title"><textarea id="bodyinput" class="form-control" rows="5" name="body" placeholder="Enter your note here..."></textarea></div><button type="submit" class="btn btn-default" data-id="' + data._id + '" id="savenote">Save Note</button></form>');

        // IF THERE IS A NOTE IN THE ARTICLE 
        if (data.note) {
            // PLACE THE TITLE OF THE NOTE IN THE TITLE INPUT FIELD
            $('#titleinput').val(data.note.title);
            // PLACE THE BODY OF THE NOT EIN THE BODY FIELD 
            $('#bodyinput').val(data.note.body);
        }
    });
});

// WHEN YOU CLICK THE SAVE NOTE BUTTON 
//==============================
$(document).on('click', '#savenote', function() {
    // GRAB THE ID FOR THE ARTICLE FROM THE SUBMIT BUTTON 
    var thisId = $(this).attr('data-id');

    // THIS RUNS A POST REQUEST TO CHANGE THE NOTE 
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            //TITLE INPUT 
            title: $('#titleinput').val(), 
            //BODY NOTE INPUT 
            body: $('#bodyinput').val() 
        }
    })
    // ONCE COMPLETED 
        .done(function(data) {
        // CONSOLE LOG THE RESPONSE TO VERIFY 
        console.log(data);
        // THIS IWLL EMPTY THE NOTES SECTION 
        $('.notes').empty();
    });

    // REMOVE USERS INPUT FROM THE TITLE INPUT FIELD
    $('#titleinput').val("");
    //REMOVE USERS INPUT FOR THE BODY FIELD OF THE CHANGE NOTE SECTION 
    $('#bodyinput').val("");
});