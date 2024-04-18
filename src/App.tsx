import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import { UsersList } from './components/UsersList'

function App() {

  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterName, setFilterName] = useState<string | null>(null)

  const [filterId, setFilterId] = useState<string | null>(null)
  const [userById, setUserById] = useState<User | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByName = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.NAME : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (id: bigint) => {
    const filteredUsers = users.filter((user) => user.id !== id)
    setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    setLoading(true)
    setError(false)

    fetch(`http://localhost:8080/futbolista`)
      .then(async res => {
        if (!res.ok) throw new Error('Error en la aplicación')
        return await res.json()
      })
      .then(res => {
        setUsers(res)
        originalUsers.current = res
      })
      .catch(err => {
        setError(err)
        console.log(err);
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])


  const searchById = () => {
    
    if(filterId?.length === 0 || filterId === null || filterId.trim() === '') return

    fetch(`http://localhost:8080/futbolista/${filterId}`)
      .then(async res => {
        if (!res.ok) throw new Error('Error en la aplicación')
        return await res.json()
      })
      .then(res => {
        setUserById(res)
        if (!res?.id) {
          alert('No existe el futbolista')
          return
        }
        alert(`
          id: ${res?.id}
          Nombre: ${res?.name}
          Apellido: ${res?.lastName}
          Características: ${res?.characteristics}`)
      })
      .catch(err => {
        setError(err)
        console.log(err);
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Primero se filtra luego se ordena

  // Arreglo de usuarios filtrados por pais
  const filteredUsers = useMemo(() => {
    return (typeof filterName === 'string' && filterName.length > 0)
      ? users.filter(user => {
        return user.name.toLowerCase().includes(filterName.toLowerCase())
      })
      : users
  }, [users, filterName])



  // sortedUsers: Arreglo de usuarios ordenados
  // toSorted: indica que quieres hacer una copia y un ordenamiento, devuelve un nuevo array
  // Cuando cambie filteredUsers se volvera a ejecutar esta funcion
  // Guarda el valor de sortedUsers y no se vuelve a calcular entre renderizados
  // hasta que cambie filteredUsers
  const sortedUsers = useMemo(() => {

    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => string> = {
      [SortBy.NAME]: user => user.name,
      [SortBy.LAST]: user => user.lastName,
      [SortBy.CHARACTERISTICS]: user => user.characteristics,
    }

    return filteredUsers.toSorted((a, b) => {
      // Metodo para extraer el valor de la propiedad sorting
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])


  return (
    <>
      <h1>Futbolistas</h1>
      <header>
        <div>
          <button onClick={toggleColors}>
            Colorear filas
          </button>

          <button onClick={toggleSortByName}>
            {sorting === SortBy.NAME ? 'No ordenar por nombre' : 'Ordenar por nombre'}
          </button>

          <input
            type="text"
            placeholder='Filtrar por nombre'
            onChange={(e) => { setFilterName(e.target.value) }}
          />
        </div>

        <div>
          <input type="text"
            placeholder='Ingresa id a buscar'
            onChange={(e) => { setFilterId(e.target.value) }}
          />
          <button onClick={() => searchById()}>Buscar</button>
        </div>

      </header>
      <main>
        {
          users.length > 0 &&
          <UsersList
            changeSorting={handleChangeSort}
            deleteUser={handleDelete}
            showColors={showColors}
            users={sortedUsers}
          />
        }

        {loading && <p>Cargando...</p>}

        {!loading && error && <p>Ocurrió un error</p>}

        {!loading && !error && users.length === 0 && <p>No hay usuarios</p>}

      </main>
    </>
  )
}

export default App
