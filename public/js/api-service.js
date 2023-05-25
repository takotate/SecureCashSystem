function getZones() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'http://localhost:3000/api/secure-cash-center',
            success: function (result) {
                resolve(result);
            },

        })
    });

}

function moveCard(card, fromZone, toZone) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/api/move-card",
            data: JSON.stringify({card, fromZone, toZone}),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (result) {
                resolve(result);
            }
        });
    });

}
