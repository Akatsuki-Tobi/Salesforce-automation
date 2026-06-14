import { Workspace } from '../types'
import { Checkpoint } from './checkpoint'

class WorkflowManager {
  private checkpoints: Checkpoint[] = []
  private currentState: Workspace

  constructor(initialState: Workspace) {
    this.currentState = initialState
  }

  async saveCheckpoint(): Promise<void> {
    const checkpoint = new Checkpoint(this.currentState)
    this.checkpoints.push(checkpoint)
    await checkpoint.persist()
  }

  async restoreLastCheckpoint(): Promise<Workspace> {
    if (this.checkpoints.length === 0) return null
    return this.checkpoints[this.checkpoints.length - 1].getState()
  }
}
