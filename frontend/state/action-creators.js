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

export const selectAnswer = (id) => {
  return { type: SET_SELECTED_ANSWER, payload: id }
}

export const setMessage = (infoMessage) => {
  return { type: SET_INFO_MESSAGE, payload: infoMessage }
}

export const setQuiz = (question) => {
  return { type: SET_QUIZ_INTO_STATE, payload: question }
}

export const inputChange = (value) => {
  return { type: INPUT_CHANGE, payload: value }
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
        dispatch({ type: SET_QUIZ_INTO_STATE, payload: res.data })
      })
      .catch(err => {
        console.error(err)
      })
  }
}
export function postAnswer(quizId, answerId) {
  return function (dispatch) {
    // On successful POST:
    // - Dispatch an action to reset the selected answer state
    // - Dispatch an action to set the server message to state
    // - Dispatch the fetching of the next quiz
    dispatch({ type: SET_SELECTED_ANSWER, payload: null })

    axios.post('http://localhost:9000/api/quiz/answer', { quizId, answerId })
      .then(res => {
        dispatch({ type: SET_INFO_MESSAGE, payload: res.data })
        dispatch(fetchQuiz())
      })
      .catch(err => {
        console.error(err)
      })
  }
}
export function postQuiz(form) {
  return function (dispatch) {
    axios.post('http://localhost:9000/api/quiz/new', {question_text: form.newQuestion, true_answer_text: form.newTrueAnswer, false_answer_text: form.newFalseAnswer})
    .then(res => {
      dispatch({ type: SET_INFO_MESSAGE, payload: {message: `Congrats: "${res.data.question}" is a great question!`}})
    })
    .catch(err => {
      console.error(err)
    })
  }
}
// ❗ On promise rejections, use log statements or breakpoints, and put an appropriate error message in state
