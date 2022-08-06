export type RateProviderFormControlType = 'number' | 'string' | 'date';

export interface RateProviderFormControl {
  label: string;
  description?: string;
  name: string;
  default?: string;
  type: RateProviderFormControlType
}
export interface RateProviderFormOptions {

  getProduct: RateProviderFormControl;

}