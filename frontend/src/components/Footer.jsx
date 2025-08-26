import {useTheme} from '../context/ThemeContext'
const Footer = () => {
  const {theme}=useTheme()
  return (
   <footer className={` flex flex-col items-center text-lg justify-center py-5 sm:py-8 ${theme==='dark'?"bg-gray-900":"bg-blue1"}`}>
    <div className='font-inter text-customWhite'>
    Habit Tracker © 2025 | v1.0.0
    </div>
    <div className='font-inter text-customWhite'>
     "Small steps every day lead to big changes."
    </div>
   </footer>
  )
}
export default Footer
