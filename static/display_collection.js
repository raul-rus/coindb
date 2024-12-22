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

function display_callback(result_in) {
    makeTable($("#coin_list"), result_in);
}

function add() {
    document.location.href = "http://127.0.0.1:5000/static/catalogue.html";
}