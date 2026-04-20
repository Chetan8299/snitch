import { setError, setLoading, setUser } from "../state/auth.slice";
import { useDispatch } from "react-redux";
import { register } from "../service/auth.api";

export const useAuth = () => {
    const dispatch = useDispatch();
    async function handleRegister({ email, contact, password, fullname, isSeller }) {
        try {
            setLoading(true);
            dispatch(setLoading(true));
            const response = await register({ email, contact, password, fullname, isSeller });
            dispatch(setUser(response.user));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister
    }
}