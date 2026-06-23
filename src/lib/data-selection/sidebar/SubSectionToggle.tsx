import Box from '@mui/material/Box';
import Collapse, { CollapseProps } from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useAtomCallback } from 'jotai/utils';
import { FC, Fragment, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import {
  useHierarchicalVisibilityState,
  VisibilityStateContext,
} from '@/lib/data-selection/sidebar/context';
import { StateWatcher } from '@/lib/jotai/StateWatcher';
import type { JotaiStateFamily } from '@/lib/jotai/types';
import { useSetAtomFamily } from '@/lib/jotai/use-set-atom-family';
import { usePath } from '@/lib/paths/context';
import { SubPath } from '@/lib/paths/SubPath';
import { makeChildPath } from '@/lib/paths/utils';

export type SubSectionDefinition = {
  subPath: string;
  label: ReactNode;
  content: ReactNode;
};

export const SubSectionToggle: FC<{
  sections: SubSectionDefinition[];
}> = ({ sections }) => {
  const sectionIds = useMemo(() => sections.map((section) => section.subPath), [sections]);

  const path = usePath();

  const visibilityToggleAtomFamily = useContext(VisibilityStateContext)!;
  const { getPathVisible, setPathVisible } = usePathVisibleFns(visibilityToggleAtomFamily);

  const [selectedSection, setSelectedSection] = useState<string>();

  function handleSelectedSection(selected: string | undefined) {
    for (const subsection of sectionIds) {
      setPathVisible(makeChildPath(path, subsection), subsection === selected);
    }
    setSelectedSection(selected);
  }

  function handleParentVisibilityChange(visible: boolean) {
    // when showing the whole section (for the first, and subsequent times)
    if (visible) {
      for (const subsection of sectionIds) {
        if (getPathVisible(makeChildPath(path, subsection))) {
          handleSelectedSection(subsection);
          return;
        }
      }
      handleSelectedSection(sectionIds[0]);
    } else {
      // when hiding the whole section, do nothing
    }
  }

  function handleChildVisibilityChange(child: string, visible: boolean) {
    if (visible) {
      handleSelectedSection(child);
    } else {
      const allHidden = sections.every(
        (section) => !getPathVisible(makeChildPath(path, section.subPath)),
      );
      if (allHidden) {
        // if all children are hidden, set parent to hidden
        setPathVisible(path, false);

        // clear selected section
        handleSelectedSection(undefined);
      }
    }
  }

  return (
    <>
      <Stack spacing={3}>
        <SubSectionToggleButtonGroup
          sections={sections}
          selectedSection={selectedSection}
          onSelectedSection={handleSelectedSection}
        />
        <Box>
          {sections.map(({ subPath, content }) => (
            <Fragment key={subPath}>
              <SubSection subPath={subPath}>{content}</SubSection>
              <StateWatcher
                state={visibilityToggleAtomFamily(makeChildPath(path, subPath))}
                onValue={(value) => handleChildVisibilityChange(subPath, value)}
              />
            </Fragment>
          ))}
        </Box>
      </Stack>
      <StateWatcher
        state={visibilityToggleAtomFamily(path)}
        onValue={handleParentVisibilityChange}
      />
    </>
  );
};

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

function usePathVisibleFns(visibilityToggleAtomFamily: JotaiStateFamily<boolean, string>) {
  const setPathVisible = useSetAtomFamily(visibilityToggleAtomFamily);

  const getPathVisible = useAtomCallback(
    useCallback(
      (get, _set, targetPath: string) => {
        return get(visibilityToggleAtomFamily(targetPath));
      },
      [visibilityToggleAtomFamily],
    ),
  );

  return { getPathVisible, setPathVisible };
}

function SubSectionToggleButtonGroup({
  selectedSection,
  onSelectedSection,
  sections,
}: {
  sections: SubSectionDefinition[];
  selectedSection: string | undefined;
  onSelectedSection: (sectionId: string | undefined) => void;
}) {
  return (
    <ToggleButtonGroup
      exclusive
      value={selectedSection}
      onChange={(e, sectionId) => {
        if (sectionId) {
          onSelectedSection(sectionId);
        }
      }}
      fullWidth
    >
      {sections.map((section) => (
        <ToggleButton key={section.subPath} value={section.subPath} sx={{ textTransform: 'none' }}>
          {section.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
