import { Component, ElementRef, input, ViewChild, effect, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { Account } from '../../../models/account';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<div #chart class="chart-container"></div>`,
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnDestroy {
  @ViewChild('chart') private chartContainer!: ElementRef;
  sectionClick = output<any>();
  accounts = input<Account[] | null>([]);

  private svg: any;
  private margin = { top: 20, right: 20, bottom: 60, left: 60 };
  private width = 400;
  private height = 400;
  private colors: any;

  constructor() {
    effect(() => {
      if (this.chartContainer && this.accounts()) {
        this.createChart();
      }
    });
  }

  private createChart(): void {
    const accounts = this.accounts();
    if (!this.chartContainer || !accounts) return;

    // Remove any existing chart
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();

    // Create color scale
    this.colors = d3.scaleOrdinal()
      .domain(['positive', 'negative'])
      .range(['#FFB347', '#B19CD9']); // orange for positive, purple for negative

    // Create SVG container
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Declare the x scale.
    const x = d3.scaleBand()
      .domain(accounts.map(d => d.number.toString()))
      .range([0, this.width])
      .padding(0.2);

    // Declare the y scale.
    const y = d3.scaleLinear()
      .domain([
        Math.min(d3.min(accounts, d => d.balance) ?? 0, 0),
        Math.max(d3.max(accounts, d => d.balance) ?? 0, 0)
      ])
      .range([this.height, 0]);

    // Add X axis
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'middle')

    // Add Y axis
    this.svg.append('g')
      .call(d3.axisLeft(y).ticks(10).tickFormat(d => `£${d.toString()}`));

    // Add bars - y(0) as baseline - "ground level" for the bars, where they either start or end based on their value. 
    // When you're drawing a bar, you'll often subtract the scaled value from y(0) to get the top-left corner of the bar. For example, y(0) - y(data_value) would give you the top y-coordinate of the bar. 
    this.svg.append('line')
      .attr('x1', 0) //starting x point
      .attr('x2', this.width) //ending x point
      .attr('y1', y(0)) //starting y point
      .attr('y2', y(0)) //ending y point
      .attr('stroke', '#000')

    // Add X axis label
    this.svg.append('text')
      .attr('transform', `translate(${this.width / 2}, ${this.height + this.margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .text('Account Number');

    // Add Y axis label
    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -this.margin.left + 15)
      .attr('x', -(this.height / 2))
      .style('text-anchor', 'middle')
      .text('Balance (£)');

    // Add rect for each bar
    this.svg.selectAll('rect')
      .data(accounts)
      .enter()
      .append('rect')
      .attr('x', (d: Account) => x(d.number.toString()) ?? 0)
      .attr('y', (d: Account) => d.balance >= 0 ? y(d.balance) : y(0))
      .attr('width', x.bandwidth())
      .attr('height', (d: Account) => Math.abs(y(0) - y(d.balance)))
      .attr('fill', (d: Account) => this.colors(d.balance >= 0 ? 'positive' : 'negative'))
      .style('cursor', 'pointer')
      .on('click', (event: any, d: any) => {
        this.sectionClick.emit(d.data);
      })
      .append('title')
      .text((d: Account) => `Account: ${d.number}\nType: ${d.card_type}\nBalance: £${d.balance}`)

    // Add zero balance indicator text
    this.svg.selectAll()
      .data(accounts.filter(d => d.balance === 0))
      .enter()
      .append('text')
      .attr('x', (d: Account) => (x(d.number.toString()) ?? 0) + x.bandwidth() / 2)
      .attr('y', y(0) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#000')
      .text('£0');
  }

  ngOnDestroy(): void {
    if (this.chartContainer?.nativeElement) {
      d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
    }
  }
}
