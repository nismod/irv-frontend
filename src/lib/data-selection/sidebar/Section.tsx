import { Stack } from '@mui/material';
import { FC } from 'react';

import { usePath } from '@/lib/paths/paths';
import { SubPath } from '@/lib/paths/sub-path';

import { Accordion, AccordionDetails, AccordionSummary, AccordionTitle } from './accordion';
import { useExpandedState, useVisibilityState } from './context';
import { VisibilityToggle } from './VisibilityToggle';

interface SectionProps {
  title: string;
}
export const Section: FC<{ path: string } & SectionProps> = ({ path, ...otherProps }) => {
  return (
    <SubPath path={path}>
      <SectionImpl {...otherProps} />
    </SubPath>
  );
};

const SectionImpl: FC<SectionProps> = ({ title, children }) => {
  const path = usePath();
  const [visible, setVisible] = useVisibilityState(path);
  const [expanded, setExpanded] = useExpandedState(path);

  return (
    <Accordion
      expanded={expanded}
      onChange={(e, expanded) => setExpanded(expanded)}
      disableGutters
      sx={{
        bgcolor: '#fafafa',
        paddingLeft: '0px',
      }}
    >
      <AccordionSummary
        sx={(theme) => ({
          '& + .MuiCollapse-root': {
            borderLeft: '4px solid #fafafa',
          },
          '&:hover + .MuiCollapse-root': {
            borderLeftColor: theme.palette.primary.main,
          },
        })}
      >
        <AccordionTitle
          title={title}
          actions={
            <VisibilityToggle
              visibility={visible}
              onVisibility={(visible) => {
                setVisible(visible);
                setExpanded(visible);
              }}
            />
          }
        />
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0.5em', paddingRight: 0 }}>
        <Stack spacing={0.5}>{children}</Stack>
      </AccordionDetails>
    </Accordion>
  );
};
