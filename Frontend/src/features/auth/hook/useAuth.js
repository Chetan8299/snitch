import { setError, setLoading, setUser } from "../state/auth.slice";
import { useDispatch } from "react-redux";
import { login, register } from "../service/auth.api";

export const useAuth = () => {
    const dispatch = useDispatch();
    async function handleRegister({ email, contact, password, fullName, isSeller }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await register({ email, contact, password, fullName, isSeller });
            dispatch(setUser(response.user));
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.response?.data?.errors?.[0]?.msg ??
                error.message;
            dispatch(setError(typeof message === "string" ? message : "Registration failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await login({ email, password });
            dispatch(setUser(response.user));
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.response?.data?.errors?.[0]?.msg ??
                error.message;
            dispatch(setError(typeof message === "string" ? message : "Login failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin
    }
}