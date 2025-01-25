// Save the collection "folders" as lists of ids that retrieve the coins from the db
// Can overlap, display separately, have case for deleted ids, fix generating ids and remove coin

function display_callback(result_in) {
    displayTable($("#coin_list"), result_in);
}


function go_to_catalogue() {
    document.location.href = "/static/catalogue.html";
}

function displayTable(container, data) {
    var table = "<table>";

    for (i = 0; i < data.length; i++) {
        const row = data[i];
        table += "<tr>";
        for (j = 0; j < row.length; j++) {
            table += "<td>";
            if (j == 1 && i > 0) {
                table += "<img src=" + "uploads/" + row[j] + ">";
            } else {
                table += row[j];
            }
            table += "</td>";
        }
        table += "<td>";
        if (i > 0) {
            // This button triggers edit coin and calls edit to send the coin id to the URL hash
            table += "<button type='button' id='edit_coin' onclick=edit(" + data[i][0] + ")"
                + ">Edit Coin</button>"
            // This button adds the coin to the collection and sends the id to the hash for display
            table += "<button type='button' id='add" + data[i][0] + "' onclick=add_to_collection(" + data[i][0] + ")"
                + ">Add to Collection</button>"
            table += "<button type='button' id='delete_coin' onclick=remove_coin(" + data[i][0] + ")"
                + ">Remove Coin</button>"
        }
        table += "</td>";
        table += "</tr>";
    }
    table += "</table>";

    return container.html(table);
}

function remove_coin() {

}