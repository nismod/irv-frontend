import _ from 'lodash';

/**
 * The mechanism of data params is responsible for handling the various parameters for choosing datasets to display.
 *
 * For example, a hazard layer such as coastal flooding, is parameterised by: epoch, RCP, return period.
 *
 * Data params are considered in groups (such as the epoch, RCP, rp group) where the values of params are potentially interrelated
 * (e.g. the current value of one param can determine the list of allowed values of another param)
 */

/** Type for a single data param's value. */
export type ParamValue = any;
/** List of acceptable values of a data param. */
export type ParamDomain<PT extends ParamValue = ParamValue> = PT[];

/** Dictionary of param values for a group of data params, keyed by param name. */
export type ParamGroup = Record<string, ParamValue>;

/** Dependency function, describing the relationship between the current values of a param group,
 * and the domain (list of allowed values) of a single param.
 */
export type ParamDependency<PT extends ParamValue, PGT extends ParamGroup> = (
  params: PGT,
) => ParamDomain<PT>;

/** Dictionary of param domains for a group of data params, keyed by param name. */
export type ParamGroupDomains<PGT extends ParamGroup = ParamGroup> = {
  [K in keyof PGT]: ParamDomain<PGT[K]>;
};

/** Dictionary of param dependency functions for a group of data params, keyed by param name.
 * Not all params from the group need a defined dependency function.
 */
export type ParamGroupDependencies<PGT extends ParamGroup = ParamGroup> = {
  [K in keyof PGT]?: ParamDependency<PGT[K], PGT>;
};

/** Configuration for a data param group. Defines the domains, default values, and dependencies between params. */
export interface DataParamGroupConfig<PGT extends ParamGroup = ParamGroup> {
  /** Domains for each param. Defines the full list of possible values for each param. */
  paramDomains: ParamGroupDomains<PGT>;
  /** Default values for each param */
  paramDefaults: PGT;
  /** Dependency functions for params (optional) */
  paramDependencies?: ParamGroupDependencies<PGT>;
}

/** Helper function to get a list of param options based on updated param group values and a dependency function,
 *  or the full param domain as a fallback
 **/
function getNewParamOptions(updatedParams, domain, dependencyFn) {
  return dependencyFn?.(updatedParams) ?? domain;
}

/** Update the values of a param group based on the configuration of the group.
 *
 * Updates the lists of allowed options for each param based on the dependency functions.
 * If any param value falls out of the list of currently allowed values, it is set to the first allowed value instead.
 *
 * @returns a tuple of [updated dictionary of param values, updated dictionary of lists of allowed param values]
 */
export function resolveParamDependencies<PGT extends ParamGroup = ParamGroup>(
  /** Current values of the param group after an update */
  updatedParams: PGT,
  /** Configuration of the param group */
  config: DataParamGroupConfig<PGT>,
): [PGT, ParamGroupDomains<PGT>] {
  type K = keyof PGT;
  const { paramDomains, paramDependencies = {} } = config;

  const resolvedParams = { ...updatedParams };
  const newOptions: ParamGroupDomains<PGT> = {} as any;

  for (const [param, paramValue] of Object.entries(updatedParams)) {
    const newParamOptions = getNewParamOptions(
      resolvedParams,
      paramDomains[param],
      paramDependencies[param],
    );

    // if the new options don't include the current param value, switch value to the first option
    if (!newParamOptions.includes(paramValue)) {
      resolvedParams[param as K] = newParamOptions[0];
    }

    newOptions[param as K] = newParamOptions;
  }
  return [resolvedParams, newOptions];
}

/**
 * Inferring domains / dependencies from data:
 * While the dependency function for a data param could be specified manually, the process is time-consuming an error prone.
 * Given some simpler manual configuration, the dependencies can be inferred if the list of all possible combinations of
 * param values is available.
 */

/** Specification for inferring dependencies.
 * For each param name, a list of param names is specified on which that param depends.
 **/
type DependenciesSpec<T extends object> = Record<keyof T, (keyof T)[]>;

