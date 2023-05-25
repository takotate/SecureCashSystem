let zones = [];
const cards = [];
const cardTypes = ['Manager', 'Secure', 'Operations', 'Transactions', 'Janitor']

getZones().then(resp => {
    zones = [resp.transactionZone, resp.secureZone, resp.outsideZone, resp.operationsZone];
    drawZones();
})

function drawCardInZone(zone) {
    const zoneId = `#${zone.name?.toLowerCase()}-zone`
    $(zoneId).on('drop', ev => {
        drop(ev);
    })
    if (zone.capacity) {
        $(zoneId).find('h2').append(`    ${zone.capacity}`);
    }
    zone.employees.forEach(card => {
        cards.push(card);
        $(zoneId).append(`
            <i id="${card.cardNumber}" class="card draggable" draggable = "true" style="color: #ffce56;" >
                ${card.cardNumber} &nbsp; ${cardTypes[card.cardType]}
             </i>`);

        $(`#${card.cardNumber}`).on('dragstart', ev => {
            drag(ev, card.cardNumber, zone.name);
        })
    })
}

function drawZones() {
    zones.forEach(drawCardInZone)
}

function drop(ev) {
    ev.preventDefault();
    const curElementId = ev.currentTarget.id;
    const zoneName = curElementId.replace('-zone', '');
    const toZone = zones.find(zone => zone.name.toLowerCase() === zoneName.toLowerCase())
    if (!toZone) {
        alert(`Something went wrong unable to find zone for: ${zoneName}`);
        return
    }

    const cardNumber = ev.originalEvent.dataTransfer.getData("cardNumber");
    const fromZoneName = ev.originalEvent.dataTransfer.getData("fromZoneName");
    const card = cards.find(crd => crd.cardNumber === Number.parseInt(cardNumber));
    const fromZone = zones.find(zone => zone.name.toLowerCase() === fromZoneName.toLowerCase())
    if (fromZone?.name.toLowerCase() === toZone?.name.toLowerCase()) {
        return;
    }
    moveCard(card, fromZone, toZone).then(res => {
        if (res.success) {
            const cardElem = $(`#${card.cardNumber}`)
            cardElem.detach().appendTo(`#${curElementId}`);
            cardElem.on('dragstart', ev => {
                drag(ev, card.cardNumber, toZone.name);
            })
        } else {
            alert(`${res.error}, reason: ${res.reason} `)
        }
    });

    console.log(`Dropped card: ${cardNumber}`)
    // ev.target.appendChild(document.getElementById(data));
}

function drag(event, cardNumber, fromZoneName) {
    console.log(`moving cardNumber: ${cardNumber}`)
    event.originalEvent.dataTransfer.setData("cardNumber", cardNumber);
    event.originalEvent.dataTransfer.setData("fromZoneName", fromZoneName);
}

function allowDrop(ev) {
    ev.preventDefault();
}
