import { createContext,useContext,useState } from "react"
//create context
const ThemeContex=createContext()
//theme provider
export const ThemeProvider=({children})=>{
    const [theme,setTheme]=useState('light')
    const toggleTheme=()=>{
        setTheme((prevTheme)=>(prevTheme==='light'?'dark':'light'))
    }
    return(
        <ThemeContex.Provider value={{theme,toggleTheme}}>
            <div className={theme==='dark'?'drak':''}>{children}</div>
        </ThemeContex.Provider>
    )
}
//custom hook for easy access
export const useTheme=()=>useContext(ThemeContex)