/** One (or a list of) functions (iteratees) used to sort an array. See documentation of lodash.sortBy().
 *
 * Each iteratee, when given a value from the array to be sorted, should return a number which will be used as a representation of the given item for sorting purposes.
 *
 * For example, to sort an array containing both strings and numbers in a way where numbers should go first
 * and then, inside both groups, the items should be sorted according to the natural ordering for strings/numbers,
 * the following list of iteratees could be provided:
 *
 * [numbersFirst, _.identity]
 *
 * Where `numbersFirst` returns -1 when passed a numeric argument, and +1 for a non-numeric argument.
 **/
type SortIteratees<T> = _.Many<_.ListIteratee<T>>; // taken from lodash _.sortBy

/** Specification for sorting the lists of allowed options returned by the inferred dependency functions
 * This is useful because having the lists of options be already sorted removes the need to do that in UI code.
 */
type SortSpec<T extends object> = Partial<Record<keyof T, SortIteratees<any>>>;

/** Helper factory function which, given a list of grouping key names,
 * returns a function that will accept an object and generate a string representing the unique group
 * to which this object belongs, based on the values of the specified keys.
 * Values are joined with the `+` character to build the group key. */
function getGroupKey<T>(
  /** List of key names for the grouping */
  keys: (keyof T)[],
) {
  return (obj: T) => keys.map((k) => obj[k]).join('+');
}

/**
 * Group a collection by multiple properties
 * @param data the collection to group
 * @param properties list of string names of the properties
 * @returns dictionary of arrays, keyed by a generated group key
 */
function groupByMulti<T>(data: T[], properties: (keyof T)[]) {
  return _.groupBy(data, getGroupKey(properties));
}

/** Helper function to build a dependency function for one data param.
 *
 */
function makeDependencyFunction<T extends object>(
  /** List of all possible param group value combinations */
  data: T[],
  /** Name of the param for which the dependency function is created */
  param: keyof T,
  /** List of other params on which this param should depend */
  dependencies: (keyof T)[],
  /** Specification of how to sort */
  sortByIteratees: SortIteratees<T[typeof param]> = _.identity,
) {
  // group the data objected by co-occurring values of the dependency fields
  const grouped = groupByMulti(data, dependencies);

  // for each combination of dependency values, get a sorted and unique list
  // of values of the dependent parameter
  const groupedDomains = _.mapValues(grouped, (objects) =>
    _(objects)
      .map((obj) => obj[param])
      .uniq()
      .sortBy(sortByIteratees)
      .value(),
  );

  // return a function that gets the possible options of the dependent parameter based on a current state of the params
  return (params: T) => groupedDomains[getGroupKey(dependencies)(params)];
}

/** Given a list of all possible combination of param group values, and a manual configuration,
 * infer the dependency functions for the param group.
 **/
export function inferDependenciesFromData<T extends object>(
  /** List of all value combinations */
  data: T[],
  /** Specification for the dependencies between params.
   * This needs to be set manually, because it's up to the user which param depends on which other params
   * - it cannot be decided from the data itself in a simple way.
   **/
  depSpec: DependenciesSpec<T>,
  /** Specification for sorting the option lists returned from the inferred dependency functions */
  sortSpec?: SortSpec<T>,
): ParamGroupDependencies<T> {
  const dependencies: ParamGroupDependencies<T> = {};
  for (const [param, inputs] of Object.entries(depSpec) as [keyof T, (keyof T)[]][]) {
    if (inputs.length > 0) {
      dependencies[param] = makeDependencyFunction(
        data,
        param as keyof T,
        inputs as (keyof T)[],
        sortSpec?.[param],
      );
    }
  }
  return dependencies;
}

/** Given a list of all possible combinations of param group values, infer the full domains for the param group */
export function inferDomainsFromData<T extends object>(
  /** List of all value combinations */
  data: T[],
): ParamGroupDomains<T> {
  const domains: any = {};
  const keys = Object.keys(data[0]);
  for (const key of keys) {
    const values = data.map((d) => d[key]);
    domains[key] = _.uniq(values);
  }
  return domains;
}
