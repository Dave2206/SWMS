<template>
  <div class="space-y-8">
    <div class="mx-auto p-10">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-gray-800">Reports</h2>
        <button
          @click="exportToExcel"
          class="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Export to Excel
        </button>
      </div>

      <!-- Flex Container for Data Table and Charts -->
      <div class="flex flex-col md:flex-row gap-8 mt-6">
        
        <!-- Data Table on the Left -->
        <div class="flex-1 overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    <th class="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-white bg-green-500">Area</th>
                    <th class="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-white bg-green-500">Total Number of Concern for Concern 1</th>
                    <th class="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-white bg-green-500">Total Number of Concern for Concern 2</th>
                    <th class="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-white bg-green-500">Total Number of Concern for Concern 3</th>
                    <th class="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-white bg-green-500">Total Number of Concerns</th>
                    <th class="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-white bg-green-500">Total Number of Resolved Concerns</th>
                </tr>
            </thead>

            <tbody>
              <tr v-for="(row, index) in reportData" :key="index" class="hover:bg-gray-100">
                <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-700">{{ row.area }}</td>
                <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-700">{{ row.concern1 }}</td>
                <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-700">{{ row.concern2 }}</td>
                <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-700">{{ row.concern3 }}</td>
                <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-700">{{ row.totalConcerns }}</td>
                <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-700">{{ row.resolvedConcerns }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Charts on the Right -->
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-semibold text-gray-800 mb-2">Concerns by Area</h3>
            <canvas id="concernsByArea"></canvas>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-800 mb-2">Concerns Breakdown</h3>
            <canvas id="concernsBreakdown"></canvas>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';

Chart.register(...registerables);

export default {
  name: 'ReportsPage',
  data() {
    return {
      reportData: [
        {
          area: 'Area 1',
          concern1: 5,
          concern2: 10,
          concern3: 3,
          totalConcerns: 18,
          resolvedConcerns: 12,
        },
        {
          area: 'Area 2',
          concern1: 8,
          concern2: 6,
          concern3: 7,
          totalConcerns: 21,
          resolvedConcerns: 15,
        },
        // Add more rows as needed
      ],
    };
  },
  mounted() {
    this.renderCharts();
  },
  methods: {
    renderCharts() {
      // Graph: Concerns by Area
      const concernsByAreaCtx = document.getElementById('concernsByArea').getContext('2d');
      new Chart(concernsByAreaCtx, {
        type: 'bar',
        data: {
          labels: this.reportData.map((row) => row.area),
          datasets: [
            {
              label: 'Total Concerns',
              data: this.reportData.map((row) => row.totalConcerns),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });

      // Graph: Concerns Breakdown
      const concernsBreakdownCtx = document.getElementById('concernsBreakdown').getContext('2d');
      new Chart(concernsBreakdownCtx, {
        type: 'pie',
        data: {
          labels: ['Concern 1', 'Concern 2', 'Concern 3'],
          datasets: [
            {
              data: [
                this.reportData.reduce((sum, row) => sum + row.concern1, 0),
                this.reportData.reduce((sum, row) => sum + row.concern2, 0),
                this.reportData.reduce((sum, row) => sum + row.concern3, 0),
              ],
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    },
    exportToExcel() {
      // Convert data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(this.reportData);

      // Styling the header and adding borders
      const headerStyle = {
        font: { bold: true },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        },
        alignment: { horizontal: 'center', vertical: 'center' },
      };

      const columnStyle = {
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        },
      };

      // Apply styles to header and columns
      const range = XLSX.utils.decode_range(worksheet['!ref']); // Get the range
      for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: col })];
        if (headerCell) {
          headerCell.s = headerStyle;
        }
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
          const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
          if (cell) {
            cell.s = columnStyle;
          }
        }
      }

      // Create a workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

      // Export the workbook
      XLSX.writeFile(workbook, 'Reports.xlsx');
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
