import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";
import { type } from "@testing-library/user-event/dist/type";

const GithubContext = createContext()
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;


export const GithubProvider = ({ children }) => {
    const initialState = {
        users: [],
        user:{},
        repos:[],
        loading: false
    }
    const [state, dispatch] = useReducer(githubReducer, initialState);

    // Get Search Results
    const searchUsers = async (text) => {
        setLoading()
        const params = new URLSearchParams({
            q:text
        })
        const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        const {items} = await response.json();
        dispatch({
            type: 'GET_USERS',
            payload: items,
        })
    }
    // Get SIngle User
    const getUser = async (login) => {
        setLoading()
        const response = await fetch(`${GITHUB_URL}/users/${login}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        if(response.status === 404){
            window.location ='/notfound'
        } else{
            const data = await response.json();
            dispatch({
                type: 'GET_USER',
                payload: data,
            })
        }
    }
    // Get User Repos
    const getUserRepos = async (login) => {
        setLoading()
        const params = new URLSearchParams({
            sort:'created',
            per_page:10,
        })
        const response = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

            const data = await response.json();
            dispatch({
                type: 'GET_REPOS',
                payload: data,
            })
    }

    // Clear User From state
    const emptyUsers =() => dispatch({
        type:'EMPTY_USERS'
    })
    // Set Loading
    const setLoading = () => dispatch({
        type: 'SET_LOADING'
    })
    return <GithubContext.Provider value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        emptyUsers,
        getUser,
        getUserRepos
    }}>
        {children}
    </GithubContext.Provider>
}

export default GithubContext