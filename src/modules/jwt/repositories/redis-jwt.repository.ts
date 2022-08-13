import { InjectRedis, Redis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { JwtRepository } from "./jwt.interface";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RedisJwtRepository implements JwtRepository {

  public constructor(@InjectRedis() private readonly redis: Redis) {}

  async store(data: Object, key?: string): Promise<string> {
    key = key ?? uuidv4();
    const result = await this.redis.set(this.prefixJwtNamespace(key), JSON.stringify(data));
    if (!result) {
      throw new Error('Failed to store data into redis repository.');
    }
    return key;
  }

  retrieve<T extends Object>(key: string): Promise<T | null> {
    return this.redis.get(this.prefixJwtNamespace(key)).then(res => {
      if (!res) {
        return res;
      }
      return JSON.parse(res);
    })
  }

  async delete(key: string): Promise<any> {
    const data = await this.retrieve(key)
    if (!data) {
      throw new Error('Specified key does not exist in redis repository');
    }
    const deletedCount = await this.redis.del(this.prefixJwtNamespace(key));
    if (!deletedCount) {
      throw new Error('Failed to delete specified key from redis repository');
    }
    return data;
  }

  private prefixJwtNamespace(key: string) {
    return ['jwt', key].join(':')
  }

}