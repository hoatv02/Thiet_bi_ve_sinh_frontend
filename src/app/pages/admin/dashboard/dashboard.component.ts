import { Component, OnInit } from '@angular/core';
import { ApexNonAxisChartSeries, ApexResponsive, NgxApexchartsModule } from 'ngx-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexTitleSubtitle,
  ApexYAxis
} from 'ngx-apexcharts';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { LoadingService } from '../../../services/loading.service';
import { Router, RouterModule } from '@angular/router';

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  responsive: ApexResponsive[];
  legend: any;
  dataLabels: any;
  plotOptions: any;
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxApexchartsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  topProducts: any[] = [];
  chartWebsite: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'area', height: 200 },
    xaxis: { categories: [] },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    grid: { borderColor: '#f1f1f1' },
    title: { text: '' },
    yaxis: {},
    colors: ['#3AA7E9']
  };

  chartZalo: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'area', height: 200 },
    xaxis: { categories: [] },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    grid: { borderColor: '#f1f1f1' },
    title: { text: '' },
    yaxis: {},
    colors: ['#10b981']
  };
  chartAds: Partial<DonutChartOptions> = {};


  totalProducts = 152;
  inStock = 114;
  outOfStock = 38;
  totalAds = 30;
  totalDistributors = 39;
  totalAddedToCart = 458;

  ngOnInit(): void {
    this.initCharts();
    this.loadSummary();
  }
  async loadSummary() {
    this.loadingService.show(); // bật loading

    try {
      const res = await this.dashboardService.getSummary().toPromise();

      console.log("📌 Dữ liệu summary từ API:", res);

      this.totalProducts = res.totalProducts;
      this.topProducts = res.topProducts;
      this.inStock = res.inStock;
      this.outOfStock = res.outOfStock;
      this.totalAds = res.totalAds;
      this.totalDistributors = res.totalDistributors;
      this.totalAddedToCart = res.totalAddedToCart;

      // 🟧 Cập nhật dữ liệu donut chart theo API
      this.chartAds.series = [
        res.ordersCanceled ?? 0,
        res.ordersSucceeded ?? 0,
        res.ordersShipping ?? 0
      ];

    } catch (error) {
      console.error("❌ Lỗi khi gọi API Dashboard/summary:", error);

    } finally {
      this.loadingService.hide();
    }
  }



  initCharts() {
    this.chartAds = {
      series: [], // 3 loại: chưa, đang, đã
      chart: {
        type: 'donut',
        height: 220,
      },
      labels: ['Đã hủy', 'Thành công', 'Đang giao'],
      colors: ['#000000', '#3AA7E9', '#fde68a'], // đen, cam, vàng nhạt
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false, // ta tự custom phần legend bên phải
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Đơn hàng',
                fontSize: '14px',
                fontWeight: 400,
                color: '#6b7280',
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
          }
        }
      ]
    };
    this.chartWebsite = {
      series: [
        {
          name: 'Lượt truy cập',
          data: [2000, 2500, 3000, 2800, 4000, 3500, 3700]
        }
      ],
      chart: {
        type: 'area',
        height: 200,
        toolbar: { show: false }
      },
      colors: ['#3AA7E9'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      xaxis: {
        categories: ['05/09', '10/09', '15/09', '20/09', '25/09', '30/09'],
        labels: { style: { colors: '#888' } }
      },
      yaxis: {
        labels: { style: { colors: '#888' } }
      },
      grid: { borderColor: '#f1f1f1' },
      title: { text: '' }
    };

    this.chartZalo = {
      series: [
        {
          name: 'Liên hệ Zalo',
          data: [1000, 1800, 2100, 2500, 1900, 2200, 2400]
        }
      ],
      chart: {
        type: 'area',
        height: 200,
        toolbar: { show: false }
      },
      colors: ['#10b981'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      xaxis: {
        categories: ['05/09', '10/09', '15/09', '20/09', '25/09', '30/09'],
        labels: { style: { colors: '#888' } }
      },
      yaxis: {
        labels: { style: { colors: '#888' } }
      },
      grid: { borderColor: '#f1f1f1' },
      title: { text: '' }
    };
  }
}
