// Generates a table of all the coin attributes and buttons.
function make_table(container, data) {
    var table = "<table>";
    table += "<col span='1' style='width: 5px;'>"; // ID
    table += "<col span='1' style='width: 75px;'>"; // Image
    table += "<col span='1' style='width: 20px;'>"; // Denomination
    table += "<col span='1' style='width: 50px;'>"; // Region
    table += "<col span='1' style='width: 50px;'>"; // Year
    table += "<col span='1' style='width: 50px;'>"; // Currency
    table += "<col span='1' style='width: 100px;'>"; // Metal
    table += "<col span='1' style='width: 20px;'>"; // Diameter
    table += "<col span='1' style='width: 100px;'>"; // Buttons
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
                + ">Edit Coin</button><br>"
            // This button adds the coin to the collection
            table += "<button type='button' id='add_to_collection' onclick=add_to_collection(" + data[i][0] + ")"
                + ">Add to Collection</button><br>"
            // This button calls delete coin and passes the id to the AJAX call.
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

// Current coins is the list of coins to display in the catalogue table.
var current_coins = [];
// Current collections is the list of collections with their ids.
var current_collections = [];

$.ajax({url: "/get_coins", success: get_coins_callback});
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
function display_selected_collection() {
    index = $("#collection_list").val();
    selected_collection = current_collections[index];
    var result = "";
    // This loops through the selected coins and finds the image for each.
    for (let i = 0; i < selected_collection.coins.length; i++) {
        selected_image = null;
        for (let j = 0; j < current_coins.length; j++) {
            if (String(current_coins[j][0]) == String(selected_collection.coins[i])) {
                selected_image = current_coins[j][1];
            }
        }
        result += "<img src='" + "uploads/" + selected_image + "' "; // Adds image
        result += "onclick='remove_from_collection(" + i + ")'" // Adds click event to remove with coin index
        result += "style='height:250px;width:auto;' onmouseover='display_coin_data(" + i + ")'>"; // Adds mouseover event to display data
    }
    $("#collection").html(result);
}

// Adds coin id to appropriate collection found by name.
function add_to_collection(coin_id) {
    collection_index = $("#collection_list").val();
    current_collections[collection_index].coins.push(coin_id);
    save_collection();
    display_selected_collection();
}

// Removes coin, given position in array.
function remove_from_collection(coin_index) {
    collection_index = $("#collection_list").val();
    current_collections[collection_index].coins.splice(coin_index, 1);
    save_collection();
    display_selected_collection();
}


// For coin hovered, retrieve and display data on div.
function display_coin_data(coin_index) {
    // Uses index of coin in collection to retrieve coin id from catalogue to get other information
    result = "";

    collection_index = $("#collection_list").val();
    coin_id = current_collections[collection_index].coins[coin_index];
    for (let i = 0; i < current_coins.length; i++) {
        if (String(coin_id) == String(current_coins[i][0])) {
            for (let j = 2; j < current_coins[i].length; j++) {
                // Adds coins to the information, starting from denomination and uses titles from current_coins[0]
                result += "<div>" + String(current_coins[0][j]) + ": " + String(current_coins[i][j]) + "</div><br>";
            }
        }
    }
    $("#coin_information").html(result);
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
    make_table($("#coin_list"), results);
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


function delete_collection() {

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
