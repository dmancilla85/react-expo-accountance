import * as d3 from 'd3';
import { descending } from 'd3-array';
import { tooltip } from 'd3tooltip';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const MARGIN = { top: 10, right: 20, bottom: 10, left: 0 };

type CircularBarPlotData = {
  _id: string;
  count: number;
};

type CircularBarPlotProps = {
  data: CircularBarPlotData[];
  canvasId: string;
  width: number;
  height: number;
  color: string;
  rotateTextX: number;
  labelY: string;
};

const capitalize = (str: string | null | undefined): string => {
  if (str == null) {
    return '';
  }
  str = str.toLowerCase();
  const arr = str.split(' ');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(' ');
};

export function CircularBarPlot(props: CircularBarPlotProps) {
  let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  let graph: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  let graphWidth = 400;
  let graphHeight = 400;
  let outerRadius = Math.min(graphWidth, graphHeight) / 2 - 15;
  let innerRadius = outerRadius / 2;
  let x: d3.ScaleBand<string>;
  let y: d3.ScaleRadial<number, number>;

  // The Update Pattern
  const update = (data: CircularBarPlotData[]) => {
    data = data.filter((item) => item._id !== null && item._id !== undefined && item.count > 1);
    const sortedData = data.sort((a, b) => descending(a.count, b.count));

    x = d3
      .scaleBand<string>()
      .range([0 + Math.PI / 4, 2 * Math.PI + Math.PI / 4])
      .align(0)
      .domain(sortedData.map((item) => item._id));

    y = d3
      .scaleRadial()
      .range([innerRadius, outerRadius])
      .domain([0, d3.max(sortedData, (d) => d.count) ?? 0]);

    // 2. join updated data to elements
    const paths = graph.selectAll<SVGPathElement, CircularBarPlotData>('path').data(data);

    // 3. remove unwanted (if any) shapes using the exit selection
    paths.exit().remove();

    // Add the bars
    paths
      .enter()
      .append('path')
      .data(data)
      .join('path')
      .attr('fill', props.color)
      .attr(
        'd',
        d3
          .arc<CircularBarPlotData>()
          .innerRadius(innerRadius)
          .outerRadius((d) => y(d.count))
          .startAngle((d) => x(d._id)!)
          .endAngle((d) => x(d._id)! + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius),
      );

    // Add the labels
    graph
      .append('g')
      .selectAll<SVGGElement, CircularBarPlotData>('g')
      .data(data)
      .join('g')
      .attr('text-anchor', function (d) {
        return (x(d._id)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? 'end'
          : 'start';
      })
      .attr('transform', function (d) {
        return (
          'rotate(' +
          (((x(d._id)! + x.bandwidth() / 2) * 180) / Math.PI - 90) +
          ')' +
          'translate(' +
          (y(d.count) + 10) +
          ',0)'
        );
      })
      .append('text')
      .text(function (d) {
        if (typeof d._id === 'string') {
          return capitalize(d._id);
        } else {
          return '';
        }
      })
      .attr('transform', function (d) {
        return (x(d._id)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? 'rotate(180)'
          : 'rotate(0)';
      })
      .style('font-size', '11px')
      .attr('alignment-baseline', 'middle');

    // tooltipOptions
    const options = {
      offset: { left: 30, top: 10 },
      styles: { 'min-width': '50px', 'border-radius': '5px' },
    };

    // add events
    graph
      .selectAll<SVGPathElement, CircularBarPlotData>('path')
      .call(
        tooltip('tooltipBar', {
          ...options,
          text: (d: CircularBarPlotData) =>
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
        d3.select(this).style('fill', 'red');
      })
      .on('mouseout', function () {
        d3.select(this).style('fill', props.color);
      });
  };

  useEffect(() => {
    if (props.data === undefined || props.data.length === 0) {
      return;
    }

    // clean
    d3.select(`#${props.canvasId} svg`).remove();

    svg = d3
      .select<HTMLElement, unknown>(`#${props.canvasId}`)
      .append('svg')
      .attr('width', props.width)
      .attr('height', props.height)
      .attr('viewBox', `0 0 ${props.width} ${props.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // create margins and dimensions
    graphWidth = props.width - MARGIN.left - MARGIN.right;
    graphHeight = props.height - MARGIN.top - MARGIN.bottom;
    outerRadius = Math.min(graphWidth, graphHeight) / 2;
    innerRadius = outerRadius - (240 - props.data.length);

    graph = svg
      .append('g')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      .attr(
        'transform',
        `translate(${graphWidth / 2 + MARGIN.left}, ${graphHeight / 2 + MARGIN.top})`,
      );

    update(props.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  // TWEENS
  const widthTween = (d: CircularBarPlotData) => {
    let i = d3.interpolate(0, x.bandwidth());
    return function (t: number) {
      return i(t);
    };
  };

  return <div className="canvas overflow-auto" id={props.canvasId}></div>;
}

CircularBarPlot.propTypes = {
  data: PropTypes.array,
  canvasId: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  rotateTextX: PropTypes.number,
  labelY: PropTypes.string,
};
