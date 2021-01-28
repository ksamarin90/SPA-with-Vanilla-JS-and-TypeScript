export default class Dashboard {
    public currencies: [string, number][] = []
    constructor(currencies: [string, number][]) {
        this.currencies = currencies;
    }

    private favorites: string[] = []

    addToFavorites = (currency: string) => {
        this.favorites.push(currency)
        localStorage.setItem('favorites', this.favorites.join(','));
        this.renderFavorites()
    }

    removeFromFavorites = (index: number) => {
        this.favorites.splice(index, 1)
        localStorage.setItem('favorites', this.favorites.join(','))
        this.renderFavorites()
    }

    handleClick = (e: MouseEvent) => {
        const el = e.target as HTMLButtonElement
        const newFav = el.dataset.cur as string
        const indexOfFav = this.favorites.indexOf(newFav)
        if (indexOfFav === -1) {
            el.innerHTML = 'Remove from favorites'
            el.dataset.select = 'yes'
            this.addToFavorites(newFav)
        } else {
            el.innerHTML = 'Add to favorites'
            el.dataset.select = 'no'
            this.removeFromFavorites(indexOfFav)
        }
    }

    assignListeners = () => {
        document.querySelectorAll('button').forEach(button => button.addEventListener('click', this.handleClick))
        this.renderFavorites()
    }

    renderFavorites = () => {
        const el = document.querySelector('#favorites') as HTMLElement
        return el.innerHTML = `Your favorite currencies: ${this.favorites.map(fav => fav).join(', ')}`
    }

    async getHtml() {
        const favsFromLS = localStorage.getItem('favorites')
        if (favsFromLS) {
            this.favorites = [... favsFromLS.split(',')]
        }
        return `
            <div class="dashboard">
                <p id="favorites">Your favorite currencies: </p>
                <h1>Today One Dollar is Worth...</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Exchange Rate</th>
                            <th>Favorite</th>
                        </tr>
                    </thead>
                    <tbody>
                ${this.currencies.map(cur => 
                    `<tr>
                        <td>${cur[0]}</td>
                        <td>${cur[1].toFixed(2)}</td>
                        <td><button data-select="${this.favorites.some(fav => fav === cur[0]) ? 'yes' : 'no'}" data-cur="${cur[0]}">${this.favorites.some(fav => fav === cur[0]) ? 'Remove from favorites' : 'Add to favorites'}</button></td>
                    </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}