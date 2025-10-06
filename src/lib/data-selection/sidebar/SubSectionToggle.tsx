import Box from '@mui/material/Box';
import Collapse, { CollapseProps } from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FC, Fragment, ReactNode, useContext, useMemo, useState } from 'react';
import { useRecoilCallback } from 'recoil';

import {
  useHierarchicalVisibilityState,
  VisibilityStateContext,
} from '@/lib/data-selection/sidebar/context';
import { usePath } from '@/lib/paths/context';
import { SubPath } from '@/lib/paths/SubPath';
import { makeChildPath } from '@/lib/paths/utils';
import { StateWatcher } from '@/lib/recoil/StateWatcher';
import { RecoilStateFamily } from '@/lib/recoil/types';
import { useSetRecoilStateFamily } from '@/lib/recoil/use-set-recoil-state-family';

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

  const visibilityToggleState = useContext(VisibilityStateContext);
  const { getPathVisible, setPathVisible } = usePathVisibleFns(visibilityToggleState);

  const [selectedSection, setSelectedSection] = useState<string>();

  function handleSelectedSection(selected: string) {
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
      // pass
      handleSelectedSection(child);
    } else {
      // check if all children are hidden
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
                state={visibilityToggleState(makeChildPath(path, subPath))}
                onValue={(value) => handleChildVisibilityChange(subPath, value)}
              />
            </Fragment>
          ))}
        </Box>
      </Stack>
      <StateWatcher state={visibilityToggleState(path)} onValue={handleParentVisibilityChange} />
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

function usePathVisibleFns(visibilityToggleState: RecoilStateFamily<boolean, string>) {
  const setPathVisible = useSetRecoilStateFamily(visibilityToggleState);

  const getPathVisible = useRecoilCallback(
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
  return { getPathVisible, setPathVisible };
}

function SubSectionToggleButtonGroup({
  selectedSection,
  onSelectedSection,
  sections,
}: {
  sections: SubSectionDefinition[];
  selectedSection: string;
  onSelectedSection: (sectionId: string) => void;
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
