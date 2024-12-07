import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createAnecdote} from "../services/anecdote.js";
import {useContext} from "react";
import {NotificationContext} from "../NotificationContext.jsx";


const getId = () => (100000 * Math.random()).toFixed(0)
const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const [_, notificationDispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({ mutationFn: createAnecdote,
    onSuccess: () => {
    console.log('success');
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      notificationDispatch({type: 'SET_NOTIFICATION', payload: `anecdote to short, must be at least 5 symbols long`});
      setTimeout(()=>notificationDispatch({type: 'REMOVE_NOTIFICATION'}), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, id : getId(), votes: 0 })
    notificationDispatch({type: 'SET_NOTIFICATION', payload: `created ${content}`});
    setTimeout(()=>notificationDispatch({type: 'REMOVE_NOTIFICATION'}), 5000)
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
