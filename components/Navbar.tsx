import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Link from "next/link";

export default function Navbar(){
    return(
        <div className="w-screen p-2 border-b-[1px] border-white border-opacity-20 fixed top-0 backdrop-blur-xl">
            <NavigationMenu>
                <NavigationMenuItem>
                    <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Documentation
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenu>
        </div>
    )
}