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
    await this.sync();

    /**账户信息 */
    const accountDB = await this.accountSrv.show(1);
    /**DNS服务商 */
    const provider = await this.keySrv.show(1);
    /**创建 ACME 客户端 */
    const client = new Client({
      directoryUrl: accountDB.config.staging
        ? directory.letsencrypt.staging
        : directory.letsencrypt.production,
      accountKey: accountDB.accountKey,
    });
    const account = await client.createAccount({
      termsOfServiceAgreed: true,
      contact: [`mailto:${accountDB.config.email}`],
    });
    console.log('账户注册成功', account);

    const order = await client.createOrder({
      identifiers: [{ type: 'dns', value: '*.marbleqi.top' }],
    });
    console.debug('order', order);

    const auths = await client.getAuthorizations(order);
    console.debug('auths', auths);
    for (const auth of auths) {
      const challenges = auth.challenges;
      console.debug('challenges', challenges);
      for (const challenge of challenges) {
        const dnsRecordValue =
          await client.getChallengeKeyAuthorization(challenge);
        console.debug('dnsRecordValue', challenge, dnsRecordValue);
      }
    }
  }

  /**
   * 申请证书
   * @param id 证书ID
   */
  async auto(id: number) {
    /**证书信息 */
    const current = await this.show(id);
    /**账户信息 */
    const account = await this.accountSrv.show(current.config.accountId);
    /**DNS服务商 */
    const provider = await this.keySrv.show(current.config.dns);
    /**创建 ACME 客户端 */
    const client = new Client({
      directoryUrl: account.config.staging
        ? directory.letsencrypt.staging
        : directory.letsencrypt.production,
      accountKey: account.accountKey,
    });

    const order = await client.createOrder({
      identifiers: [{ type: 'dns', value: '*.example.com' }],
    });

    // 创建 CSR（证书签名请求）
    const [key, csr] = await crypto.createCsr({
      commonName: current.config.domain,
      altNames: current.config.sans,
    });
    try {
      // 申请证书
      const cert = await client.auto({
        csr,
        email: account.config.email,
        termsOfServiceAgreed: true,
        challengePriority: ['dns-01'],
        challengeCreateFn: async (authz, challenge, keyAuthorization) => {
          console.debug('challenge.type', challenge.type);
          if (challenge.type === 'dns-01') {
            const dnsRecordValue =
              await client.getChallengeKeyAuthorization(challenge);
            const dnsRecordName = `_acme-challenge.${authz.identifier.value}`;
            console.log('create authz', authz);
            console.log('create challenge', challenge);
            console.log('create keyAuthorization', keyAuthorization);
            console.log(`需要添加DNS主机名： ${dnsRecordName}`);
            console.log(`需要添加DNS记录值： ${dnsRecordValue}`);
            if (provider.config.provider === 'aliyun') {
              // 增加DNS记录
              await this.aliSrv.create(
                provider.id,
                'marbleqi.top',
                dnsRecordName,
                'TXT',
                dnsRecordValue,
              );
            } else if (provider.config.provider === 'aws') {
            } else if (provider.config.provider === 'tencent') {
            }
          }
        },
        challengeRemoveFn: async (authz, challenge, keyAuthorization) => {
          if (challenge.type === 'dns-01') {
            const dnsRecordName = `_acme-challenge.${authz.identifier.value}`;
            console.log('delete authz', authz);
            console.log('delete challenge', challenge);
            console.log('delete keyAuthorization', keyAuthorization);
            console.log(`删除DNS记录：${dnsRecordName}`);
            if (provider.config.provider === 'aliyun') {
              //  await this.aliSrv.delete(
              //     provider.id,
              //     'marbleqi.top',
              //     dnsRecordName,
              //   );
            } else if (provider.config.provider === 'aws') {
            } else if (provider.config.provider === 'tencent') {
            }
          }
        },
      });
      console.log('证书申请成功');

      console.debug('证书：', cert);
      console.debug('私钥：', key.toString());
      await this.certRepository.update(id, { key: key.toString(), cert });
    } catch (error) {
      console.error('发生错误:', error);
    }
  }
}
