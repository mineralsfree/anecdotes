import {createContext, useReducer} from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION': {
      return action.payload
    }
    case 'REMOVE_NOTIFICATION': {
      return ''
    }
    default:
      return ''
  }
}

export const NotificationContext = createContext();

export const NotificationContextProvider = ({children}) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '');

  return (<NotificationContext.Provider value={[notification, notificationDispatch]}>
    {children}
  </NotificationContext.Provider>)
}