// 外部依赖
import {
  Injectable,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { createHmac } from 'crypto';
import { firstValueFrom } from 'rxjs';

// 内部依赖
import { random, KeyService } from '@shared';
import { AliyunRpcConfig } from '..';

// TODO：待功能验证

@Injectable()
export class DnsService {
  /**
   * 构造函数
   * @param http http服务
   * @param keySrv 密钥服务
   */
  constructor(
    private readonly http: HttpService,
    private readonly keySrv: KeyService,
  ) {}

  /**
   * 阿里云rpc接口调用
   * @param config 接口参数
   * @returns 返回接口调用结果
   */
  async rpc(config: AliyunRpcConfig) {
    /**密钥 */
    const key = await this.keySrv.show(config.id);
    if (!key) {
      throw new NotFoundException(`请求的密钥不存在`);
    }
    const AccessKeyId = key.config.key;
    const secret = key.config.secret;
    /**接口参数 */
    const params = config.params ? config.params : {};
    /**随机字符串 */
    const nonce = random(32);
    /**无签名的公共请求参数 */
    const opts = {
      Action: config.action,
      Version: config.version,
      Format: 'JSON',
      AccessKeyId,
      SignatureNonce: nonce,
      Timestamp: new Date().toISOString(),
      SignatureMethod: 'HMAC-SHA1',
      SignatureVersion: '1.0',
    };
    /**排序参数 */
    const sortParams = { ...opts, ...params };
    /**排序参数键 */
    const keys = Object.keys(sortParams).sort();
    /**编码后请求参数 */
    const query = keys
      .map(
        (key) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(sortParams[key]),
      )
      .join('&');
    /**规范化请求字符串 */
    const url = `${config.endpoint}?${query}`;
    /**待签名字符串 */
    const stringToSign = `${config.method}&${encodeURIComponent(
      '/',
    )}&${encodeURIComponent(query)}`;
    console.debug('待签名字符串', stringToSign);
    /**签名 */
    const Signature = createHmac('sha1', secret + '&')
      .update(stringToSign)
      .digest('base64');
    // console.debug('签名', Signature);
    if (config.method === 'GET') {
      const result = await firstValueFrom(
        this.http.get(`${url}&Signature=${encodeURIComponent(Signature)}`, {
          validateStatus: () => true,
        }),
      );
      if (result.status >= 200 && result.status < 300) {
        return result.data;
      } else {
        throw new HttpException(result.data.Message, result.status);
      }
    }
    if (config.method === 'POST') {
      const result = await firstValueFrom(
        this.http.post(
          `${url}&Signature=${encodeURIComponent(Signature)}`,
          params,
          {
            validateStatus: () => true,
          },
        ),
      );
      if (result.status >= 200 && result.status < 300) {
        return result.data;
      } else {
        throw new HttpException(result.data.Message, result.status);
      }
    }
    throw new BadRequestException(`请求方法错误`);
  }
}
