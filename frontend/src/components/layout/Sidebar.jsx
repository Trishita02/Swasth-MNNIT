import { NavLink } from "react-router-dom";


function Sidebar({sideMenu}){

    return(
        <>
        <aside className="hidden border-r bg-white md:block">
          <nav className="grid gap-2 p-4 text-sm">
            {sideMenu.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                className={({isActive})=>`
                  " flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ",
                  ${isActive ? "bg-gray-100 text-gray-900" : "" }
                `}
              >
                {item.icon}
                {item.title}
              </NavLink>
            ))}
          </nav>
        </aside>
        </>
    )
}

export default Sidebar;