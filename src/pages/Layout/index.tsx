import React, { PropsWithChildren } from "react";

import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default Layout;
