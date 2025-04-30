import {
  Box,
  Collapse,
  CollapseProps,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRecoilCallback } from 'recoil';

import {
  useHierarchicalVisibilityState,
  VisibilityStateContext,
} from '@/lib/data-selection/sidebar/context';
import { usePath } from '@/lib/paths/context';
import { SubPath } from '@/lib/paths/SubPath';
import { useSetRecoilStateFamily } from '@/lib/recoil/use-set-recoil-state-family';

const PathVisibilityCollapse: FC<{
  children?: ReactNode;
  collapseProps?: Omit<CollapseProps, 'in'>;
}> = ({ children, collapseProps = {} }) => {
  const path = usePath();
  const [visible] = useHierarchicalVisibilityState(path);

  return (
    <Collapse in={visible} unmountOnExit={false} timeout={0} {...collapseProps}>
      {children}
    </Collapse>
  );
};

const SubSection: FC<{
  subPath: string;
  children: ReactNode;
}> = ({ subPath, children }) => {
  return (
    <SubPath path={subPath}>
      <PathVisibilityCollapse>{children}</PathVisibilityCollapse>
    </SubPath>
  );
};

function useSubSectionToggle(subsections: string[]) {
  const path = usePath();

  const visibilityToggleState = useContext(VisibilityStateContext);

  const isPathVisible = useRecoilCallback(
    ({ snapshot }) => {
      return (path: string) => {
        const loadable = snapshot.getLoadable(visibilityToggleState(path));

        if (loadable.state === 'hasValue') {
          return loadable.getValue();
        } else {
          console.log(`isPathVisible: ${path} is not loaded yet`);
          return false;
        }
      };
    },
    [visibilityToggleState],
  );

  const [subsection, setSubsection] = useState<string>();

  const setPathVisible = useSetRecoilStateFamily(visibilityToggleState);

  const handleSubsectionChange = useCallback(
    (newSubsection: string) => {
      for (const subsection of subsections) {
        setPathVisible(`${path}/${subsection}`, subsection === newSubsection);
      }
      setSubsection(newSubsection);
    },
    [path, setPathVisible, subsections],
  );

  useEffect(() => {
    console.log('subsection toggle visibility init');
    for (const subsection of subsections) {
      if (isPathVisible(`${path}/${subsection}`)) {
        handleSubsectionChange(subsection);
        return;
      }
    }
    handleSubsectionChange(subsections[0]);
  }, [subsections, path, isPathVisible, handleSubsectionChange]);

  return [subsection, handleSubsectionChange] as const;
}

export const SubSectionToggle: FC<{
  sections: {
    subPath: string;
    label: ReactNode;
    content: ReactNode;
  }[];
}> = ({ sections }) => {
  const sectionIds = useMemo(() => sections.map((section) => section.subPath), [sections]);

  const [source, setSource] = useSubSectionToggle(sectionIds);

  return (
    <Stack spacing={3}>
      <ToggleButtonGroup
        exclusive
        value={source}
        onChange={(e, model) => {
          if (model) {
            setSource(model);
          }
        }}
        fullWidth
      >
        {sections.map((section) => (
          <ToggleButton
            key={section.subPath}
            value={section.subPath}
            sx={{ textTransform: 'none' }}
          >
            {section.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Box>
        {sections.map((section) => (
          <SubSection key={section.subPath} subPath={section.subPath}>
            {section.content}
          </SubSection>
        ))}
      </Box>
    </Stack>
  );
};
