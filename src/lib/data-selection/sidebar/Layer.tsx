import { ArrowRight } from '@mui/icons-material';
import { Icon, styled } from '@mui/material';
import { FC, Suspense } from 'react';

import { usePath } from '@/lib/paths/paths';
import { SubPath } from '@/lib/paths/sub-path';

import { VisibilityToggle } from './VisibilityToggle';
import { Accordion, AccordionDetails, AccordionSummary, AccordionTitle } from './accordion';
import { useExpandedState, useVisibilityState } from './context';

const CharacterIcon = styled(Icon)({
  lineHeight: 1,
});

interface LayerProps {
  title: string;
  disabled?: boolean;
  unmountOnHide?: boolean;
}
export const Layer: FC<{ path: string } & LayerProps> = ({ path, ...otherProps }) => {
  return (
    <SubPath path={path}>
      <Suspense fallback="Loading layer data...">
        <LayerImpl {...otherProps} />
      </Suspense>
    </SubPath>
  );
};

const LayerImpl: FC<LayerProps> = ({
  title,
  disabled = false,
  unmountOnHide = false,
  children,
}) => {
  const path = usePath();
  const [visible, setVisible] = useVisibilityState(path);
  const [expanded, setExpanded] = useExpandedState(path);

  const hasChildren = children != null;
  const allowExpand = visible && hasChildren;

  return (
    <Accordion
      disabled={disabled}
      expanded={allowExpand && expanded}
      onChange={(e, expanded) => allowExpand && setExpanded(expanded)}
      disableGutters
      sx={{
        border: '2px solid #eee',
      }}
      elevation={0}
      TransitionProps={{
        unmountOnExit: !visible && unmountOnHide,
      }}
    >
      <AccordionSummary
        // TODO: find a better way than adding !important to change cursor
        sx={{ cursor: allowExpand ? 'pointer' : 'default !important' }}
        // if layer has no children, display bullet Icon
        expandIcon={
          hasChildren ? (
            <ArrowRight color={allowExpand ? 'action' : 'disabled'} />
          ) : (
            <CharacterIcon color="disabled">•</CharacterIcon>
          )
        }
      >
        <AccordionTitle
          title={title}
          actions={
            disabled ? null : (
              <VisibilityToggle
                visibility={visible}
                onVisibility={(visible) => {
                  setVisible(visible);
                  hasChildren && setExpanded(visible);
                }}
              />
            )
          }
        />
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: 2,
          bgcolor: '#f5f5f5',
          border: '4px solid white',
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
  /*
    return (
      <ExpandablePanel
        disabled={disabled}
        title={title}
        expanded={expanded}
        onExpanded={setExpanded}
        allowExpand={visible && children != null}
        actions={
          <VisibilityToggle
            visibility={visible}
            onVisibility={(visible) => {
              setVisible(visible);
              setExpanded(visible);
            }}
          ></VisibilityToggle>
        }
      >
        {children}
      </ExpandablePanel>
    );
    */
};
