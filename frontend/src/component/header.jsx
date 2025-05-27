// make header a prop, not an official site (arrow function)
import { Link } from "react-router-dom"


const Header = (props) => {
    return(
        <div className="py-3 px-10 flex flex-row justify-between bg-sky-800 shadow-b-xl">
            <Link to="/" className="font-bold text-2xl text-white">MEDICARE+</Link>
            <div className="pt-1 text-white font-medium flex flex-row gap-8">
                <Link className="group">
                    Featured
                    <div class="bg-neutral-200 h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
                </Link>
                <Link className="group">
                    Services
                    <div class="bg-neutral-200 h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
                </Link>
                <Link className="group">
                    Blog
                    <div class="bg-neutral-200 h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
                </Link>
                <Link className="group">
                    Contact Us
                    <div class="bg-neutral-200 h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
                </Link>
            </div>
        </div>
    )
}

export default Header