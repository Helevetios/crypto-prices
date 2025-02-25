let table;

async function getTop20Coins() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    const data = await response.json();

    // Filtrar solo pares USDT y ordenar por precio descendente
    const top20 = data
      .filter(coin => coin.symbol.endsWith('USDT'))
      .sort((a, b) => parseFloat(b.lastPrice) - parseFloat(a.lastPrice))
      .slice(0, 20);

    // Limpiar y agregar nuevas filas a la tabla
    table.clear();
    top20.forEach(coin => {
      table.row.add([
        coin.symbol,
        `$${parseFloat(coin.lastPrice).toFixed(2)}`,
        parseFloat(coin.volume).toLocaleString(),
        `${parseFloat(coin.priceChangePercent).toFixed(2)}%`
      ]);
    });
    table.draw();

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

$(document).ready(function () {
  // Inicializar DataTable
  table = $('#cryptoTable').DataTable({
    paging: true,
    searching: true,
    info: false,
    order: [] // Para evitar que ordene automáticamente al recargar
  });

  // Obtener datos al cargar la página
  getTop20Coins();

  // Actualizar datos cada 10 segundos
  setInterval(getTop20Coins, 10000);
});