import { Component, ElementRef, input, ViewChild, effect, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<div #chart class="chart-container"></div>`,
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnDestroy {
  @ViewChild('chart') private chartContainer: ElementRef | undefined;
  sectionClick = output<any>();
  data = input<any[]>([]);

  private svg: any;
  private margin = { top: 20, right: 20, bottom: 20, left: 20 };
  private width = 250;
  private height = 250;
  private radius = Math.min(this.width, this.height) / 2 - this.margin.top;
  private colors: any;

  constructor() {
    effect(() => {
      if (this.chartContainer?.nativeElement && this.data()) {
        this.createChart();
      }
    });
  }

  private createChart(): void {
    const data = this.data();
    if (!this.chartContainer?.nativeElement || !data) return;

    // Remove any existing chart
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();

    // Create color scale
    this.colors = d3.scaleOrdinal()
      .domain(['+ Balance', '- Balance'])
      .range(['#FFB347', '#B19CD9']); // orange for positive, purple for negative

    // Create SVG container
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.width / 2 + this.margin.left},${this.height / 2 + this.margin.top})`);

    // Create pie chart
    const pie = d3.pie<any>()
      .sort(null) 
      .value(d => d.balance)

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius);

    // Add slices
    const slices = this.svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .on('click', (event: any, d: any) => {
        this.sectionClick.emit(d.data);
      })
      .attr('d', arc)
      .attr('fill', (d: any) => this.colors(d.data.card_type))
      .style('cursor', 'pointer')
      .append('title')
      .text((d: any) => `${d.data.card_type === 'positive' ? 'Number of accounts with 0 or positive balance' : 'Number of accounts with negative balance' }: ${d.data.balance}`)

    // Add labels
    this.svg.selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', 'white')
      .text((d: any) => {
        if (d.data.balance) {
          return `${d.data.card_type === 'positive' ? '+ Balance' : '- Balance' }(${d.data.balance})`;
        }
        return ''
      });
  }

  ngOnDestroy(): void {
    if (this.chartContainer?.nativeElement) {
      d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
    }
  }
}
