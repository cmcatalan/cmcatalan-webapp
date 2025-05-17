"use client"

import {Switch} from "@heroui/react";
import {FaMoon, FaSun} from "react-icons/fa6";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export default function DarkModeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isDark = theme === "dark";

    return (
        <Switch
            isSelected={isDark}
            onValueChange={(value) => setTheme(value ? "dark" : "light")}
            color="warning"
            endContent={<FaMoon/>}
            size="md"
            startContent={<FaSun/>}
        />
    );
}