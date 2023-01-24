import React, { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";
import { getCookie } from 'cookies-next';


const AppContext = createContext();

function AppWrapper(props) {
    let sharedState = {
        isAuthenticated: !!props.user,
        user: props.user,
        access: props.access
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
        let x = false;

        useEffect(() => {
            const getUser = async () => {
                const users = getCookie('user');
                if (!users) {
                    router.push('/login');
                } else {
                    const userData = JSON.parse(users);    
                    userData.menu.map((x) => {
                        if (x.name == router.pathname.replace('/',"")){
                           x = true;
                           return x
                       }
                    })
                    setData(userData);
                }  
            };
            getUser();
        }, []);
        
        return !!data ? 
            <AppWrapper user={data} access={x}>
                <Component {...props}  />
            </AppWrapper> : null;
    };

    return AuthenticatedComponent;
};

