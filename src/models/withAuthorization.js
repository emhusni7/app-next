import React, { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";

const AppContext = createContext();

function AppWrapper(props) {
    let sharedState = {
        isAuthenticated: !!props.user,
        user: props.user
    }
  
    return (
      <AppContext.Provider value={sharedState}>
        {props.children}
      </AppContext.Provider>
    );
  }

export function useAppContext() {
    return useContext(AppContext);
}


export const withAuth = (Component) => {
    const AuthenticatedComponent  = props => {
        const router = useRouter();
        const [data, setData] = useState();
        const tes = {...props}
        console.log(tes);
        useEffect(() => {
            const getUser = async () => {
                const userData = localStorage.getItem('user');
                if (!userData) {
                    router.push('/login');
                } else {
                    setData(userData);
                }  
            };
            getUser();
        }, []);
        
        return !!data ? 
            <AppWrapper user={data}>
                <Component {...props}  />
            </AppWrapper> : null;
    };

    return AuthenticatedComponent;
};

