import { MemoryManager } from '../../memory/memoryManager'
import { Experience } from '../../memory/experience'

describe('Memory Storage', () => {
  let memoryManager: MemoryManager

  beforeEach(async () => {
    memoryManager = new MemoryManager()
  })

  test('should store and retrieve experience', async () => {
    const experience = new Experience(
      'test-experience',
      Date.now(),
      'Test Task',
      'Test Goal',
      'Test Result',
      'Test Code Diff',
      'Test Failure Reason',
      ['test'],
      0.8,
      [1, 2, 3]
    )

    await memoryManager.storeExperience(experience)
    const retrieved = await memoryManager.searchExperiences([1, 2, 3])

    expect(retrieved).toContain(experience)
  })
})
