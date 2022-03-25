// ❗ You don't need to add extra action creators to achieve MVP
import axios from 'axios'
import {
  MOVE_CLOCKWISE,
  MOVE_COUNTERCLOCKWISE,
  SET_SELECTED_ANSWER,
  SET_INFO_MESSAGE,
  SET_QUIZ_INTO_STATE,
  INPUT_CHANGE,
  RESET_FORM
} from './action-types';

export const moveClockwise = () => {
  return { type: MOVE_CLOCKWISE }
}

export const moveCounterClockwise = () => {
  return { type: MOVE_COUNTERCLOCKWISE }
}

export const selectAnswer = (answer_id) => {
  return { type: SET_SELECTED_ANSWER, payload: answer_id }
}

export const setMessage = (message) => {
  return { type: SET_INFO_MESSAGE, payload: message }
}

export const setQuiz = (question) => {
  return { type: SET_QUIZ_INTO_STATE, payload: question }
}

export function inputChange(value) {
  return ({ type: INPUT_CHANGE, payload: value})
   }

export const resetForm = () => {
  return { type: RESET_FORM }
}

// ❗ Async action creators
export function fetchQuiz() {
  return function (dispatch) {
    // First, dispatch an action to reset the quiz state (so the "Loading next quiz..." message can display)
    // On successful GET:
    // - Dispatch an action to send the obtained quiz to its state
    axios.get('http://localhost:9000/api/quiz/next')
      .then(res => {
        dispatch(setQuiz(res.data))
      })
      .catch(err => {
        console.error(err)
      })
  }
}
export function postAnswer({ quiz_id, answer_id }) {
  return function (dispatch) {
    // On successful POST:
    // - Dispatch an action to reset the selected answer state
    // - Dispatch an action to set the server message to state
    // - Dispatch the fetching of the next quiz

    axios.post('http://localhost:9000/api/quiz/answer', { quiz_id, answer_id })
      .then(res => {
        dispatch(selectAnswer(null))
        dispatch(setQuiz(null))
        dispatch(setMessage(res.data.message))
        dispatch(fetchQuiz())
      })
      .catch(err => {
        console.error(err)
      })
  }
}
export function postQuiz({ question_text, true_answer_text, false_answer_text }) {
  return function (dispatch) {
    axios.post('http://localhost:9000/api/quiz/new', { question_text, true_answer_text, false_answer_text })
    .then(res => {
      dispatch(setMessage(`Congrats: "${res.data.question}" is a great question!`))
      dispatch(resetForm())
    })
    .catch(err => {
      console.error(err)
    })
  }
}
// ❗ On promise rejections, use log statements or breakpoints, and put an appropriate error message in state
