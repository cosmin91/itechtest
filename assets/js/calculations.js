// calculations page
function calculationsGet() {
    var getData = $.get("/api/getdata", function (data) {
        data = JSON.parse(data);
        var html = '';
        data.data.sort(function(a, b) {
            a = a[4];
            b = b[4];
            return a>b ? -1 : a<b ? 1 : 0;
        });
        data.data.forEach(el => {
            html += `<tr>
                <th>${el[0]}</th>
                <td>${el[1]}</td>
                <td>${el[2]}</td>
                <td>${el[3]}</td>
            </tr>`;
        });
        $('.calculations tbody').html(html);
    }).fail(function () {
        alert("No data");
    });
}

calculationsGet();