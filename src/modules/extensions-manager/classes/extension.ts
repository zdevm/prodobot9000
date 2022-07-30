import { pick } from 'lodash';

export type ExtensionConstructInput = Extension; 

export class Extension {
  public name: string;
  public description: string;
  public filePath: string;
  public endpoint: string;
  public slug: string;

  public constructor(inp: ExtensionConstructInput) {
    this.validateConstructInputExtension(inp);
    Object.assign(this, pick(inp, 'name', 'description', 'filePath', 'endpoint', 'slug'));
    Object.freeze(this);
  }

  private validateConstructInputExtension(inp: ExtensionConstructInput) {
    if (!inp.name || !inp.filePath || !inp.endpoint || !inp.slug) {
      throw new Error('Invalid construct input!');
    }
  }

}