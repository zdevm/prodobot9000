export type RateProviderFormControlValueType = 'number' | 'string' | 'date';
export type RateProviderFormControlType = 'url';

export interface RateProviderFormControl {
  label: string;
  description?: string;
  name: string;
  default?: any;
  valueType: RateProviderFormControlValueType,
  controlType: RateProviderFormControlType
}

export interface RateProviderForm {
  name: string; // command's name
  label: string;
  description: string;
  controls: RateProviderFormControl[];
}

export interface RateProviderFormOptions {

  getProduct: RateProviderForm;

}

