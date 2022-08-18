import { ScanTrigger } from "@modules/scan/enums/scan-trigger.enum";

export const ScanPriceJobName = 'ScanPricesJob'


export interface ScanPricesPayload {
  productId: string;
  scanId: string;
  providersToScan: string[]; // slugs
  mock: boolean;
  trigger: ScanTrigger
}

