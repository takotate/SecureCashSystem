import {Card} from './Card'
import {CardType} from './CardType'
import {Door} from './Door'
import {Zone} from './Zone'

export class SecureCashCenter {
    public secureZone: Zone
    public operationsZone: Zone
    public transactionZone: Zone
    public outsideZone: Zone

    private cards: Card[] = []
    private doors: Door[] = []

    constructor() {
        this.transactionZone = new Zone('Transaction', 7)
        this.operationsZone = new Zone('Operations', 5)
        this.secureZone = new Zone('Secure', 2)
        this.outsideZone = new Zone('Outside', Infinity)

        this.doors[0] = new Door(this.outsideZone, this.transactionZone,
            CardType.Manager, CardType.Transactions,
            CardType.Operations, CardType.Secure,
            CardType.Janitor
        )
        this.doors[1] = new Door(this.transactionZone, this.outsideZone,
            CardType.Manager, CardType.Transactions,
            CardType.Operations, CardType.Secure,
            CardType.Janitor
        )
        this.doors[2] = new Door(this.transactionZone, this.operationsZone,
            CardType.Manager, CardType.Secure, CardType.Janitor, CardType.Operations
        )
        this.doors[3] = new Door(this.operationsZone, this.transactionZone,
            CardType.Manager, CardType.Secure, CardType.Janitor, CardType.Operations
        )
        this.doors[4] = new Door(this.operationsZone, this.secureZone,
            CardType.Manager, CardType.Secure, CardType.Janitor
        )
        this.doors[5] = new Door(this.secureZone, this.operationsZone,
            CardType.Manager, CardType.Secure, CardType.Janitor
        )

    }

    public addCard(card: Card) {
        const existingCard = this.cards.find((c) => c.cardNumber === card.cardNumber)

        if (existingCard) {
            throw new Error(`Card ${card.cardNumber} already exists in the system.`)
        }

        this.cards.push(card)
        if (card.cardType === CardType.Manager) {
            this.secureZone.addEmployee(card);
        } else if (card.cardType === CardType.Secure && !this.secureZone.isZoneFull()) {
            this.secureZone.addEmployee(card);
        } else if (card.cardType === CardType.Operations && !this.operationsZone.isZoneFull()) {
            this.operationsZone.addEmployee(card);
        } else if (card.cardType === CardType.Transactions && !this.transactionZone.isZoneFull()) {
            this.transactionZone.addEmployee(card);
        } else {
            this.outsideZone.addEmployee(card);
        }
    }

    public moveCard(card: Card | undefined, fromZone: Zone, toZone: Zone) {
        if (!card) {
            throw new Error(`Card is not present.`)
        }
        const door = this.doors.find(dr => dr.fromZone.name === fromZone.name && dr.toZone.name === toZone.name)
        if (!door) {
            throw new Error(`Unable to get to ${toZone.name} from ${fromZone.name}.`)
        }
        door.enter(card)
    }

    public getCardByNumber(num: number): Card | undefined {
        return this.cards.find(e => e.cardNumber === num)
    }
}
