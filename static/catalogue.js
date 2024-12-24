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
        table += "</tr>";
    }
    table += "</table>";


    return container.html(table);
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
        if (coin[2].match(query)) {
            results.push(coin);
        }
    }
    makeTable($("#coin_list"), results);
}

function add() {
    document.location.href = "/static/add_coin.html";
}