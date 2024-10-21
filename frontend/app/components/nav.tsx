// components/nav.tsx
import { Link } from "@remix-run/react";


export default function Nav() {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex justify-between">
                <li>
                    <Link
                        to="/"
                        className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/tasks"
                        className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Tasks
                    </Link>
                </li>
                <li>
                    <Link
                        to="/users"
                        className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                    >
                       Users
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
