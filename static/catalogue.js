// Generates a table of all the coin attributes and buttons.
function make_table(container, data) {
    var table = "<table>";

    // This creates every table row for every coin.
    for (i = 0; i < data.length; i++) {
        const row = data[i];
        table += "<tr>";
        // Adds the coin attributes to each row.
        for (j = 0; j < row.length; j++) {
            table += "<td>";
            // Adds images to elements under the header.
            if (j == 1 && i > 0) {
                table += "<img src=" + "uploads/" + row[j] + ">";
            } else {
                table += row[j];
            }
            table += "</td>";
        }
        // Adds buttons to each row beneath the header, gives each a distinct id.
        table += "<td>";
        if (i > 0) {
            // This button triggers edit coin and calls edit to send the coin id to the URL hash.
            table += "<button type='button' id='edit_coin' onclick=edit(" + data[i][0] + ")"
                + ">Edit Coin</button>"
            // This button adds the coin to the collection and sends the id to the hash for display.
            table += "<button type='button' id='delete_coin' onclick=delete_coin(" + data[i][0] + ")"
                + ">Delete Coin</button>"
        }
        table += "</td>";
        table += "</tr>";
    }
    table += "</table>";
    return container.html(table);
}

function edit(coin_id) {
    document.location.href = "/static/add_coin.html#" + coin_id;
}

function add_to_collection(coin_id) {
    document.location.href = "/static/display_collection.html#" + coin_id;
}

// Current coins is the list of coins to display in the catalogue table.
var current_coins = [];
// Current collections is the list of collections with their ids.
var current_collections = [];

$.ajax({url: "/get_collection", success: get_collection_callback})


function get_coins_callback(result_in) {
    current_coins = result_in;
    make_table($("#coin_list"), result_in);
}

function get_collection_callback(result_in) {
    current_collections = result_in;
    fill_dropdown($("#collection_list"));
}

// Populates the dropdown menu by sending a request for all collection names
function fill_dropdown(container) {
    var dropdown = "";
    for (let i = 0; i < current_collections.length; i++) {
        dropdown += "<option value='" + i + "'>"
        dropdown += current_collections[i].name + "</option>";
    }
    return container.html(dropdown);
}

// Adds collection name to title and images to div displaying collection.
function select_collection(index) {
    $("#collection").html(current_collections[index].coins.toString());
}


// This function is called to send a list of results in search.
function update_search() {
    query = $("#search").val();
    results = [];
    results.push(current_coins[0]);
    for (let i = 1; i < current_coins.length; i++) {
        let coin = current_coins[i];
        for (let j = 2; j < current_coins[0].length; j++) {
            if (coin[j].toLowerCase().match(query.toLowerCase())) {
                results.push(coin);
                break;
            }
        }
    }
    makeTable($("#coin_list"), results);
}

function add() {
    document.location.href = "/static/add_coin.html";
}


function add_new_collection() {
    name = $("#new_collection_name").val();
    current_collections.push({"name": name, "coins": []});
    fill_dropdown($("#collection_list"));
    save_collection();
}


function save_collection() {
    response = $.ajax({
        type: 'POST',
        url: "/save_collection",
        data: JSON.stringify(current_collections),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false}).responseText;

    if (JSON.parse(response).response != "OK") {
        alert(command + " not successful");
    }
}


// Sends a request to the backend to remove a coin.
function delete_coin(coin_id) {

    response = $.ajax({
        type: 'POST',
        url: "/remove",
        data: JSON.stringify(coin_id),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false}).responseText;

    if (JSON.parse(response).response == "OK") {
        document.location.href = "/static/catalogue.html";
    } else {
        alert(command + " not successful");
    }
}
