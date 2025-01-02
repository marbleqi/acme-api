// 外部依赖
import { Injectable } from '@nestjs/common';

// 内部依赖
import { AliyunRpcConfig, Contact, ApiService } from '..';

/**证书服务 */
@Injectable()
export class CasService {
  /**构造函数 */
  constructor(private readonly apiSrv: ApiService) {}

  /**获取证书列表 */
  async list(
    KeyId: number,
    CurrentPage: number,
    ShowSize: number,
    params: { Keyword?: string; Status?: string } = {},
  ) {
    const config: AliyunRpcConfig = {
      id: KeyId,
      method: 'POST',
      endpoint: 'https://cas.aliyuncs.com',
      action: 'ListUserCertificateOrder',
      version: '2020-04-07',
      params: { CurrentPage, ShowSize, ...params },
    };
    const result = await this.apiSrv.rpc(config);
    return result;
  }

  /**获取证书详情 */
  async show(KeyId: number, OrderId: number) {
    const config: AliyunRpcConfig = {
      id: KeyId,
      method: 'POST',
      endpoint: 'https://cas.aliyuncs.com',
      action: 'DescribeCertificateState',
      version: '2020-04-07',
      params: { OrderId },
    };
    const result = await this.apiSrv.rpc(config);
    return result;
  }

  /**创建证书 */
  async create(
    KeyId: number,
    InstanceId: string,
    Domain: string,
    contact: Contact,
  ) {
    const config: AliyunRpcConfig = {
      id: KeyId,
      method: 'POST',
      endpoint: 'https://cas.aliyuncs.com',
      action: 'CreateDVOrderAudit',
      version: '2018-07-13',
      params: {
        ...contact,
        InstanceId,
        Domain,
      },
    };
    const result = await this.apiSrv.rpc(config);
    return result;
  }
}
