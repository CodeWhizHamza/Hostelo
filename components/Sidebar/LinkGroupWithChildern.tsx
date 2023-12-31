import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { FaCircleChevronDown } from "react-icons/fa6";
import React from "react";

interface LinkGroupWithChildrenProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg0: boolean) => void;
  groupName: string;
  items: LinkGroupItem[];
  basePath: string;
  GroupIcon: React.ElementType;
  currentUserRole: string;
}
interface LinkGroupItem {
  name: string;
  path: string;
  access: string;
}

export default function LinkGroupWithChildren({
  sidebarExpanded,
  setSidebarExpanded,
  groupName,
  items,
  GroupIcon,
  basePath,
  currentUserRole,
}: LinkGroupWithChildrenProps) {
  const pathname = usePathname();
  return (
    <SidebarLinkGroup
      activeCondition={pathname === basePath || pathname.includes(basePath)}
    >
      {(handleClick, open) => {
        return (
          <>
            <Link
              href="#"
              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                (pathname === basePath || pathname.includes(basePath)) &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
              }}
            >
              <GroupIcon />
              {groupName}
              <FaCircleChevronDown
                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                  open && "rotate-180"
                }`}
              />
            </Link>
            {/* <!-- Dropdown Menu Start --> */}
            <div
              className={`translate transform overflow-hidden ${
                !open && "hidden"
              }`}
            >
              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                {items.map((item, i) => {
                  if (!item.access.includes(currentUserRole)) return;
                  return (
                    <li key={i}>
                      <Link
                        href={`${basePath}${item.path}`}
                        className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                          pathname === `${basePath}${item.path}` && "text-white"
                        } `}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* <!-- Dropdown Menu End --> */}
          </>
        );
      }}
    </SidebarLinkGroup>
  );
}
