import express, {Request, Response} from 'express'
import path from 'path'
import {Card} from './Card'
import {CardType} from './CardType'
import {SecureCashCenter} from './SecureCashCenter'

// Create a new express app instance
const app: express.Application = express()
const port: number = Number(process.env.PORT) || 3000
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, '..', 'public')))
const center = new SecureCashCenter()
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
        center.addCard(card)
        console.log(`Card ${card.cardNumber} (${card.name}) with type ${card.cardType} added to the system.`)
    } catch (error) {
        const typedError = error as Error
        console.error(`Error adding card ${card.cardNumber} (${card.name}): ${typedError.message}`)
    }
})

// Define a route handler for the root path
app.get('/api/secure-cash-center', (req: Request, res: Response) => {
    const {outsideZone, secureZone, operationsZone, transactionZone} = center;
    res.send({outsideZone, secureZone, operationsZone, transactionZone})
})

app.post('/api/move-card', (req: Request, res: Response) => {
    try {
        center.moveCard(req.body.card, req.body.fromZone, req.body.toZone)
    } catch (err) {
        const typedError = err as Error
        res.send({
            success: false,
            error: 'unable to move card',
            reason: typedError?.message
        })
        return
    }
    res.send({
        success: true
    })
})

// Start the server
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
})
