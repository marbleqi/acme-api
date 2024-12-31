import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as acme from 'acme-client';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  getHello(): string {
    return 'Hello World!';
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    console.debug('启动后初始化');
    const EMAIL = 'marbleqi@163.com'; // 你的邮箱
    const DOMAIN = 'marbleqi.top'; // 你的域名
    const ALT_NAMES = ['ms18.marbleqi.top']; // 备用域名
    const STAGING = true; // 是否使用 Let's Encrypt 测试环境
    // const CERT_DIR = path.join(__dirname, 'certs'); // 证书存储目录

    try {
      /**生成账户私钥 */
      const accountKey = await acme.crypto.createPrivateKey();
      console.debug('生成账户私钥', accountKey, accountKey.toString());
      console.debug('测试地址', acme.directory.letsencrypt.staging);
      console.debug('生产地址', acme.directory.letsencrypt.production);

      /**创建 ACME 客户端 */
      const client = new acme.Client({
        directoryUrl: STAGING
          ? acme.directory.letsencrypt.staging
          : acme.directory.letsencrypt.production,
        accountKey,
      });

      // 注册账户
      const account = await client.createAccount({
        termsOfServiceAgreed: true,
        contact: [`mailto:${EMAIL}`],
      });

      console.log('账户注册成功', account);

      // 创建 CSR（证书签名请求）
      const [key, csr] = await acme.crypto.createCsr({
        commonName: DOMAIN,
        altNames: ALT_NAMES,
      });

      console.log('CSR 创建成功');

      // 申请证书
      const cert = await client.auto({
        csr,
        email: EMAIL,
        termsOfServiceAgreed: true,
        challengePriority: ['dns-01'],
        challengeCreateFn: async (authz, challenge, keyAuthorization) => {
          console.debug('challenge.type', challenge.type);
          if (challenge.type === 'dns-01') {
            const dnsRecordValue =
              await client.getChallengeKeyAuthorization(challenge);
            console.log(`需要添加DNS主机名： ${authz.identifier.value}`);
            console.log(`需要添加DNS记录值： ${dnsRecordValue}`);
          }
        },
        challengeRemoveFn: async (authz, challenge, keyAuthorization) => {
          if (challenge.type === 'dns-01') {
            console.log(`删除DNS记录`);
          }
        },
      });

      console.log('证书申请成功');

      console.debug('证书：', cert);
      console.debug('私钥：', key);

      console.log('证书和私钥已保存');
    } catch (error) {
      console.error('发生错误:', error);
    }
  }
}
