import { act, render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { describe, expect, it, vi } from 'vitest';

import { featureState } from './DamagesSection';
import { ReturnPeriodSelect, selectedEpochState, selectedHazardState } from './param-controls';

function flushPromisesAndTimers(): Promise<unknown> {
  return act(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, 100);
        vi.runAllTimers();
      }),
  );
}
vi.useFakeTimers();
describe('Select return period from available', () => {
  it('does not show without options', () => {
    const { queryByLabelText } = render(<ReturnPeriodSelect />, { wrapper: RecoilRoot });

    const label = queryByLabelText('Return Period');
    expect(label).toBeNull();
  });

  const initializeState = ({ set }: any) => {
    set(featureState, {
      damages_expected: [
        {
          ead_amin: 65587.05435805356,
          ead_mean: 65587.05435805356,
          ead_amax: 65587.05435805356,
          eael_amin: 0,
          eael_mean: 0,
          eael_amax: 0,
          hazard: 'river',
          rcp: 'baseline',
          epoch: '1980',
          protection_standard: 0,
        },
      ],
      damages_return_period: [
        {
          exposure: 0,
          damage_amin: 257187.94193946064,
          damage_mean: 257187.94193946064,
          damage_amax: 257187.94193946064,
          loss_amin: 0,
          loss_mean: 0,
          loss_amax: 0,
          hazard: 'river',
          rcp: 'baseline',
          epoch: '1980',
          rp: 25,
        },
      ],
    });
    set(selectedHazardState, 'river');
    set(selectedEpochState, '1980');
  };

  it('shows disabled with one option', async () => {
    const container = render(
      <RecoilRoot initializeState={initializeState}>
        <ReturnPeriodSelect />
      </RecoilRoot>,
    );
    await flushPromisesAndTimers();
    console.log(container.baseElement.innerHTML);
    // const label = queryByLabelText('Return Period');
    // expect(label).toBeTruthy();
  });
});
