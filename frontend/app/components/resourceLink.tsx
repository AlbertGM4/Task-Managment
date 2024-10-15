// app/components/ResourceLink.tsx

import { ResourceLinkProps } from "~/models/resourceLink";


export default function ResourceLink({ href, text, icon }: ResourceLinkProps) {
    return (
        <li>
            <a
                className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                href={href}
                target="_blank"
                rel="noreferrer"
            >
                {icon}
                {text}
            </a>
        </li>
    );
}
