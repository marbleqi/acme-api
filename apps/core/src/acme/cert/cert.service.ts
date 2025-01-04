// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, directory, crypto } from 'acme-client';

// 内部依赖
import { CommonService, KeyService } from '@shared';
import { DnsService as AliService } from '@aliyun';
import { CertDto, CertEntity, CertLogEntity, AccountService } from '..';

@Injectable()
export class CertService extends CommonService<
  number,
  CertDto,
  CertDto,
  CertEntity,
  CertLogEntity
> {
  /**
   * 构造函数
   * @param certRepository 证书存储器
   * @param certLogRepository 证书日志存储器
   */
  constructor(
    @InjectRepository(CertEntity)
    public readonly certRepository: Repository<CertEntity>,
    @InjectRepository(CertLogEntity)
    private readonly certLogRepository: Repository<CertLogEntity>,
    private readonly keySrv: KeyService,
    private readonly accountSrv: AccountService,
    private readonly aliSrv: AliService,
  ) {
    super('id', 'cert', '证书', certRepository, certLogRepository);
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    console.debug('启动后初始化');
    // await this.sync();

    /**账户信息 */
    // const account = await this.accountSrv.show(1);
    // console.debug('账户信息', account);
    // /**DNS服务商 */
    // const provider = await this.keySrv.show(1);
    // console.debug('云服务商信息', provider);
    // // /**创建 ACME 客户端 */
    // const client = new Client({
    //   directoryUrl: account.config.staging
    //     ? directory.letsencrypt.staging
    //     : directory.letsencrypt.production,
    //   accountKey: account.accountKey,
    // });
    // console.debug('云服务商信息', client);
    // const url = client.getAccountUrl();
    // console.debug('账号URL', url);
    // const result = await client.createAccount({
    //   termsOfServiceAgreed: true,
    //   contact: [`mailto:${account.config.email}`],
    // });
    // console.debug('ACME账号注册成功', result);

    // const order = await client.createOrder({
    //   identifiers: [{ type: 'dns', value: '*.api.marbleqi.top' }],
    // });
    // console.debug('订单创建成功', order);

    // const authorizations = await client.getAuthorizations(order);
    // console.debug('授权信息', authorizations);

    // for (const authz of authorizations) {
    //   const challenge = authz.challenges.find((c) => c.type === 'dns-01');
    //   if (challenge) {
    //     const dnsRecordValue =
    //       await client.getChallengeKeyAuthorization(challenge);
    //     // const dnsRecordName = `_acme-challenge.${authz.identifier.value.replace(/\.?marbleqi\.top$/, '')}`;
    //     const dnsRecordName = `_acme-challenge.api`;
    //     console.debug('DNS记录', dnsRecordName, dnsRecordValue);
    //     // 添加 DNS 记录
    //     await this.aliSrv.create(
    //       1,
    //       'marbleqi.top',
    //       dnsRecordName,
    //       'TXT',
    //       dnsRecordValue,
    //     );
    //     console.debug('已添加DNS记录', dnsRecordName, dnsRecordValue);
    //     // 标记挑战为已完成
    //     await client.completeChallenge(challenge);
    //   }
    // }

    // for (const authz of authorizations) {
    //   await client.waitForValidStatus(authz);
    //   console.debug('授权验证成功', authz);
    // }

    // const [key, csr] = await crypto.createCsr({
    //   commonName: '*.api.marbleqi.top',
    // });

    // await client.finalizeOrder(order, csr);
    // console.debug('证书申请成功', order);

    // const certificate = await client.getCertificate(order);
    // console.debug('获取证书', certificate);
    // console.debug('证书私钥', key.toString());

    // for (const authz of authorizations) {
    //   const challenge = authz.challenges.find((c) => c.type === 'dns-01');
    //   if (challenge) {
    //     // const dnsRecordName = `_acme-challenge.${authz.identifier.value.replace(/\.?marbleqi\.top$/, '')}`;
    //     const dnsRecordName = `_acme-challenge.api`;

    //     // 删除 DNS 记录
    //     await this.aliSrv.delete(1, 'marbleqi.top', dnsRecordName);
    //     console.debug('删除 DNS 记录', dnsRecordName, '成功');
    //   }
    // }
  }
}
