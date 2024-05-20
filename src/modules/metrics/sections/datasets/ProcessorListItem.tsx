import { Boundary, Processor } from '@nismod/irv-autopkg-client';

import { ProcessorVersionListItem } from './ProcessorVersionListItem';

export const ProcessorListItem = ({
  processor,
  boundary,
}: {
  processor: Processor;
  boundary: Boundary;
}) => {
  return (
    <>
      {processor.versions.map((v) => (
        <ProcessorVersionListItem key={v.version} processorVersion={v} boundary={boundary} />
      ))}
    </>
  );
};
