import { Card } from '../Card'
import { CardType } from '../CardType'
import { SecureCashCenter } from '../SecureCashCenter'
import { Zone } from '../Zone'

export class CenterTester {
  private readonly center: SecureCashCenter

  constructor () {
    this.center = new SecureCashCenter()
  }

  public runTests (): void {
    try {
      this.addCards()
      this.testMovingCards()
      this.testSecureZoneCapacity()
    } catch (error) {
      const typedError = error as Error
      console.error(`Error occurred: ${typedError?.message}`)
    }
  }

  private addCards (): void {
    console.log('Adding employee cards to the system...')

    const cards = [
      new Card(22, 'Ivan', CardType.Manager),
      new Card(123, 'Seth', CardType.Secure),
      new Card(107, 'Debra', CardType.Secure),
      new Card(186, 'Gilbert', CardType.Secure),
      new Card(230, 'Vera', CardType.Operations),
      new Card(412, 'Lucy', CardType.Operations),
      new Card(254, 'Janet', CardType.Operations),
      new Card(665, 'Ramon', CardType.Transactions),
      new Card(725, 'Tracey', CardType.Transactions),
      new Card(1032, 'Lewis', CardType.Janitor)
    ]

    cards.forEach((card) => {
      try {
        this.center.addCard(card)
        console.log(`Card ${card.cardNumber} (${card.name}) with type ${card.cardType} added to the system.`)
      } catch (error) {
        const typedError = error as Error
        console.error(`Error adding card ${card.cardNumber} (${card.name}): ${typedError.message}`)
      }
    })
  }

  private testMovingCards (): void {
    console.log('Testing moving employee cards between zones...')

    const ivanCard = this.center.getCardByNumber(22)
    const sethCard = this.center.getCardByNumber(123)
    const ramonCard = this.center.getCardByNumber(665)

    this.moveCard(ivanCard, this.center.outsideZone, this.center.transactionZone)
    this.moveCard(ivanCard, this.center.transactionZone, this.center.operationsZone)
    this.moveCard(ivanCard, this.center.transactionZone, this.center.operationsZone)

    this.moveCard(sethCard, this.center.outsideZone, this.center.transactionZone)
    this.moveCard(sethCard, this.center.transactionZone, this.center.operationsZone)

    this.moveCard(ramonCard, this.center.outsideZone, this.center.operationsZone)
  }

  private moveCard (card: Card | undefined, fromZone: Zone, toZone: Zone): void {
    try {
      this.center.moveCard(card, fromZone, toZone)
      console.log(`${card?.cardNumber} successfully entered to ${toZone.name} from ${fromZone.name}`)
    } catch (ex) {
      const typedError = ex as Error
      console.log(typedError.message)
    }
  }

  private testSecureZoneCapacity () {
    console.log('Testing secure zone capacity...')

    const card1 = this.center.getCardByNumber(123)
    const card2 = this.center.getCardByNumber(107)
    const card3 = this.center.getCardByNumber(186)

    this.center.moveCard(card1, this.center.outsideZone, this.center.secureZone)
    this.center.moveCard(card2, this.center.outsideZone, this.center.secureZone)
    this.center.moveCard(card3, this.center.outsideZone, this.center.secureZone)

    try {
      const card4 = this.center.getCardByNumber(230)
      this.center.moveCard(card4, this.center.outsideZone, this.center.secureZone)
    } catch (error) {
      const typedError = error as Error
      console.error(`Error: ${typedError.message}`)
    }
  }
}
