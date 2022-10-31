// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

// class ErrorBoundary extends React.Component {
//   state = {error: null}
//   static getDerivedStateFromError(error) {
//     return {error}
//   }
//   render() {
//     const {error} = this.state
//     if (error) {
//       return (
//         <this.props.FallbackComponent error={error} />
//       )
//     } else {
//       return this.props.children
//     }
//   }
// }

function PokemonInfo({pokemonName}) {
  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState(null)
  // const [status, setStatus] = React.useState('idle')
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    // setPokemon(null)
    // setError(null)
    // setStatus('pending')
    setState({status: 'pending'})

    async function effect() {
      try {
        const pokemonData = await fetchPokemon(pokemonName)
        setState({pokemon: pokemonData, status: 'resolved'})
        // setPokemon(pokemonData)
        // setStatus('resolved')
      } catch (err) {
        // setError(err)
        // setStatus('rejected')
        setState({error: err, status: 'rejected'})
      }
    }
    effect()
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
    // return (
    //   <div role="alert">
    //     There was an error:{' '}
    //     <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    //   </div>
    // )
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  } else {
    throw new Error('This should be impossible')
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (<div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
          <button onClick={resetErrorBoundary}>Try Again</button>
        </div>)
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
        {/* <ErrorBoundary FallbackComponent={ErrorFallback} key={pokemonName}> */}
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
