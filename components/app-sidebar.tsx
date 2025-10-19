"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import {
  IconAnalyze,
  IconBook,
  IconCertificate,
  IconDashboard,
  IconDeviceGamepad,
  IconHelp,
  IconLink,
  IconMovie,
  IconSettings,
  IconSocial,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Links",
      url: "/links",
      icon: IconLink,
    },
    {
      title: "Socials",
      url: "/social",
      icon: IconSocial,
    },
    { title: "Books", url: "/books", icon: IconBook },
    {
      title: "Games",
      url: "/games",
      icon: IconDeviceGamepad,
    },
    {
      title: "Movies",
      url: "/movies",
      icon: IconMovie,
    },
    {
      title: "Education",
      url: "/education",
      icon: IconCertificate,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconAnalyze,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const userData = {
    name: user?.fullName || user?.username || "User",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Image
                  src="/images/logos/logo1.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
