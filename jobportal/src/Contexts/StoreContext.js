import React, { createContext, useEffect, useState } from "react";

export const storeContext = createContext(null);

function StoreContextProvider(props) {
    const [token, setToken] = useState("");
    const url="http://localhost:3000"

    useEffect(() => {
        // Preserve login state on page reload
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const contextValue = {
        token,
        setToken,
        url
    };

    return (
        <storeContext.Provider value={contextValue}>
            {props.children}
        </storeContext.Provider>
    );
}

export default StoreContextProvider;
