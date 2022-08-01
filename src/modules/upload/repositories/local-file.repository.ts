import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { File } from "../classes/file";
import { FileDocument, MongooseFile } from "../schemas/file.schema";

export class LocalFileRepository {

  @InjectModel(MongooseFile.name)
  private model: Model<FileDocument>;

  findByFilename(filename: string) {
    return this.model.findOne({ filename }, { lean: true })
                     .then(LocalFileRepository.transform);
  }

  create(file: File) {
    return this.model.create(file)
                     .then(LocalFileRepository.transform);
  }

  static transform(doc: FileDocument) {
    return plainToInstance(File, doc, { excludeExtraneousValues: true });
  }

}
