export type CompletedStep = {
  step_id: number
  completed_at?: string
}

export function completedStepOrders(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return []
  }

  return Array.from(
    new Set(
      value
        .map((step) => {
          if (!step || typeof step !== 'object' || !('step_id' in step)) {
            return null
          }
          const stepId = Number(step.step_id)
          return Number.isInteger(stepId) && stepId > 0 ? stepId : null
        })
        .filter((stepId): stepId is number => stepId !== null),
    ),
  )
}

export function setCompletedStepOrder(
  current: readonly number[],
  stepOrder: number,
  completed: boolean,
): number[] {
  const withoutStep = current.filter((order) => order !== stepOrder)
  return completed ? [...withoutStep, stepOrder] : withoutStep
}

export function activityStepOrders(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((step, index) => {
    if (step && typeof step === 'object' && 'order' in step) {
      const order = Number(step.order)
      if (Number.isInteger(order) && order > 0) {
        return order
      }
    }
    return index + 1
  })
}

type StepCompletionResult = {
  error?: string
  completedSteps?: number[]
}

export function createStepCompletionController(
  initial: readonly number[],
  mutate: (stepOrder: number, completed: boolean) => Promise<StepCompletionResult | undefined>,
  publish: (completedSteps: number[]) => void,
) {
  let current = [...initial]
  const confirmed = new Set(initial)
  const revisions = new Map<number, number>()
  const queues = new Map<number, Promise<void>>()

  const toggle = (stepOrder: number) => {
    const completed = !current.includes(stepOrder)
    const revision = (revisions.get(stepOrder) ?? 0) + 1
    revisions.set(stepOrder, revision)
    current = setCompletedStepOrder(current, stepOrder, completed)
    publish([...current])

    const queued = (queues.get(stepOrder) ?? Promise.resolve()).then(async () => {
      let result: StepCompletionResult | undefined
      try {
        result = await mutate(stepOrder, completed)
      } catch {
        result = { error: 'mutation_failed' }
      }
      if (!result?.error) {
        const persisted = result?.completedSteps
          ? result.completedSteps.includes(stepOrder)
          : completed
        if (persisted) confirmed.add(stepOrder)
        else confirmed.delete(stepOrder)
      }

      if (revisions.get(stepOrder) === revision) {
        current = setCompletedStepOrder(current, stepOrder, confirmed.has(stepOrder))
        publish([...current])
      }
    })

    queues.set(stepOrder, queued)
    return queued
  }

  return { toggle }
}
