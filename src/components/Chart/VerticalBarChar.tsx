import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [10, 56, 89, 122],
      backgroundColor: 'rgb(157, 18, 155)',
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
    {
      label: 'Dataset 2',
      data: [18, 54, 99, 152],
      backgroundColor: 'rgb(212, 102, 24)',
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
  ],
}

function VerticalBarChar(props: {}) {
  return <Bar options={options} data={data} />
}

export default VerticalBarChar
