// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectQueue, Processor, OnGlobalQueueWaiting } from '@nestjs/bull';
import { Queue, Job, JobOptions } from 'bull';
import { Subject } from 'rxjs';
// 内部依赖
import { Message, Condition } from '..';

/**队列服务 */
@Injectable()
@Processor('shared')
export class QueueService {
  /**前端消息订阅主体 */
  webSub: Subject<Message>;
  /**后端消息订阅主体 */
  apiSub: Subject<Message>;

  /**
   * 构造函数
   * @param queue 队列对象
   */
  constructor(@InjectQueue('shared') private readonly queue: Queue) {
    this.webSub = new Subject<Message>();
    this.apiSub = new Subject<Message>();
  }

  /**
   * 创建任务
   * @param name 任务名称
   * @param data 任务数据
   */
  async add(name: string, data: any, opts?: JobOptions): Promise<void> {
    if (opts) {
      await this.queue.add(name, data, opts);
    } else {
      await this.queue.add(name, data);
    }
  }

  /**
   * 获取任务清单
   * @param condition 任务过滤条件
   * @returns 响应报文
   */
  async index(condition: Condition) {
    /**任务列表 */
    const jobs: Job<any>[] = await this.queue.getJobs(
      condition.types,
      condition.start,
      condition.end,
      condition.asc,
    );
    /**返回必要字段 */
    return jobs.map((job: Job<any>) => ({
      id: job.id,
      name: job.name,
      data: job.data,
      timestamp: job.timestamp,
    }));
  }

  /**
   * 删除任务
   * @param id 任务Id
   * @returns 响应报文
   */
  async remove(id: number) {
    const job = await this.queue.getJob(id);
    await job.remove();
    return 1;
  }

  /**
   * 清理任务
   * @returns 响应报文
   */
  async clean() {
    await this.queue.clean(1000, 'completed');
    await this.queue.clean(1000, 'wait');
    await this.queue.clean(1000, 'active');
    await this.queue.clean(1000, 'delayed');
    await this.queue.clean(1000, 'failed');
    await this.queue.clean(1000, 'paused');
    return 1;
  }

  /**
   * 收到任务等待通知，即所有副本都收到通知
   * @param id 任务Id
   */
  @OnGlobalQueueWaiting()
  async waiting(id: number): Promise<void> {
    /**获取指定任务 */
    const job = await this.queue.getJob(id);
    /**任务消息 */
    const message = { name: job.name, data: job.data } as Message;
    if (['auth/menu', 'auth/category', 'sort'].includes(message.name)) {
      // 菜单或排序类变更直接通知所有前端
      this.webSub.next(message);
    } else {
      // 其余变更通知所有后端
      this.apiSub.next(message);
    }
  }
}
