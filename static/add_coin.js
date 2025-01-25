function callback(result) {
    console.log(result.response);
}

function upload_callback(result) {
    console.log(result.response);
    $('#uploaded').html("<img src=" + result.response + ">");
    let scores = "AI inferred scores: | "
    for (key in result.scores) {
        value = result.scores[key];
        scores += key + ' = ' + value + " | "
    }
    $('#scores').html(scores);
}

function upload_image() {
    var formData = new FormData();
    files= $('#myfile').prop('files');
    file = files[0];
    formData.append('myfile', file, file.name);
    $.ajax({
        type: 'POST',
        url: "/upload_image",
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,  // tell jQuery not to process the data
        contentType: false,   // tell jQuery not to set contentType
        success: upload_callback});
}


function submit() {
    features = {
        denomination: $('#denomination').val(),
        region: $('#region').val(),
        year: $('#year').val(),
        currency: $('#currency').val(),
        metal: $('#metal').val(),
        diameter: $('#diameter').val()
    };

    var command = "/add";

    if (window.location.hash) {
        // Here we are in edit mode.
        command = "/edit";
        features.id = coin_id;
        if ($('#myfile').prop('files').length == 0) {
            features.image = edit_image;
        } else {
             features.image = $('#myfile').prop('files')[0].name;
        }
    } else {
        // Here we are in add mode.
        features.image = $('#myfile').prop('files')[0].name;
    }

    response = $.ajax({
        type: 'POST',
        url: command,
        data: JSON.stringify(features),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false}).responseText;

    if (JSON.parse(response).response == "OK") {
        document.location.href = "/static/catalogue.html";
    } else {
        alert(command + " not successful");
    }
}

function cancel() {
    document.location.href = "/static/catalogue.html";
}
