var edit_image;
var coin_id;

function edit_initialisation_callback(result) {
    coin_id = window.location.hash.substring(1, window.location.hash.length);
    for (i = 0; i < result.length; i++) {
        item = result[i];
        if (item[0] == coin_id) {
            edit_image = item[1];
            $('#uploaded').html("<img src='uploads/" + item[1] + "'>");
            $('#denomination').val(item[2])
            $('#region').val(item[3])
            $('#year').val(item[4])
            $('#currency').val(item[5])
            $('#metal').val(item[6])
            $('#diameter').val(item[7])
        }
    }
}

function edit_callback(result) {

}