import { GraphicNode } from "@arithmico/engine/lib/types";
import CoordinateGrid from "./components/coordinate-grid";
import { GraphicDimensions, RenderTarget } from "../../graphic-renderer.types";
import LinePath from "./components/line-path";
import { calculateAutoTicks } from "./utils/calculate-auto-ticks";
import { calculateGridPointPositions } from "./utils/calculate-grid-point-positions";
import { calculateAxisPrositions } from "./utils/calculate-axis-positions";
import { calculateLinePaths } from "./utils/calculate-line-paths";
import YAxis from "./components/y-axis";
import XAxis from "./components/x-axis";
import { calculateTickLabelPositions } from "./utils/calculate-tick-label-positions";
import XTickLabels from "./components/x-tick-labels";
import YTickLabels from "./components/y-tick-labels";

export interface Cartesian2DGraphicProps {
  target: RenderTarget;
  graphic: GraphicNode;
  dimensions: GraphicDimensions;
}

export default function Cartesian2DGraphic({
  target,
  graphic,
  dimensions,
}: Cartesian2DGraphicProps): JSX.Element {
  const autoTicks = calculateAutoTicks({ graphic, dimensions });
  const gridPointPositions = calculateGridPointPositions({
    limits: graphic.limits,
    ticks: autoTicks,
    dimensions,
  });
  const axisPositions = calculateAxisPrositions({
    limits: graphic.limits,
    ticks: autoTicks,
    dimensions,
  });
  const linePaths = calculateLinePaths({
    lines: graphic.lines,
    limits: graphic.limits,
    dimensions,
  });
  const tickLabelPositions = calculateTickLabelPositions({
    limits: graphic.limits,
    ticks: autoTicks,
    dimensions,
  });
  console.log(tickLabelPositions);

  return (
    <>
      <CoordinateGrid target={target} points={gridPointPositions} />
      {axisPositions.xAxis && (
        <XAxis {...axisPositions.xAxis} target={target} />
      )}
      {axisPositions.yAxis && (
        <YAxis {...axisPositions.yAxis} target={target} />
      )}
      {linePaths.map((linePathProps, index) => (
        <LinePath {...linePathProps} target={target} key={index} />
      ))}
      {tickLabelPositions.xAxis && (
        <XTickLabels
          target={target}
          tickLabelPositions={tickLabelPositions.xAxis}
        />
      )}
      {tickLabelPositions.yAxis && (
        <YTickLabels
          target={target}
          tickLabelPositions={tickLabelPositions.yAxis}
        />
      )}
    </>
  );
}
