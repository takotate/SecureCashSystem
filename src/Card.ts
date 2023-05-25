import {CardType} from './CardType';

export class Card {
    constructor(public cardNumber: number, public name: string, public cardType: CardType) {
    }
}
