// 外部依赖
import { Injectable } from '@nestjs/common';

// 内部依赖
import { AliyunRpcConfig, ApiService } from '..';

/**DNS服务 */
@Injectable()
export class DnsService {
  /**构造函数 */
  constructor(private readonly apiSrv: ApiService) {}

  /**获取DNS列表 */
  async list(KeyId: number, DomainName: string) {
    const config: AliyunRpcConfig = {
      id: KeyId,
      method: 'POST',
      endpoint: 'https://dns.aliyuncs.com',
      action: 'DescribeDomainRecords',
      version: '2015-01-09',
      params: { DomainName },
    };
    const result = await this.apiSrv.rpc(config);
    return result;
  }

  /**添加DNS记录 */
  async create(
    KeyId: number,
    DomainName: string,
    RR: string,
    Type:
      | 'A'
      | 'NS'
      | 'MX'
      | 'TXT'
      | 'CNAME'
      | 'SRV'
      | 'AAAA'
      | 'CAA'
      | 'REDIRECT_URL'
      | 'FORWARD_URL',
    Value: string,
  ) {
    const config: AliyunRpcConfig = {
      id: KeyId,
      method: 'POST',
      endpoint: 'https://dns.aliyuncs.com',
      action: 'AddDomainRecord',
      version: '2015-01-09',
      params: { DomainName, RR, Type, Value },
    };
    const result = await this.apiSrv.rpc(config);
    return result;
  }

  /**删除DNS记录 */
  async delete(KeyId: number, DomainName: string, RR: string) {
    const config: AliyunRpcConfig = {
      id: KeyId,
      method: 'POST',
      endpoint: 'https://dns.aliyuncs.com',
      action: 'DeleteSubDomainRecords',
      version: '2015-01-09',
      params: { DomainName, RR },
    };
    const result = await this.apiSrv.rpc(config);
    return result;
  }
}
