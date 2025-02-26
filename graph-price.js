const urlParams = new URLSearchParams(window.location.search);
const coin = urlParams.get('coin');
let previousPrice = 0;
let currentPrice = 0

const titleCoin = document.getElementById('coin-title')
const titlePage = document.getElementById('title-page')
titleCoin.textContent = 'Evolución de ' + coin
titlePage.textContent = 'Grafico | ' + coin

async function fetchData() {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${coin}&interval=1d&limit=30`);
    const data = await response.json();
    return data.map(candle => ({
        time: new Date(candle[0]).toLocaleDateString(),
        price: parseFloat(candle[4]) // Precio de cierre
    }));
}

async function renderChart() {
    const prices = await fetchData();
    const ctx = document.getElementById('priceChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: prices.map(p => p.time),
            datasets: [{
                label: 'Precio de cierre (USDT)',
                data: prices.map(p => p.price),
                borderColor: 'black',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Fecha' } },
                y: { title: { display: true, text: 'Precio (USDT)' } }
            }
        }
    });
}

renderChart();

updateCoinInfo(coin);

// Función para actualizar la información de la moneda
async function updateCoinInfo(coin) {
    try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${coin}`);
        const data = await response.json();
        // Actualizar el DOM
        currentPrice = parseFloat(data.lastPrice).toFixed(8)
        document.getElementById('coin-symbol').textContent = data.symbol || '-';
        document.getElementById('coin-title').textContent = `Evolución de ${coin}`;
        document.getElementById('last-price').textContent = `$${parseFloat(data.lastPrice).toFixed(8)}`;
        document.getElementById('high-price').textContent = `$${parseFloat(data.highPrice).toFixed(6)}`;
        document.getElementById('low-price').textContent = `$${parseFloat(data.lowPrice).toFixed(6)}`;
        document.getElementById('price-change').textContent = `$${parseFloat(data.priceChange).toFixed(6)}`;
        document.getElementById('price-change-percent').textContent = `${parseFloat(data.priceChangePercent).toFixed(2)}%`;
        document.getElementById('volume').textContent = parseFloat(data.volume).toLocaleString();
        document.getElementById('weighted-avg-price').textContent = `$${parseFloat(data.weightedAvgPrice).toFixed(2)}`;
        document.getElementById('bid-price').textContent = `$${parseFloat(data.bidPrice).toFixed(6)}`;
        document.getElementById('bid-qty').textContent = parseFloat(data.bidQty).toLocaleString();
        document.getElementById('ask-price').textContent = `$${parseFloat(data.askPrice).toFixed(6)}`;
        document.getElementById('ask-qty').textContent = parseFloat(data.askQty).toLocaleString();
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

function changeColor(newPrice) {
    const lastPriceElement = document.getElementById('last-price');

    // Comparar el precio anterior con el nuevo para decidir el color
    if (newPrice > previousPrice) {
        lastPriceElement.style.color = 'green'; // Subió el precio
    } else if (newPrice < previousPrice) {
        lastPriceElement.style.color = 'red'; // Bajó el precio
    } else {
        lastPriceElement.style.color = 'black'; // Sin cambios
    }
}

setInterval(() => {
    changeColor(currentPrice);
}, 1000);


// Llamar a la función cada 5 segundos
setInterval(() => {
    const oldPrice = document.getElementById('last-price')
    previousPrice = parseFloat(oldPrice.textContent.replace('$', '')) || 0;
    console.log(previousPrice + ',' + currentPrice)
    updateCoinInfo(coin);
}, 5000);