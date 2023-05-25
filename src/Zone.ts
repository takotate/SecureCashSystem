import {Card} from './Card';
import {CardType} from './CardType';

export class Zone {
    private employees: Card[] = [];

    constructor(public name: string, public capacity: number) {
    }

    public addEmployee(card: Card) {
        if (card.cardType !== CardType.Manager && this.employees.length >= this.capacity) {
            throw new Error(`Zone ${this.name} is at maximum capacity.`);
        }

        this.employees.push(card);
    }

    public isZoneFull() {
        return this.employees.length >= this.capacity;
    }

    public removeEmployee(card: Card) {
        const index = this.employees.findIndex((c) => c.cardNumber === card.cardNumber);

        if (index === -1) {
            throw new Error(`Card ${card.cardNumber} is not in Zone ${this.name}.`);
        }

        this.employees.splice(index, 1);
    }

    public getEmployeeCount(): number {
        return this.employees.length;
    }

    public getEmployeeNames(): string[] {
        return this.employees.map((c) => c.name);
    }

    public isEmployeeInZone(card: Card): boolean {
        return this.employees.some((c) => c.cardNumber === card.cardNumber);
    }
}
  