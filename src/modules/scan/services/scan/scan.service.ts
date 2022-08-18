import { Scan } from '@modules/scan/classes/scan';
import { ScanRepository } from '@modules/scan/repositories/scan.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScanService {

  public constructor(private readonly scanRepository: ScanRepository) {}

  create(productId: string, dto: Pick<Scan, 'providersToScan' | 'trigger'>) {
    return this.scanRepository.create(productId, dto);
  }

  findById(id: string) {
    return this.scanRepository.findById(id);
  }

  updateById(id: string, dto: Partial<Scan>) {
    return this.scanRepository.updateById(id, dto);
  }

}
