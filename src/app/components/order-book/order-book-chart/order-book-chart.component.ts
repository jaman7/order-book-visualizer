import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Order, OrderBookSnapshot } from '../order-book.models';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-order-book-chart',
  standalone: true,
  imports: [NzToolTipModule],
  templateUrl: './order-book-chart.component.html',
  styleUrls: ['./order-book-chart.component.scss'],
})
export class OrderBookChartComponent implements OnChanges {
  @Input() data: OrderBookSnapshot[] | null = null;
  @ViewChild('chart', { static: true }) chartRef!: ElementRef<HTMLDivElement>;

  private svg: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
  private x: d3.ScaleLinear<number, number> | null = null;
  private y: d3.ScaleBand<string> | null = null;

  ngOnChanges(): void {
    if (this.data && this.data.length > 0) {
      this.drawChart(this.data[0]);
    }
  }

  private drawChart(snapshot: OrderBookSnapshot): void {
    const element = this.chartRef.nativeElement;
    const margin = { top: 20, right: 30, bottom: 40, left: 80 };
    const width = element.clientWidth || 600;
    const height = element.clientHeight || 400;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    d3.select(element).selectAll('*').remove();
    const svgContainer = d3.select(element).append('svg').attr('width', width).attr('height', height);
    this.svg = svgContainer.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltipDiv = d3
      .select('body') // zamiast element
      .append('div')
      .attr('class', 'custom-tooltip')
      .style('position', 'fixed')
      .style('z-index', '1000')
      .style('font-size', '12px')
      .style('background', '#333')
      .style('color', '#fff')
      .style('padding', '5px 10px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const bids = [...snapshot.bids].sort((a, b) => b.price - a.price);
    const asks = [...snapshot.asks].sort((a, b) => a.price - b.price);
    const allPrices = [...bids.map(b => b.price), ...asks.map(a => a.price)].map(p => p.toFixed(4));

    this.y = d3.scaleBand<string>().domain(allPrices).range([0, chartHeight]).padding(0.1);
    this.x = d3
      .scaleLinear()
      .domain([-d3.max([...bids, ...asks], d => d.volume)!, d3.max([...bids, ...asks], d => d.volume)!])
      .range([0, chartWidth]);

    const t = this.svg.transition().duration(500);

    const updateBars = (data: Order[], className: string, color: string, isBid: boolean) => {
      const bars = this.svg!.selectAll<SVGRectElement, Order>(`.${className}`).data(data, d => d.price.toFixed(4));

      const barsEnter = bars
        .enter()
        .append('rect')
        .attr('class', className)
        .attr('x', d => this.x!(isBid ? -d.volume : 0))
        .attr('y', d => this.y!(d.price.toFixed(4))!)
        .attr('height', this.y!.bandwidth())
        .attr('width', 0)
        .attr('fill', color)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .on('mouseover', (event, d) => {
          const yPos = this.y!(d.price.toFixed(4))!;
          const xPos = this.x!(isBid ? -d.volume : d.volume);
          tooltipDiv.transition().duration(200).style('opacity', 0.9);
          tooltipDiv
            .html(`<strong>Price:</strong> ${d.price}<br><strong>Volume:</strong> ${d.volume}`)
            .style('left', `${event.clientX + 10}px`)
            .style('top', `${event.clientY - 30}px`);
        })
        .on('mouseout', function () {
          tooltipDiv.transition().duration(200).style('opacity', 0);
        });

      bars
        .merge(barsEnter)
        .transition(t)
        .attr('x', d => this.x!(isBid ? -d.volume : 0))
        .attr('y', d => this.y!(d.price.toFixed(4))!)
        .attr('height', this.y!.bandwidth())
        .attr('width', d => Math.abs(this.x!(d.volume) - this.x!(0)));

      bars.exit().transition(t).attr('width', 0).remove();

      const bestPrice = isBid ? d3.max(data, d => d.price) : d3.min(data, d => d.price);
      this.svg!.selectAll(`.${className}`)
        .filter((d: Order) => d.price === bestPrice)
        .attr('stroke', '#000')
        .attr('stroke-width', 1.5);
    };

    updateBars(bids, 'bid-bar', '#007700', true);
    updateBars(asks, 'ask-bar', '#cc0000', false);

    this.svg!.selectAll('.axis-price').remove();
    this.svg!.append('g')
      .attr('class', 'axis-price')
      .call(d3.axisLeft(this.y).tickSize(0))
      .selectAll('text')
      .attr('text-anchor', 'end')
      .style('fill', '#999');

    const xAxis = d3.axisBottom(this.x!).ticks(5).tickFormat(d3.format('~s'));

    this.svg!.selectAll('.axis-x').remove();
    this.svg!.append('g')
      .attr('class', 'axis-x')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', '#666');

    this.svg!.append('line')
      .attr('x1', this.x!(0))
      .attr('x2', this.x!(0))
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#ccc')
      .attr('stroke-dasharray', '4 2');

    const legend = svgContainer
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin.right - 120},${margin.top})`);

    legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 15).attr('height', 15).attr('fill', '#cc0000');

    legend.append('text').attr('x', 20).attr('y', 12).text('Asks').style('font-size', '12px');

    legend.append('rect').attr('x', 0).attr('y', 20).attr('width', 15).attr('height', 15).attr('fill', '#007700');

    legend.append('text').attr('x', 20).attr('y', 32).text('Bids').style('font-size', '12px');
  }
}
