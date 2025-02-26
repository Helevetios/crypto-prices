let table;
const previousPrices = {};
var language = {}

async function getTop20Coins() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    const data = await response.json();

    const top20 = data
      .filter(coin => coin.symbol.endsWith('USDT'))
      .sort((a, b) => parseFloat(b.lastPrice) - parseFloat(a.lastPrice))
      .slice(0, 20);

    table.clear();
    top20.forEach(coin => {
      const lastPrice = parseFloat(coin.lastPrice).toFixed(2);
      const volume = parseFloat(coin.volume).toLocaleString();
      const changePercent = parseFloat(coin.priceChangePercent).toFixed(2);

      // Obtener el precio anterior
      const previousPrice = previousPrices[coin.symbol];

      // Determinar la clase de color
      let priceClass = '';
      if (previousPrice !== undefined) {
        if (lastPrice > previousPrice) {
          priceClass = 'price-up';
        } else if (lastPrice < previousPrice) {
          priceClass = 'price-down';
        }
      }

      // Añadir la fila con la clase correspondiente
      const row = table.row.add([
        coin.symbol,
        `<span class="price ${priceClass}" data-coin="${coin.symbol}">$${lastPrice}</span>`,
        volume,
        `${changePercent}%`
      ]).draw().node();

      // Actualizar el precio anterior para la próxima comparación
      previousPrices[coin.symbol] = lastPrice;
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


async function cargarJSON() {
  try {
    const response = await fetch('/es-ES.json'); // Ruta relativa o absoluta
    const data = await response.json(); // Convertir a objeto JavaScript
    return data; // Asignar a una variable si lo deseas
  } catch (error) {
    console.error('Error al cargar el JSON:', error);
  }
}

cargarJSON().then(data => {
  language = data;

  $(document).ready(function () {
    table = $('#cryptoTable').DataTable({
      paging: true,
      searching: true,
      info: false,
      order: [],
      language: language
    });
  });

  getTop20Coins();
  setInterval(getTop20Coins, 10000);
});


document.addEventListener('DOMContentLoaded', () => {
  const refresh = document.getElementById('refresh-button');
  refresh.addEventListener('click', getTop20Coins);
});
