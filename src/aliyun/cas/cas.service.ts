// 外部依赖
import { Injectable } from '@nestjs/common';
// 内部依赖
import { AliyunRpcConfig, ApiService } from '..';

@Injectable()
export class CasService {
  constructor(private readonly apiSrv: ApiService) {}

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

  async certList(KeyId: number, CurrentPage: number, ShowSize: number) {
    const config: AliyunRpcConfig = {
      id: KeyId,
      method: 'POST',
      endpoint: 'https://cas.aliyuncs.com',
      action: 'DescribeUserCertificateList',
      version: '2018-07-13',
      params: { CurrentPage, ShowSize },
    };
    const result = await this.apiSrv.rpc(config);
    return result;
  }

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

  async create(KeyId: number, InstanceId: string, Domain: string) {
    const config: AliyunRpcConfig = {
      id: KeyId,
      method: 'POST',
      endpoint: 'https://cas.aliyuncs.com',
      action: 'CreateDVOrderAudit',
      version: '2018-07-13',
      params: {
        InstanceId,
        Domain,
        City: 'zhengzhou',
        DomainVerifyType: 'DNS',
        Email: 'marbleqi@163.com',
        Mobile: '13673618697',
        Province: 'henan',
        Username: '戚晓栋',
      },
    };
    const result = await this.apiSrv.rpc(config);
    return result;
  }
}
