/**阿里云ROA请求参数 */
export interface AliyunRoaConfig {
  /**密钥ID */
  id: number;
  /**请求方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /**API名称 */
  action?: string;
  /**API版本 */
  version: string;
  /**接口地域 */
  regionId?: string;
  /**服务地址 */
  host?: string;
  /**资源地址 */
  url: string;
  /**请求参数 */
  query?: object;
  /**请求报文体 */
  body?: any;
}

/**阿里云RPC请求参数 */
export interface AliyunRpcConfig {
  /**密钥ID */
  id: number;
  /**请求方法 */
  method: 'GET' | 'POST';
  /**服务地址 */
  endpoint: string;
  /**API名称 */
  action: string;
  /**API版本 */
  version: string;
  /**请求参数 */
  params?: object;
}
