function makeTable(container, data) {
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


var current_coins = [];


function callback(result_in) {
    current_coins = result_in;
    makeTable($("#coin_list"), result_in);
}


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

function collection() {
    document.location.href = "/static/display_collection.html";
}

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
