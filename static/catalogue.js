function makeTable(container, data) {
    var table = $("<table/>");
    $.each(data, function(rowIndex, r) {
        var row = $("<tr/>");
        $.each(r, function(colIndex, c) {
            row.append($("<td/>").text(c));
        });
        table.append(row);
    });
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
    for (let i = 0; i < current_coins.length; i++) {
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