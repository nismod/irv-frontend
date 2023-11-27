/** Interface for an object representing a generic-type value and an associated human-readable string label.
 * For use in UI components etc.
 **/
export interface ValueLabel<K extends string | number = string> {
  value: K;
  label: string;
}

/** Function with type guard, checking if the argument is a `ValueLabel` */
export function isValueLabel(value): value is ValueLabel {
  return typeof value === 'object' && 'value' in value && 'label' in value;
}

/** Function to get a `ValueLabel` object for the argument
 *
 *  If the argument is already a `ValueLabel`, returns it.
 *  Otherwise, creates a `ValueLabel` object with the argument as both value and label.
 */
export function getValueLabel(value: any): ValueLabel {
  if (isValueLabel(value)) {
    return value;
  }

  return {
    value: value,
    label: value,
  };
}
