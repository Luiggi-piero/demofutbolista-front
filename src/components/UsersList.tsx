import { SortBy, type User } from "../types.d";

interface Props {
    users: User[],
    showColors: boolean,
    deleteUser: (id: bigint) => void,
    changeSorting: (sort: SortBy) => void
}

export function UsersList({ users, showColors, deleteUser, changeSorting }: Props) {
    return (
        <table width='100%'>
            <thead>
                <tr>
                    <th className="pointer" onClick={() => changeSorting(SortBy.NAME)}>Nombre</th>
                    <th className="pointer" onClick={() => changeSorting(SortBy.LAST)}>Apellido</th>
                    <th className="pointer" onClick={() => changeSorting(SortBy.CHARACTERISTICS)}>Características</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => {
                    const backgroundColor = index % 2 === 0 ? '#333' : '#555'
                    const color = showColors ? backgroundColor : 'transparent'

                    return (
                        <tr key={user.id} style={{ backgroundColor: color }}>
                            <td>{user.name}</td>
                            <td>{user.lastName}</td>
                            <td>{user.characteristics}</td>
                            <td>
                                <button onClick={() => deleteUser(user.id)}>
                                    Borrar
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}