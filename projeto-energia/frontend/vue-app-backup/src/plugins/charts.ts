import { App } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'vue-chartjs';
import zoomPlugin from 'chartjs-plugin-zoom';

// Registra os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

// Configuração global do Chart.js
ChartJS.defaults.font.family = "'Roboto', sans-serif";
ChartJS.defaults.color = '#666';
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

// Configurações padrão para gráficos de linha
const defaultLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'x' as const
      },
      pan: {
        enabled: true,
        mode: 'x' as const
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
};

// Configurações padrão para gráficos de barra
const defaultBarOptions = {
  ...defaultLineOptions,
  plugins: {
    ...defaultLineOptions.plugins,
    zoom: {
      zoom: {
        wheel: {
          enabled: false
        },
        pinch: {
          enabled: false
        }
      },
      pan: {
        enabled: false
      }
    }
  }
};

// Configurações padrão para gráficos de pizza
const defaultPieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const
    }
  }
};

// Função para registrar os componentes de gráfico na aplicação
export function registerCharts(app: App) {
  // Registra os componentes base
  app.component('LineChart', Line);
  app.component('BarChart', Bar);
  app.component('PieChart', Pie);

  // Registra componentes personalizados
  app.component('EnergyLineChart', {
    extends: Line,
    props: {
      chartData: {
        type: Object,
        required: true
      },
      chartOptions: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      mergedOptions() {
        return {
          ...defaultLineOptions,
          ...this.chartOptions
        };
      }
    }
  });

  app.component('EnergyBarChart', {
    extends: Bar,
    props: {
      chartData: {
        type: Object,
        required: true
      },
      chartOptions: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      mergedOptions() {
        return {
          ...defaultBarOptions,
          ...this.chartOptions
        };
      }
    }
  });

  app.component('EnergyPieChart', {
    extends: Pie,
    props: {
      chartData: {
        type: Object,
        required: true
      },
      chartOptions: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      mergedOptions() {
        return {
          ...defaultPieOptions,
          ...this.chartOptions
        };
      }
    }
  });
}

export {
  defaultLineOptions,
  defaultBarOptions,
  defaultPieOptions
}; 