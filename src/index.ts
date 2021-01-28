import Dashboard from './screens/Dashboard'
import Exchange from './screens/Exchange'

let currencies: [string, number][] = []

const navigateTo = (url: string) => {
    history.pushState(null, '', url)
    router()
}

const getData = async () => {
    const res = await fetch('https://api.exchangeratesapi.io/latest?base=USD')
    const data = await res.json()
    return data
}

const routes = [
    { path: "/", screen: Dashboard },
    { path: "/exchange", screen: Exchange },
]

const router = async () => {
    const match = routes.find(route => route.path === location.pathname)
    const screen = match && new match.screen(currencies)
    const app = document.querySelector("#app") as HTMLDivElement

    if (screen) {
        app.innerHTML = await screen.getHtml()
        const dashboard = document.querySelector('#dashboard') as HTMLLinkElement
        const exchange = document.querySelector('#exchange') as HTMLLinkElement
        if (match && match.path === '/') {
            dashboard.style.opacity = '1'
            exchange.style.opacity = '0.4'
        } else {
            dashboard.style.opacity = '0.4'
            exchange.style.opacity = '1'
        }
        screen.assignListeners()
    }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", async () => {
    document.body.addEventListener("click", e => {
        const target = e.target as HTMLAnchorElement
        if ((target as HTMLAnchorElement).matches("[data-link]")) {
            e.preventDefault();
            navigateTo(target.href);
        }
    });

    const data = await getData()
    currencies = [...Object.entries(data.rates) as [string, number][]]

    router();
});