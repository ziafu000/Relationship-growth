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
