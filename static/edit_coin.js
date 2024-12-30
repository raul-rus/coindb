function callback(result) {
        console.log(result.response);
        window.location.href = "http://127.0.0.1:8000/catalogue";
    }
    function submit() {

    const features = [

        $('#denomination').val(),
        $('#region').val(),
        $('#year').val(),
        $('#currency').val(),
        $('#metal').val(),
        $('#diameter').val()
    ];
    console.log('stringified: ' + JSON.stringify(features));
    $.ajax({
        type: 'POST',
        url: "/edit",
        data: JSON.stringify(features),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: callback});
    }