/**联系方式 */
export interface Contact {
  /**城市，建议用拼音格式 */
  City: string;
  /**授权验证方式 */
  DomainVerifyType: 'DNS' | 'FILE';
  /**电子邮箱 */
  Email: string;
  /**手机号 */
  Mobile: string;
  /**省 */
  Province: string;
  /**姓名 */
  Username: string;
}
