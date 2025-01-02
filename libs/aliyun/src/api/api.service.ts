// 外部依赖
import {
  Injectable,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { createHmac } from 'crypto';
import { formatRFC7231 } from 'date-fns';
import { firstValueFrom } from 'rxjs';

// 内部依赖
import { KeyService } from '@shared';
import { AliyunRoaConfig, AliyunRpcConfig } from '..';

/**阿里云API封装 */
@Injectable()
export class ApiService {
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
   * 生成指定长度的随机字符串
   * @param length 随机字符串长度
   * @param type 随机字符串类型，默认字符串型
   * @returns 指定长度的随机字符串
   */
  private random(length: number, type: 'string' | 'number' = 'string'): string {
    /**随机字符串游标 */
    let i = 0;
    /**可选字符集 */
    const chars =
      type === 'string'
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
        : '1234567890';
    /**字符集长度 */
    const maxPos = chars.length;
    /**随机字符串 */
    let result: string = '';
    while (i < length) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
      i++;
    }
    return result;
  }

  /**
   * 阿里云roa接口调用
   * @param config 接口参数
   * @returns 返回接口调用结果
   */
  async roa(config: AliyunRoaConfig) {
    /**服务地址 */
    const host = config.host ? config.host : 'cloudcontrol.aliyuncs.com';
    /**请求参数 */
    const query = config.query ? config.query : {};
    /**请求数据 */
    const body = config.body ? config.body : {};
    /**随机字符串 */
    const nonce = this.random(32);
    /**基础消息头 */
    const headers: any = {
      'x-acs-version': config.version,
      accept: 'application/json',
      date: formatRFC7231(Date.now()),
      'x-acs-signature-method': 'HMAC-SHA1',
      'x-acs-signature-nonce': nonce,
      'content-type': '',
      host,
    };
    if (config.action) {
      headers['x-acs-action'] = config.action;
    }
    if (config.regionId) {
      headers['x-acs-region-id'] = config.regionId;
    }
    console.debug('headers', headers);
    /**
     * 构造规范化请求头
     * @returns 规范后请求头
     */
    const getCanonicalizedHeaders = () => {
      /**如果一个公共请求头的值过长，则需要处理其中的\t、\n、\r、\f分隔符，将其替换成英文半角的空格 */
      const filter = (value: string) => {
        return value.replace(/[\t\n\r\f]/g, ' ');
      };
      const prefix = 'x-acs-';
      const keys = Object.keys(headers);
      const canonicalizedKeys = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.startsWith(prefix)) {
          canonicalizedKeys.push(key);
        }
      }
      canonicalizedKeys.sort();
      let result = '';
      for (let i = 0; i < canonicalizedKeys.length; i++) {
        const key = canonicalizedKeys[i];
        result += `${key}:${filter(headers[key]).trim()}\n`;
      }
      return result;
    };
    /**
     * 构造规范化请求字符串
     * @returns 规范后请求字符串
     */
    const getCanonicalizedResource = () => {
      /**将请求参数键进行排序 */
      const keys = Object.keys(query).sort();
      if (keys.length === 0) {
        return config.url;
      }
      const result = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        result.push(`${key}=${query[key]}`);
      }
      return `${config.url}?${result.join('&')}`;
    };
    /**规范化请求头 */
    const canonicalizedHeaders = getCanonicalizedHeaders();
    /**规范化请求字符串 */
    const canonicalizedResource = getCanonicalizedResource();
    /**待签名字符串 */
    const stringToSign = `${config.method}\n${headers.accept}\n\n${headers['content-type']}\n${headers.date}\n${canonicalizedHeaders}${canonicalizedResource}`;
    console.debug('stringToSign', stringToSign);
    /**密钥 */
    const key = await this.keySrv.show(config.id);
    if (!key) {
      throw new NotFoundException(`请求的密钥不存在`);
    }
    const accessKeyId = key.config.key;
    const accessKeySecret = key.config.secret;
    /**加密对象 */
    const Authorization = `acs ${accessKeyId}:${createHmac(
      'sha1',
      accessKeySecret,
    )
      .update(stringToSign)
      .digest('base64')}`;
    if (config.method === 'GET') {
      const result = await firstValueFrom(
        this.http.get(`https://${host}${config.url}`, {
          headers: {
            ...headers,
            Authorization,
          },
          params: query,
          validateStatus: () => true,
        }),
      );
      // console.debug('result', result);
      if (result.status >= 200 && result.status < 300) {
        return result.data;
      } else {
        throw new HttpException(result.data.Message, result.status);
      }
    }
    if (config.method === 'POST') {
      const result = await firstValueFrom(
        this.http.post(`https://${host}${config.url}`, body, {
          headers: {
            ...headers,
            Authorization,
          },
          params: query,
          validateStatus: () => true,
        }),
      );
      if (result.status >= 200 && result.status < 300) {
        return result.data;
      } else {
        throw new HttpException(result.data.Message, result.status);
      }
    }
    if (config.method === 'PUT') {
      const result = await firstValueFrom(
        this.http.put(`https://${host}${config.url}`, body, {
          headers: {
            ...headers,
            Authorization,
          },
          params: query,
          validateStatus: () => true,
        }),
      );
      // console.debug('result', result);
      if (result.status >= 200 && result.status < 300) {
        return result.data;
      } else {
        throw new HttpException(result.data.Message, result.status);
      }
    }
    if (config.method === 'DELETE') {
      const result = await firstValueFrom(
        this.http.delete(`https://${host}${config.url}`, {
          headers: {
            ...headers,
            Authorization,
          },
          params: query,
          validateStatus: () => true,
        }),
      );
      if (result.status >= 200 && result.status < 300) {
        return result.data;
      } else {
        throw new HttpException(result.data.Message, result.status);
      }
    }
    throw new BadRequestException(`请求方法错误`);
  }

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
    const nonce = this.random(32);
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
