const API_URL = 'http://localhost:3001/api';

let currentSymbol = 'BYDDF';
let chart = null;
let stockData = null;

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadStock(currentSymbol);
});

function initEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('symbolInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const symbol = btn.dataset.symbol;
            document.getElementById('symbolInput').value = symbol;
            loadStock(symbol);
        });
    });

    document.querySelectorAll('.range-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateChart(btn.dataset.range);
        });
    });
}

function handleSearch() {
    const symbol = document.getElementById('symbolInput').value.trim().toUpperCase();
    if (symbol) {
        currentSymbol = symbol;
        loadStock(symbol);
    }
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('stockInfo').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
    hideLoading();
    document.getElementById('error').textContent = message;
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('stockInfo').classList.add('hidden');
}

async function loadStock(symbol) {
    showLoading();
    
    try {
        const response = await fetch(`${API_URL}?symbol=${symbol}`);
        if (!response.ok) throw new Error('Error en la petición');
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        stockData = data;
        displayStockInfo(data, symbol);
        displayChart(data);
        
        hideLoading();
        document.getElementById('stockInfo').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        showError(`No se pudieron obtener datos de ${symbol}. Verifica el símbolo.`);
    }
}

function updateChart(range) {
    if (stockData) {
        displayChart(stockData);
    }
}

function displayStockInfo(data, symbol) {
    const meta = data.meta;
    const quote = data.indicators?.quote?.[0];
    
    document.getElementById('companyName').textContent = meta.shortName || symbol;
    document.getElementById('stockSymbol').textContent = meta.symbol || symbol;
    
    const price = meta.regularMarketPrice || 0;
    const prevClose = meta.previousClose || meta.chartPreviousClose || price;
    const change = price - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;
    
    document.getElementById('currentPrice').textContent = formatPrice(price, meta.currency);
    
    const changeEl = document.getElementById('priceChange');
    changeEl.textContent = `${change >= 0 ? '+' : ''}${formatPrice(change, meta.currency)} (${changePercent.toFixed(2)}%)`;
    changeEl.className = `change ${change >= 0 ? 'positive' : 'negative'}`;
    
    const lastIdx = quote?.close?.length - 1 || 0;
    document.getElementById('openPrice').textContent = formatPrice(quote?.open?.[lastIdx] || meta.regularMarketOpen, meta.currency);
    document.getElementById('highPrice').textContent = formatPrice(quote?.high?.[lastIdx] || meta.regularMarketDayHigh, meta.currency);
    document.getElementById('lowPrice').textContent = formatPrice(quote?.low?.[lastIdx] || meta.regularMarketDayLow, meta.currency);
    document.getElementById('volume').textContent = formatNumber(meta.regularMarketVolume);
    document.getElementById('marketCap').textContent = meta.marketCap ? formatMarketCap(meta.marketCap) : '-';
    
    if (meta.fiftyTwoWeekHigh && meta.fiftyTwoWeekLow) {
        document.getElementById('week52').textContent = `${formatPrice(meta.fiftyTwoWeekLow, meta.currency)} - ${formatPrice(meta.fiftyTwoWeekHigh, meta.currency)}`;
    }
}

function displayChart(data) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    const timestamps = data.timestamp || [];
    const quote = data.indicators?.quote?.[0];
    const closes = quote?.close || [];
    
    const labels = timestamps.map(ts => {
        const date = new Date(ts * 1000);
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }).filter((_, i) => closes[i] !== null);
    
    const validCloses = closes.filter(c => c !== null);
    
    if (validCloses.length === 0) {
        console.error('No hay datos de precios');
        return;
    }
    
    const isPositive = validCloses[validCloses.length - 1] >= validCloses[0];
    const lineColor = isPositive ? '#4caf50' : '#f44336';
    const gradientColor = isPositive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)';
    
    if (chart) chart.destroy();
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Precio',
                data: validCloses,
                borderColor: lineColor,
                backgroundColor: (context) => {
                    const { ctx, chartArea } = context.chart;
                    if (!chartArea) return gradientColor;
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, gradientColor);
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: { label: (c) => `$${c.parsed.y.toFixed(2)}` }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8892b0', maxTicksLimit: 8 }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8892b0', callback: (v) => '$' + v.toFixed(2) }
                }
            }
        }
    });
}

function formatPrice(value, currency = 'USD') {
    if (value == null) return '-';
    const symbol = currency === 'USD' ? '$' : currency + ' ';
    return symbol + value.toFixed(2);
}

function formatNumber(num) {
    if (!num) return '-';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toString();
}

function formatMarketCap(num) {
    return formatNumber(num);
}
