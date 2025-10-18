"use client";

import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Documents</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="relative h-8 w-[200px] justify-start text-sm text-muted-foreground sm:w-[300px] sm:pr-12"
              onClick={() => setOpen(true)}
            >
              <IconSearch className="mr-2 h-4 w-4" />
              <span>Search User or link...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search and navigate through the application
            </DialogDescription>
          </DialogHeader>
          <Command className="rounded-lg border-0">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                <CommandItem onSelect={() => setOpen(false)}>
                  Dashboard
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  Links
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  Social Links
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>Books</CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  Movies
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  Education
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  Analytics
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  Settings
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>Help</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
