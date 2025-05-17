"use client";

import {SessionProvider} from "next-auth/react";
import {HeroUIProvider} from "@heroui/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {Toaster} from "sonner";
import {ReactNode, useEffect, useState} from "react";

interface Props {
    children: ReactNode;
}

export function Providers({children}: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>
            <SessionProvider>
                {children}
            </SessionProvider>
        </>;
    }
    return (
        <>
            <SessionProvider>
                <HeroUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="light">
                        {children}
                    </NextThemesProvider>
                </HeroUIProvider>
            </SessionProvider>
            <Toaster richColors/>
        </>
    );
}
