import {Machine, interpret, assign} from 'xstate'

const increment = context => context.count + 1
const decrement = context => context.count - 1
const isNotMax = context => context.count < 10
const isNotMin = context => context.count >= 0

const counterMachine = Machine({
  initial: 'active',
  context: {
    count: 0
  },
  states: {
    active: {
      on: {
        INCREMENT: {
          actions: assign({
            count: increment
          }),
          cond: isNotMax
        },
        DECREMENT: {
          actions: assign({
            count: decrement
          }),
          cond: isNotMin
        }
      }
    }
  }
})

const counterService = interpret(counterMachine)
  .onTransition(state => {
    /*********************************/
    // side effects
    /*********************************/
    // update count
    const h2 = document.querySelector('h2')
    h2.innerHTML = state.context.count

    if (state.context.count > 9) {
      debugger
    }

    // update action
    const span = document.querySelector('span')
    span.innerHTML =
      state.transitions[
        state.transitions.length - 1
      ] &&
      state.transitions[
        state.transitions.length - 1
      ].event
  })
  .start()

export function updateDOM() {
  const decrementBtn = document.querySelector(
    '.decrement'
  )
  const incrementBtn = document.querySelector(
    '.increment'
  )

  decrementBtn.addEventListener('click', () => {
    counterService.send('DECREMENT')
  })
  incrementBtn.addEventListener('click', () => {
    counterService.send('INCREMENT')
  })
}
