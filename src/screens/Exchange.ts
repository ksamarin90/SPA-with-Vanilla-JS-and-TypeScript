export default class Exchange {
    public currencies: [string, number][] = []
    public selectedCurs: [string, string]
    constructor (currencies: [string, number][]) {
        this.currencies = currencies
        this.selectedCurs = [currencies[0][0], currencies[1][0]]
    }
    
    private selects: NodeListOf<HTMLSelectElement> | [] = []
    private inputs: NodeListOf<HTMLInputElement> | [] = []

    getRates = async () => {
        const res = await fetch(`https://api.exchangeratesapi.io/latest?symbols=${this.selectedCurs[0]},${this.selectedCurs[1]}`)
        const data = await res.json()
        return data.rates
    }

    changeSelectedCurs = async (e: Event) => {
        const el = e.target as HTMLSelectElement
        const elIndex = Number(el.id.split('-')[1])
        if (elIndex === 1) {
            this.selectedCurs[0] = el.value
        } else {
            this.selectedCurs[1] = el.value
        }
        const rates = await this.getRates()
        const dif = this.calcRatesRatio(rates, elIndex)
        if (elIndex === 1) {
            this.inputs[0].value = (dif * Number(this.inputs[1].value)).toFixed(2).toString()
        } else {
            this.inputs[1].value = (Number(this.inputs[0].value) / dif).toFixed(2).toString()
        }
    }

    changeAmounts = async (e: Event) => {
        const el = e.target as HTMLInputElement
        const elIndex = Number(el.id.split('-')[1])
        const rates = await this.getRates()
        const dif = this.calcRatesRatio(rates, elIndex)
        if (elIndex === 1) {
            this.inputs[1].value = (Number(this.inputs[0].value) / dif).toFixed(2).toString()
        } else {
            this.inputs[0].value = (Number(this.inputs[1].value) * dif).toFixed(2).toString()
        }
    }

    calcRatesRatio = (rates: {[key: string]: number}, index: number) => {
        if (index === 0) {
            return rates[this.selectedCurs[1]] / rates[this.selectedCurs[0]]
        } else {
            return rates[this.selectedCurs[0]] / rates[this.selectedCurs[1]]
        }
    }

    assignListeners = async () => {
        this.selects = document.querySelectorAll('select') as NodeListOf<HTMLSelectElement>
        this.inputs = document.querySelectorAll('input') as NodeListOf<HTMLInputElement>
        this.selects.forEach(select => select.addEventListener('change', (e) => this.changeSelectedCurs(e)))
        this.inputs.forEach(input => input.addEventListener('input', (e) => this.changeAmounts(e)))
        const rates = await this.getRates()
        this.inputs[0].value = '1'
        this.inputs[1].value = (rates[this.selectedCurs[1]] / rates[this.selectedCurs[0]]).toFixed(2).toString()
    }

    async getHtml() {
        return `
            <table class="exchange">
                <thead></thead>
                <tbody>
                    <tr>
                        <td>
                            <select name="currency1" id="currency-1">
                                ${this.currencies.map(cur => 
                                    `<option value="${cur[0]}" ${cur[0] === this.selectedCurs[0] && 'selected'}>${cur[0]}</option>`
                                ).join('')}
                            </select>
                        </td>
                        <td></td>
                        <td>
                        <select name="currency2" id="currency-2">
                            ${this.currencies.map(cur => 
                                `<option value="${cur[0]}" ${cur[0] === this.selectedCurs[1] && 'selected'}>${cur[0]}</option>`
                            ).join('')}
                        </select>
                        </td>
                    </tr>
                    <tr>
                        <td><input type="number" id="curency-1" /></td>
                        <td class="equal">=</td>
                        <td><input type="number" id="curency-2" /></td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}