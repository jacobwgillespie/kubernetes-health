import {EventEmitter} from 'events'

export type Status = 'Pending' | 'Live' | 'Ready' | 'NotReady' | 'Terminating'

export type Task = () => Promise<void>

export interface PendingTask {
  markComplete: () => void
}

/**
 * Options for the `Health` instance
 */
export interface Options {
  /**
   * Function called to forcibly terminate the current process
   *
   * @default () => process.exit(1)
   */
  forciblyTerminate: () => void

  /**
   * The amount of time to wait before starting to shut down. There is often a delay between when Kubernetes informs
   * the pod that it will be terminating and when all network requests to that pod have ceased, so this delay ensures
   * that in-flight requests are not rejected. Set to a number less than or equal to `0` to disable.
   *
   * @default 5
   */
  shutdownDelaySeconds: number

  /**
   * @default ['SIGTERM', 'SIGHUP', 'SIGINT']
   */
  shutdownSignals: NodeJS.Signals[]

  /**
   * The amount of time, in seconds, before the process is forcibly terminated after shutdown is initiated. Set to a
   * value less than or equal to `0` to disable.
   *
   * @default 30
   */
  terminationGracePeriodSeconds: number
}

/** Default values for Health options, if not specified */
export const defaultOptions: Options = Object.freeze({
  forciblyTerminate: () => process.exit(1),
  shutdownDelaySeconds: 5,
  shutdownSignals: ['SIGTERM', 'SIGHUP', 'SIGINT'],
  terminationGracePeriodSeconds: 30,
})

/**
 * The `Health` class represents the health status if an application. It manages transitions between application
 * state, and automatically registers shutdown handlers to that run when the process receives a shutdown signal.
 */
export class Health {
  #options: Options
  #events = new EventEmitter()

  #isReady = false
  #isTerminating = false

  #beforeLiveTasks: Task[] = []
  #beforeReadyTasks: Task[] = []
  #beforeTerminationTasks: Task[] = []
  #pendingTasks: PendingTask[] = []

  /**
   * `true` if the application is live, `false` otherwise
   */
  get isLive() {
    return !this.#isTerminating && this.#beforeLiveTasks.length === 0
  }

  /**
   * `true` if the application is ready, `false` otherwise
   */
  get isReady() {
    return this.#isReady && this.#beforeReadyTasks.length === 0
  }

  /**
   * The overall application status, transitions between the following status states:
   *
   * - `Pending`
   * - `Live`
   * - `Ready`
   * - `NotReady`
   * - `Terminating`
   */
  get status(): Status {
    if (this.#isTerminating) return 'Terminating'
    if (this.#beforeLiveTasks.length !== 0) return 'Pending'
    if (this.#beforeReadyTasks.length !== 0) return 'Live'
    if (this.#isReady) return 'Ready'
    return 'NotReady'
  }

  constructor(options: Partial<Options>) {
    this.#options = {...defaultOptions, ...options}

    for (const signal of this.#options.shutdownSignals) {
      process.on(signal, () => {
        this.shutdown()
      })
    }
  }

  /**
   * Add (register) a task that must complete before the application is considered live
   *
   * @param task the task to execute
   */
  beforeLive(task: Task) {
    this.#beforeLiveTasks.push(task)
    task().then(() => {
      this.#beforeLiveTasks.splice(this.#beforeLiveTasks.indexOf(task), 1)
    })
  }

  /**
   * Add (register) a task that must complete before the application is considered ready
   *
   * @param task the task to execute
   */
  beforeReady(task: Task) {
    this.#beforeReadyTasks.push(task)
    task().then(() => {
      this.#beforeReadyTasks.splice(this.#beforeReadyTasks.indexOf(task), 1)
    })
  }

  /**
   * Add (register) a task that must complete before the application terminates
   *
   * @param task the task to execute
   */
  beforeTermination(handler: Task) {
    this.#beforeTerminationTasks.push(handler)
  }

  /**
   * Create a new pending task that must be completed before the process terminates.
   *
   * @returns a `PendingTask` that can be marked as completed
   */
  createPendingTask(): PendingTask {
    let isComplete = false
    const task: PendingTask = Object.freeze({
      markComplete: () => {
        if (isComplete) return
        isComplete = true
        this.#pendingTasks.splice(this.#pendingTasks.indexOf(task), 1)
        this.#events.emit('taskComplete')
      },
    })
    this.#pendingTasks.push(task)
    return task
  }

  /**
   * Mark the health instance as ready
   */
  markReady() {
    if (this.#isTerminating) return
    this.#isReady = true
  }

  /**
   * Mark the health instance as not ready
   */
  markNotReady() {
    if (this.#isTerminating) return
    this.#isReady = false
  }

  /**
   * Signals that the process should shut down. Waits for any pending tasks and triggers all shutdown handlers.
   * If a `terminationGracePeriodSeconds` is defined, the process will be forcibly terminated after that amount
   * of time if it does not gracefully exit before then.
   */
  async shutdown() {
    if (this.#isTerminating) return
    this.#isTerminating = true

    if (this.#options.terminationGracePeriodSeconds > 0) {
      setTimeout(() => {
        this.#options.forciblyTerminate()
      }, this.#options.terminationGracePeriodSeconds * 1000).unref()
    }

    if (this.#options.shutdownDelaySeconds > 0) {
      await sleep(this.#options.shutdownDelaySeconds * 1000)
    }

    if (this.#pendingTasks.length > 0) {
      await new Promise<void>((resolve) => {
        const checkPendingTasks = () => {
          if (this.#pendingTasks.length === 0) {
            this.#events.off('taskComplete', checkPendingTasks)
            resolve()
          }
        }
        this.#events.on('taskComplete', checkPendingTasks)
        checkPendingTasks()
      })
    }

    await Promise.allSettled(this.#beforeTerminationTasks)

    setTimeout(() => {
      this.#options.forciblyTerminate()
    }, 1000).unref()
  }
}

/** Small utility to create a promise that resolves in the given number of milliseconds */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
