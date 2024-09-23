import { FC } from 'react';

import AxisImplProps from './AxisImplProps';

const AxisHorizontal: FC<AxisImplProps> = ({ dimensions, label, scale, formatTick, ...props }) => {
  const numberOfTicks =
    dimensions.boundedWidth < 600 ? dimensions.boundedWidth / 100 : dimensions.boundedWidth / 250;

  const ticks = scale.ticks(numberOfTicks);

  return (
    <g
      className="Axis AxisHorizontal"
      transform={`translate(0, ${dimensions.boundedHeight})`}
      {...props}
    >
      <line className="Axis__line" x2={dimensions.boundedWidth} />

      {ticks.map((tick, i) => (
        <g key={tick} transform={`translate(${scale(tick)}, 25)`}>
          <text className="Axis__tick">{formatTick(tick)}</text>
          <line className="Axis__line" y1={-15} y2={-25} />
        </g>
      ))}

      {label && (
        <text className="Axis__label" transform={`translate(${dimensions.boundedWidth / 2}, 60)`}>
          {label}
        </text>
      )}
    </g>
  );
};

export default AxisHorizontal;
