import {Card} from './Card';
import {CardType} from './CardType';
import {Zone} from './Zone';

export class Door {
    private allowedCardTypes: CardType[] = [];

    constructor(public fromZone: Zone, public toZone: Zone, ...allowedCardTypes: CardType[]) {
        this.allowedCardTypes = allowedCardTypes;
    }

    public enter(card: Card) {
        if (!this.allowedCardTypes.includes(card.cardType)) {
            throw new Error(`Card ${card.cardNumber} is not allowed to enter Zone ${this.toZone.name} from Zone ${this.fromZone.name}.`);
        }

        if (!this.fromZone.isEmployeeInZone(card)) {
            throw new Error(`Card ${card.cardNumber} is not in Zone ${this.fromZone.name}.`);
        }

        if (card.cardType !== CardType.Manager && this.toZone.getEmployeeCount() >= this.toZone.capacity) {
            throw new Error(`Zone ${this.toZone.name} is at maximum capacity.`);
        }

        // Add a check to prevent Janitors from entering a Zone if there are no other employees present
        if (card.cardType === CardType.Janitor && this.toZone.getEmployeeCount() === 0) {
            throw new Error(`Janitors cannot enter Zone ${this.toZone.name} if there are no other employees present.`);
        }
        this.fromZone.removeEmployee(card);
        this.toZone.addEmployee(card);
    }
}
