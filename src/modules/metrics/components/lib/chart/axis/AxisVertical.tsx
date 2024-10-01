import { FC } from 'react';

import AxisImplProps from './AxisImplProps';

const AxisVertical: FC<AxisImplProps> = ({ dimensions, label, scale, formatTick, ...props }) => {
  const numberOfTicks = dimensions.boundedHeight / 70;

  const ticks = scale.ticks(numberOfTicks);

  return (
    <g className="Axis AxisVertical" {...props}>
      <line className="Axis__line" y2={dimensions.boundedHeight} />

      {ticks.map((tick, i) => (
        <g key={tick} transform={`translate(-16, ${scale(tick)})`}>
          <text className="Axis__tick">{formatTick(tick)}</text>
          <line className="Axis__line" x1={5} x2={16} />
        </g>
      ))}

      {label && (
        <text
          className="Axis__label"
          style={{
            transform: `translate(-56px, ${dimensions.boundedHeight / 2}px) rotate(-90deg)`,
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default AxisVertical;
