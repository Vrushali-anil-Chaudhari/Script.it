import { createContext, ReactNode, useContext, useState } from "react";
import { apiRoutes } from "../config/apiconfig.ts";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

type User = {
    first_name?: string,
    last_name?: string,
    username: string;
    email?: string,
    password: string;
};

interface LoginResponse {
    data?: {
        access_token: string;
        refresh_token: string
        message: string;
        user: User;
    };
    error?: string
    message: string;
}
interface SignupResponse {
    data?: {
        email: string,
        username: string,
        first_name: string,
        last_name: string,
        index_id: string
    };
    error?: {
        [key: string]: string[]; // Dynamic keys with an array of error messages
    };
    message: string;
}

type AuthContextType = {
    user: {
        user: User | {};
        message: string;
    };
    Signin: (userCreds: User | FormData) => Promise<LoginResponse | undefined>;
    SignUp: (reqData: User | (FormData & { password2?: string })) => Promise<SignupResponse | undefined>;
    Logout: (reqData: FormData) => void;
    getUser: () => void;
    auth: { access_token: string };

    loggedInUser: Pick<User,"username" | "email">
    setLoggedInUser:  React.Dispatch<React.SetStateAction<Pick<User, "username" | "email">>>
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token") as string

    const [user, setUser] = useState<{ user: User | {}; message: string }>({
        user: {},
        message: "",
    });

    const [loggedInUser , setLoggedInUser ] = useState<Pick<User, "username" | "email">>({
        username: "",
        email: ""
    })
    const [auth, setAuth] = useState<{ access_token: string }>({
        access_token: "",
    });

    console.log('loggedInUser in context' , loggedInUser);

    const Signin = async (reqData: User | FormData): Promise<LoginResponse | undefined> => {
        try {
            const response = await fetch(`${apiRoutes.auth.login}`, {
                body: reqData as BodyInit,
                method: "POST",
            });
            const responseData: LoginResponse = await response.json();

            if (response.status === 400 && responseData.error) {
                return {
                    error: responseData.error,
                    message: ""
                }
            }
            if (!responseData.data) {
                setUser({
                    user: {},
                    message: responseData.message,
                });
                return responseData;
            }

            const { access_token, refresh_token, message, user } = responseData.data;
            console.log('ref', refresh_token);
            setUser({
                user,
                message,
            });
            setLoggedInUser({
                username: responseData.data.user.username,
                email: responseData.data.user.email
            })
            setAuth({
                access_token,
            });

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify({ username: user?.username, email: user?.email }));
            navigate("/search");
            return responseData;

        } catch (error) {
            console.log('Error:', error);
            return {
                error: (error as Error).message,
                message: ""
            };
        }
    };
    const SignUp = async (
        reqData: User | (FormData & { password2?: string }),
    ): Promise<SignupResponse | undefined> => {
        try {
            const response = await fetch(`${apiRoutes.auth.register}`, {
                body: reqData as BodyInit,
                method: "POST",
            });
            const responseData: SignupResponse = await response.json();

            console.log('response', responseData);
            if (!responseData.data) {
                setUser({
                    user: {},
                    message: responseData.message,
                });
                return responseData;
            }
            if (response.status === 400 && responseData.error) {
                return {
                    error: responseData.error,
                    message: ""
                }
            }
            if (response.ok) {
                setUser({
                    user: responseData.data,
                    message: ""
                })
                return {
                    data: responseData.data,
                    message: "Sucessfully Registered"
                }

            }
            // return responseData;

        } catch (error) {
            console.log('Error:', error);
            return undefined;
        }
    };

    const Logout = async (reqData: FormData) => {
        try {
            const response = await fetch(`${apiRoutes.auth.logout}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${access_token}`
                },
                body: reqData
            });
            console.log(response)
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            setUser({
                user: {},
                message: "",
            });
            navigate("/signin");
            setLoggedInUser({
                username: "",
                email: ""
            })
        }
        catch (error) {
            return error;
        }

    };

    const getUser = async () => {
        const controller = new AbortController()
        try {
            
            const response = await fetch(apiRoutes.auth.profile, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}`
                },
                signal:controller.signal
            })
            const {data}: { data: User } = await response.json();
            if (!response.ok && response.status === 400) {
                toast.error("Error while Fetching Profile", {
                    className: "text-red-500 py-3 px-4"
                })
            }
            setLoggedInUser({
                username: data.username,
                email: data.email
            })
        } catch (error) {
            toast.error((error as Error).message, {
                className: "text-red-500 py-3 px-4"
            })
        }
    };

    return (
        <AuthContext.Provider value={{ user, Signin, SignUp, Logout, getUser, auth , loggedInUser ,setLoggedInUser }}>
            {children}
        </AuthContext.Provider>
    );
};
