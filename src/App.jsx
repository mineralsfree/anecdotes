import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getAll, updateAnecdote} from "./services/anecdote.js";
import {useContext} from "react";
import {NotificationContext} from "./NotificationContext.jsx";

const App = () => {
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })
  const [_, notificationDispatch] = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1,
  })
  console.log(JSON.parse(JSON.stringify(result)))
  if (result.isError) {
    return <div>anecdote service not available due to problems on server</div>

  }
  if (result.isLoading) {
    return <div>loading anecdotes...</div>
  }

  const anecdotes = result.data


  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1});
    notificationDispatch({type: 'SET_NOTIFICATION', payload: `voted up for ${anecdote.content}`});
    setTimeout(()=>notificationDispatch({type: 'REMOVE_NOTIFICATION'}), 5000)
    console.log('vote')
  }

  // const anecdotes = [
  //   {
  //     "content": "If it hurts, do it more often",
  //     "id": "47145",
  //     "votes": 0
  //   },
  // ]

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification/>
      <AnecdoteForm/>

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
