import { useAuth } from "../../AuthContext";

export default function Cliente(){

    const { user } = useAuth();
    console.log(user)

    return(
        <h1>Olá cliente, {user?.email}</h1>
    )
}