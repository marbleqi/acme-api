// 外部依赖
import { JobStatus } from 'bull';

/**队列消息 */
export interface Message {
  /**消息名称 */
  name: string;
  /**消息数据 */
  data: any;
}

/**Job搜索条件 */
export interface Condition {
  /**Job状态 */
  types: JobStatus[];
  /**开始时间 */
  start?: number;
  /**结束时间 */
  end?: number;
  /**升序排列 */
  asc?: boolean;
}
