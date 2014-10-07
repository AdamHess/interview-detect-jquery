$(function() {
    function isUrlValid(url) {
        if (!url) {
            $('#result').html("Need to provide URL for request");   
            return false;
        }
        else if ((url.indexOf('http://') !== 0 ) && (url.indexOf('https://') !== 0) )  {
            $('#result').html('Website URL must be prefixed by http:// or https://');
            return false;
        }
        else {
            return true;
        }

    };
    function markStatusFailed() {
            $('#status_container').addClass('failed');
            $('#status_container').removeClass('success');
    };
    function markStatusSuccess() {
        $('#status_container').removeClass('failed');
        $('#status_container').addClass('success');
    }
    function markStatusWaiting() {
        $('#status_container').removeClass('failed');
        $('#status_container').removeClass('success');
    };
    $('#submit_button').click(function() {
        var url = $('#website_url').val();
        if (isUrlValid(url)) {
            $('#result').empty();
            $('#status').empty();
            markStatusWaiting();
            $('#loading_wheel').show();
            $.ajax({
                type: "GET",
                url: "/check_for_jquery/",
                contentType: "application/json",
                dataType: "json",
                data: {
                    website_url: url
                },
                success: function(data) {
                    $('#loading_wheel').hide(); 
                    //just shove result in result of request div
                    $('#status').html(data.status);
                    if (data.error) {
                        $('#result').html(data.error);
                        markStatusFailed();
                    }
                    else if ((data.version !== undefined) && (data.version !== null)){
                        $('#result').html('jQuery Version: <strong>' + data.version+ '</strong>');
                        markStatusSuccess();
                    }
                    else {
                        $('#result').html('jQuery is <em>undefined</em> for this site');     
                        markStatusSuccess();
                    }                 
                },
                failure: function(errorMsg) {
                    $('#result').html(JSON.stringify(errorMsg));
                    $('#loading_wheel').hide(); 
                }

            });


        }
    });
});