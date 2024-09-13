// "use client";

// import * as React from "react";
// import { useTheme } from "next-themes";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MoonIcon, SunIcon } from "lucide-react";

// export function ThemeToggle() {
//   const { setTheme } = useTheme();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon">
//           <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//         {/* <div className="border rounded cursor-pointer flex items-center p-1" >
//           <SunIcon className="sm:w-8 sm:h-8 w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <MoonIcon className="absolute sm:w-8 sm:h-8 w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </div> */}
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           Dark
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  // Determine the icon to display based on the current theme
  const isDarkMode = theme === "dark";
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      className="relative"
    >
      <SunIcon
        className={`h-[1.2rem] w-[1.2rem] transition-transform ${
          isDarkMode ? "rotate-0 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <MoonIcon
        className={`h-[1.2rem] w-[1.2rem] transition-transform absolute ${
          isDarkMode ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
