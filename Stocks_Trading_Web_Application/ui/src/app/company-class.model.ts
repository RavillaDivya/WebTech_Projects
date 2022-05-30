export class CompanyClass {
    ticker: string;
    name: string;
    quantity: number = 0;
    total: number = 0;
    c: number = 0;
    d: number = 0;
    dp: number = 0;

    constructor (ticker: string, name: string, quantity: number, total: number, c: number, d: number, dp: number) {
        this.ticker = ticker;
        this.name = name;
        this.quantity = quantity;
        this.total = total;
        this.c = c;
        this.d = d;
        this.dp = dp;
    }
}
