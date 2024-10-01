import { Box, Stack } from '@mui/system';
import * as d3 from 'd3-color';
import { FC } from 'react';

export const MapLegend: FC<{
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  colorScale: any;
  domainY: any;
  label: string;
}> = ({ top = 0, right = 0, bottom = 0, left = 0, colorScale, domainY, label }) => {
  if (!colorScale || !domainY || !label) {
    return <></>;
  }
  const colorString1 = colorScale(domainY[0]);
  const colorString2 = colorScale((domainY[0] + domainY[1]) / 2);
  const colorString3 = colorScale(domainY[1]);
  const colorObject = d3.color(colorString1).rgb();
  const colorObject2 = d3.color(colorString2).rgb();
  const colorObject3 = d3.color(colorString3).rgb();

  if (!colorObject) {
    return <></>;
  }
  // const rgbColor = [colorObject.r, colorObject.g, colorObject.b, 200];
  const aValue = 200 / 255;

  return (
    <Box
      position="absolute"
      {...{ right, bottom, left }}
      zIndex={1000}
      sx={{ pointerEvents: 'none' }}
    >
      <Stack
        direction={'column'}
        alignItems={'center'}
        sx={{
          pointerEvents: 'none',
          backgroundColor: 'white',
          width: 220,
          height: 60,
          opacity: 0.9,
          paddingTop: '5px',
        }}
      >
        <b>{label}</b>

        <svg className="Chart" width={170} height={60}>
          <linearGradient id="Gradient1">
            <stop
              offset="0%"
              stopColor={`rgba(${colorObject.r}, ${colorObject.g}, ${colorObject.b}, ${aValue})`}
            />
            <stop
              offset="50%"
              stopColor={`rgba(${colorObject2.r}, ${colorObject2.g}, ${colorObject2.b}, ${aValue})`}
            />
            <stop
              offset="100%"
              stopColor={`rgba(${colorObject3.r}, ${colorObject3.g}, ${colorObject3.b}, ${aValue})`}
            />
          </linearGradient>

          <g transform="translate(20, 5)">
            <rect x={0} y={0} fill="url(#Gradient1)" width={120} height={15} />

            <line x1={0} y1={15.5} x2={120} y2={15.5} stroke="black" />
            <line x1={0} y1={0} x2={0} y2={16} stroke="black" />
            <line x1={120} y1={0} x2={120} y2={16} stroke="black" />

            <text x={0} y={27} textAnchor="middle">
              {domainY[0]}
            </text>

            <text x={120} y={27} textAnchor="middle">
              {domainY[1]}
            </text>
          </g>
        </svg>
      </Stack>
    </Box>
  );
};
