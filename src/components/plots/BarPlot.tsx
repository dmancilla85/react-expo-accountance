import * as d3 from 'd3';
import { tooltip } from 'd3tooltip';
import { useEffect } from 'react';

const MARGIN = { top: 20, right: 20, bottom: 100, left: 100 };

type BarPlotData = {
  _id: string;
  count: number;
};

type BarPlotProps = {
  data: BarPlotData[];
  canvasId: string;
  width: number;
  height: number;
  color: string;
  rotateTextX: number;
  labelY: string;
};

export function BarPlot(props: BarPlotProps) {
  let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  let graph: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  let graphWidth = 400;
  let graphHeight = 400;
  let xAxisGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  let yAxisGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  let x: d3.ScaleBand<string>;
  let y: d3.ScaleLinear<number, number>;
  let xAxis: d3.Axis<string>;
  let yAxis: d3.Axis<d3.NumberValue>;

  // The Update Pattern
  const update = (data: BarPlotData[]) => {
    const t = d3.transition().duration(1500);
    // Sort data in ascending order
    data.sort((a, b) => b.count - a.count);
    // 1. update scales (domains) if they rely on our data
    y.domain([0, d3.max(data, (d) => d.count) ?? 0]);
    x.domain(data.map((item) => item._id));

    // 2. join updated data to elements
    const rects = graph.selectAll<SVGRectElement, BarPlotData>('rect').data(data);

    // 3. remove unwanted (if any) shapes using the exit selection
    rects.exit().remove();

    // 4. update current shapes in the DOM
    rects
      .attr('width', x.bandwidth())
      .attr('fill', props.color)
      .attr('x', (d) => x(d._id) ?? 0);

    // 5. append the enter selection to the DOM
    rects
      .enter()
      .append('rect')
      .attr('width', 0)
      .attr('fill', props.color)
      .attr('x', (d) => x(d._id) ?? 0)
      .attr('y', graphHeight)
      .attr('height', 0)
      .transition(t)
      .attrTween('width', widthTween)
      .attr('y', (d) => y(d.count))
      .attr('height', (d) => graphHeight - y(d.count))
      .on('end', () => {
        // Etiquetas de datos
        const dataLabels = graph
          .selectAll('.data-label')
          .data(data)
          .enter()
          .append('g')
          .attr('class', 'data-label');

        dataLabels
          .append('rect')
          .attr('class', 'data-label-bg')
          .attr('x', (d) => x(d._id) ?? 0)
          .attr('y', (d) => y(d.count) - 20)
          .attr('width', x.bandwidth())
          .attr('height', 20)
          .attr('fill', 'white')
          .attr('opacity', 0.8);

        dataLabels
          .append('text')
          .attr('x', (d) => (x(d._id) ?? 0) + x.bandwidth() / 2)
          .attr('y', (d) => y(d.count) - 10)
          .attr('fill', 'black')
          .style('font-size', '9px')
          .style('font-weight', 'normal')
          .style('text-anchor', 'middle')
          .text((d) => `${d.count}`);
      });

    // call axis
    xAxisGroup
      .call(xAxis)
      .selectAll('text')
      .attr('transform', `rotate(${props.rotateTextX})`)
      .attr('text-anchor', 'end')
      .attr('fill', 'black');

    yAxisGroup.call(yAxis);

    // tooltipOptions
    const options = {
      offset: { left: 30, top: 10 },
      styles: { 'min-width': '50px', 'border-radius': '5px' },
    };

    // add events
    graph
      .selectAll<SVGRectElement, BarPlotData>('rect')
      .call(
        tooltip('tooltipBar', {
          ...options,
          text: (d: BarPlotData) =>
            `<div class="tooltipBar" style="
              width: 120px;
              background-color: ivory;
              color: black;
              text-align: center;
              border-color: gray;
              border-width: thin;
              border-style: solid;
              border-radius: 6px;
              padding: 5px 0;
              position: absolute;
              z-index: 1;
              bottom: 150%;
              left: 50%;
              margin-left: -60px;
            "><span class="tooltiptext"><b>${d._id}</b><br>${d.count} unidades</span></div>`,
        }),
      )
      .on('mouseover', function () {
        d3.select(this).style('fill', 'grey');
      })
      .on('mouseout', function () {
        d3.select(this).style('fill', props.color);
      });
  };

  useEffect(() => {
    if (!props.data || props.data.length === 0) {
      return;
    }

    // clean
    d3.select(`#${props.canvasId} svg`).remove();

    svg = d3
      .select(`#${props.canvasId}`)
      .append('svg')
      .attr('width', props.width)
      .attr('height', props.height)
      .attr('viewBox', `0 0 ${props.width} ${props.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // create margins and dimensions
    graphWidth = props.width - MARGIN.left - MARGIN.right;
    graphHeight = props.height - MARGIN.top - MARGIN.bottom;

    graph = svg
      .append('g')
      .attr('width', graphHeight)
      .attr('height', graphWidth)
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    xAxisGroup = graph.append('g').attr('transform', `translate(0,${graphHeight})`);
    yAxisGroup = graph.append('g');

    svg
      .append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end')
      .attr('x', graphWidth / 2 + MARGIN.left)
      .attr('y', props.height - 8)
      .text(props.labelY);

    svg
      .append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('y', 6)
      .attr('x', -(graphHeight / 2))
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('unidades');

    // scales
    y = d3.scaleLinear().range([graphHeight, 0]);

    x = d3
      .scaleBand<string>()
      .range([0, props.width - 100])
      .paddingInner(0.2)
      .paddingOuter(0.2);

    // create and call the axes
    xAxis = d3.axisBottom(x);
    yAxis = d3
      .axisLeft(y)
      .ticks(5)
      .tickFormat((d) => `${d}`);

    update(props.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  // TWEENS
  const widthTween = (d: BarPlotData) => {
    let i = d3.interpolate(0, x.bandwidth());
    return function (t: number) {
      return String(i(t));
    };
  };

  return <div className="canvas overflow-auto" id={props.canvasId}></div>;
}
