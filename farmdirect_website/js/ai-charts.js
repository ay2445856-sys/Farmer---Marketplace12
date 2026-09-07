/**
 * FarmDirect - AI Demand Forecasting & Logistics Analytics (Chart.js)
 * Smart India Hackathon (SIH)
 */

let demandChartInstance = null;
let fleetChartInstance = null;

// Multi-crop AI historical & 7-day projection dataset matching SIH prompt specifications
const AI_CROP_PROJECTIONS = {
  onion: {
    name: "Onion (प्याज) - Bhadohi / Nashik",
    trend: "↑ 18% (HIGH)",
    trendBadge: "Next 7 Days: HIGH",
    confidence: "94.2%",
    growth: "+18.0%",
    currentPrice: 25.0,
    targetPrice: 29.5,
    advisoryHindi: "AI मांग अलर्ट: प्रमुख थोक मंडियों में कम आवक और त्योहारी मांग के कारण अगले 7 दिनों में प्याज की मांग 18% बढ़ेगी। किसानों को ₹28-30/kg का लक्षित भाव मिलने की संभावना है। अपनी फसल धीरे-धीरे बाजार में लाएं।",
    advisoryEnglish: "AI Demand Surge: Due to lower mandi arrivals and festive consumption, onion demand is projected to surge by +18% over the next 7 days. Target selling price: ₹28-30/kg.",
    labels: ['Day 1 (आज)', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    prices: [25.0, 25.8, 26.5, 27.2, 28.0, 28.8, 29.5],
    demandIndex: [100, 104, 108, 112, 115, 117, 118]
  },
  potato: {
    name: "Potato (आलू) - Prayagraj / Pune",
    trend: "→ Stable (संतुलित)",
    trendBadge: "Next 7 Days: STABLE",
    confidence: "91.5%",
    growth: "+2.5%",
    currentPrice: 22.0,
    targetPrice: 22.8,
    advisoryHindi: "AI विश्लेषण: कोल्ड स्टोरेज से पर्याप्त निरंतर आपूर्ति उपलब्ध है। आलू की मांग अगले 7 दिनों तक स्थिर (Stable) बनी रहने का अनुमान है। घबराहट में कम भाव पर न बेचें।",
    advisoryEnglish: "AI Forecast: Steady supply from cold storage buffers price fluctuations. Potato demand and pricing remain stable for the next 7 days.",
    labels: ['Day 1 (आज)', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    prices: [22.0, 22.1, 22.2, 22.4, 22.5, 22.6, 22.8],
    demandIndex: [100, 101, 101, 102, 102, 103, 103]
  },
  tomato: {
    name: "Tomato (टमाटर) - Varanasi / Pimpalgaon",
    trend: "↑ 12% (वृद्धि)",
    trendBadge: "Next 7 Days: MODERATE HIGH",
    confidence: "89.8%",
    growth: "+12.0%",
    currentPrice: 18.0,
    targetPrice: 20.8,
    advisoryHindi: "AI अलर्ट: बेमौसम वर्षा के कारण आसपास के उत्पादक क्षेत्रों से आवक में हल्की गिरावट है। टमाटर की मांग 12% बढ़ने का अनुमान है। अनुमानित भाव ₹20-22/kg।",
    advisoryEnglish: "AI Warning: Rainfall disruption in neighboring harvest zones is driving local demand up by +12%. Target retail realization: ₹20-22/kg.",
    labels: ['Day 1 (आज)', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    prices: [18.0, 18.5, 19.1, 19.6, 20.0, 20.4, 20.8],
    demandIndex: [100, 102, 105, 107, 109, 111, 112]
  },
  wheat: {
    name: "Sharbati Wheat (गेहूं) - Mirzapur / Punjab",
    trend: "→ Stable (+4%)",
    trendBadge: "Next 7 Days: BALANCED",
    confidence: "95.0%",
    growth: "+4.0%",
    currentPrice: 28.0,
    targetPrice: 29.2,
    advisoryHindi: "AI रिपोर्ट: सरकारी खरीद और मिलर्स मांग के बीच संतुलन बना हुआ है। भाव में सामान्य मजबूती जारी रहेगी।",
    advisoryEnglish: "AI Summary: Balanced institutional and private miller procurement ensures firm, steady pricing.",
    labels: ['Day 1 (आज)', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    prices: [28.0, 28.2, 28.4, 28.6, 28.8, 29.0, 29.2],
    demandIndex: [100, 101, 102, 102, 103, 103, 104]
  }
};

function renderDemandForecastChart(cropKey = 'onion') {
  const canvas = document.getElementById('aiForecastCanvas');
  if (!canvas) return;

  const data = AI_CROP_PROJECTIONS[cropKey] || AI_CROP_PROJECTIONS.onion;
  const isEnglish = window.AppState && window.AppState.language === 'en';

  // Update UI text and metrics
  const advEl = document.getElementById('aiAdvisoryText');
  if (advEl) advEl.innerText = `“${isEnglish ? data.advisoryEnglish : data.advisoryHindi}”`;

  const confEl = document.getElementById('aiConfidenceScore');
  if (confEl) confEl.innerText = data.confidence;

  const surgeEl = document.getElementById('aiSurgeGrowth');
  if (surgeEl) surgeEl.innerText = data.growth;

  const curPriceEl = document.getElementById('aiCurrentPrice');
  if (curPriceEl) curPriceEl.innerText = `₹${data.currentPrice}/kg`;

  const targetPriceEl = document.getElementById('aiTargetPrice');
  if (targetPriceEl) targetPriceEl.innerText = `₹${data.targetPrice}/kg`;

  const trendBadgeEl = document.getElementById('aiTrendBadge');
  if (trendBadgeEl) trendBadgeEl.innerText = data.trendBadge;

  if (demandChartInstance) {
    demandChartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  demandChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: isEnglish ? 'Predicted Price (₹/kg)' : 'अनुमानित भाव (₹/kg)',
          data: data.prices,
          borderColor: '#1E6F3D',
          backgroundColor: 'rgba(30, 111, 61, 0.12)',
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          yAxisID: 'y'
        },
        {
          label: isEnglish ? 'Demand Index (Base 100)' : 'मांग सूचकांक (Demand Index)',
          data: data.demandIndex,
          borderColor: '#E65100',
          borderDash: [6, 4],
          borderWidth: 2.5,
          pointBackgroundColor: '#E65100',
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600' }
          }
        },
        tooltip: {
          padding: 10,
          boxPadding: 4
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: isEnglish ? 'Price (₹/kg)' : 'भाव (₹ / kg)', font: { weight: 'bold' } },
          grid: { color: 'rgba(0,0,0,0.06)' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: isEnglish ? 'Demand Index' : 'मांग Index', font: { weight: 'bold' } },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

function renderFleetComparisonChart() {
  const canvas = document.getElementById('fleetCostCanvas');
  if (!canvas) return;

  if (fleetChartInstance) fleetChartInstance.destroy();

  const isEnglish = window.AppState && window.AppState.language === 'en';
  const ctx = canvas.getContext('2d');
  fleetChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Electric 3W (Treo Zor)', 'Tata Ace (1.5 Ton)', 'Bolero Maxi (3.5 Ton)', 'Eicher 14ft (7.5 Ton)'],
      datasets: [
        {
          label: isEnglish ? 'Conventional Route Cost (₹)' : 'पारंपरिक लागत (Conventional ₹)',
          data: [550, 480, 1200, 2400],
          backgroundColor: '#CBD5E1',
          borderRadius: 6
        },
        {
          label: isEnglish ? 'FarmDirect AI Optimized (₹)' : 'FarmDirect AI लागत (₹)',
          data: [380, 300, 920, 1950],
          backgroundColor: '#1E6F3D',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: isEnglish ? 'AI Clustering & Route Matching Savings' : 'AI रूट व क्षमता मैचिंग से अनुमानित कुल बचत: ₹24,500'
        }
      },
      scales: {
        y: {
          title: { display: true, text: isEnglish ? 'Trip Cost (₹ INR)' : 'लागत (₹ INR)' }
        }
      }
    }
  });
}

window.changeForecastCrop = function(cropKey) {
  renderDemandForecastChart(cropKey);
};

window.renderDemandForecastChart = renderDemandForecastChart;
window.renderFleetComparisonChart = renderFleetComparisonChart;
