import { useRef, useEffect, useCallback, useState } from "react";
import * as d3 from "d3";
import "../styles/Chart.scss";

const WIDTH = 1200;
const HEIGHT = 800;
const MARGIN = { top: 0, right: 0, bottom: 20, left: 15 };
const MARGIN_AXIS = 25;
const INNER_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

function Chart({ data }) {
  const [lines, setLines] = useState([]);

  const axesRef = useRef(null);
  const gridRef = useRef(null);
  const chartRef = useRef(null);

  // const { xMin, xMax, yMin, yMax } = data.reduce((acc, val) => {
  //   const [xMin, xMax] = d3.extent(val.data, (d) => d.x);
  //   const [yMin, yMax] = d3.extent(val.data, (d) => d.y);

  //   return {
  //     xMin: acc.xMin <= xMin ? acc.xMin : xMin,
  //     xMax: acc.xMax >= xMax ? acc.xMax : xMax,
  //     yMin: acc.yMin <= yMin ? acc.yMin : yMin,
  //     yMax: acc.yMax >= yMax ? acc.yMax : yMax,
  //   };
  // }, {});

  const lineBuilder = (xScale, yScale) =>
  d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  //build all lines, axes, grids and store them
  useEffect(() => { 
    const axesElement = d3.select(axesRef.current);
    const gridElement = d3.select(gridRef.current);
    axesElement.selectAll("*").remove();
    gridElement.selectAll("*").remove();

    const linesInfo = data.map((el, i) => {
      const [xMin, xMax] = d3.extent(el.data, (d) => d.x);
      const [yMin, yMax] = d3.extent(el.data, (d) => d.y);

      const xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([0, INNER_WIDTH]);
      const yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([INNER_HEIGHT, 0]);

      const line = lineBuilder(xScale, yScale)(el.data);

      const xAxisGenerator = d3.axisBottom(xScale).ticks(6);
      const xAxis = axesElement
        .append("g")
        .attr("transform", `translate(0, ${INNER_HEIGHT - MARGIN_AXIS * i})`)
        .attr("id", `xAxis${i + 1}`)
        .call(xAxisGenerator);

      const xGridGenerator = d3
        .axisTop(xScale)
        .tickSize(-INNER_HEIGHT + MARGIN_AXIS * (data.length - 1))
        .tickFormat("")
        .ticks(6);
      const xGrid = gridElement.append("g").call(xGridGenerator);

      const yAxisGenerator = d3.axisLeft(yScale).ticks(6);
      const yAxis = axesElement
        .append("g")
        .attr("transform", `translate(${MARGIN.left + MARGIN_AXIS * i} , 0)`)
        .call(yAxisGenerator);

      const yGridGenerator = d3
        .axisRight(yScale)
        .tickSize(INNER_WIDTH - MARGIN_AXIS * (data.length - 1) - MARGIN.left)
        .tickFormat("")
        .ticks(6);

      const yGrid = gridElement
        .append("g")
        .attr(
          "transform",
          `translate(${MARGIN_AXIS * (data.length - 1) + MARGIN.left} , 0)`
        )
        .call(yGridGenerator);

      return {
        color: el.color,
        line,
        xScale,
        xAxisGenerator,
        xAxis,
        xGridGenerator,
        xGrid,
        yScale,
        yAxisGenerator,
        yAxis,
        yGridGenerator,
        yGrid,
      };
    });

    setLines(linesInfo);
  }, [data]);

  // zoom handler for axes
  const handleAxesZoom = ({ transform }) => {
    d3.select(chartRef.current).attr("transform", transform);

    lines.forEach((line) => {
      line.xAxis.call(
        line.xAxisGenerator.scale(transform.rescaleX(line.xScale))
      );
      line.xGrid.call(
        line.xGridGenerator.scale(transform.rescaleX(line.xScale))
      );

      line.yAxis.call(
        line.yAxisGenerator.scale(transform.rescaleY(line.yScale))
      );
      line.yGrid.call(
        line.yGridGenerator.scale(transform.rescaleY(line.yScale))
      );
    });
  };

  // zoom handler for the whole viewport
  const handleZoom = useCallback(({ transform }, line, i) => {
    d3.select(`#line${i + 1}`).attr("transform", transform);

    line.xAxis.call(line.xAxisGenerator.scale(transform.rescaleX(line.xScale)));
    line.xGrid.call(line.xGridGenerator.scale(transform.rescaleX(line.xScale)));

    line.yAxis.call(line.yAxisGenerator.scale(transform.rescaleY(line.yScale)));
    line.yGrid.call(line.yGridGenerator.scale(transform.rescaleY(line.yScale)));
  }, []);

  // set zoom for the whole viewport
  const zoom = d3.zoom().on("zoom", (e) => handleAxesZoom(e));
  d3.select("svg").call(zoom);

  // set zoom for each axes
  useEffect(() => {
    lines.forEach((line, i) => {
      const zoomAxis = d3.zoom().on("zoom", (e) => handleZoom(e, line, i));
      line.xAxis.call(zoomAxis);
      line.yAxis.call(zoomAxis);
    });
  }, [lines, handleZoom]);

  return (
    <svg width={WIDTH} height={HEIGHT} className="Chart">
      <defs>
        <clipPath id="chartView">
          <rect
            x={MARGIN.left + MARGIN_AXIS * (lines.length - 1)}
            y={0}
            width={INNER_WIDTH - MARGIN_AXIS * (lines.length - 1) - MARGIN.left}
            height={INNER_HEIGHT - MARGIN_AXIS * (lines.length - 1)}
          />
        </clipPath>
      </defs>
      <g
        width={INNER_WIDTH}
        height={INNER_HEIGHT}
        style={{ clipPath: "url(#chartView)" }}
      >
        <g ref={chartRef} width={INNER_WIDTH} height={INNER_HEIGHT}>
          {lines.map((el, i) => (
            <path className="line" d={el.line} id={`line${i}`} stroke={el.color} />
          ))}
        </g>
      </g>
      <g
        width={INNER_WIDTH}
        height={INNER_HEIGHT}
        ref={gridRef}
        color="#a6a6a6"
        style={{ clipPath: "url(#chartView)" }}
      />
      <g
        width={INNER_WIDTH}
        height={INNER_HEIGHT}
        ref={axesRef}
        color="#a6a6a6"
      />
    </svg>
  );
}

export default Chart;
