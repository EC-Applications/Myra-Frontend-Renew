// filter.config.ts
export type FilterType = "checkbox" | "radio";

export interface FilterConfig<T> {
  key: string;
  label: string;
  type: FilterType;
  data: T[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
}
