import { Bars3Icon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import * as Popover from "@radix-ui/react-popover";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 backdrop-blur-[2px]">
      <Link to="/" className="text-4xl font-semibold">
        💸
      </Link>
      <MobileMenu />
    </header>
  );
};

export { Header };

const MobileMenu = () => {
  return (
    <Popover.Root modal={true}>
      <Popover.Trigger>
        <Bars3Icon className="h-6 w-6 stroke-slate-900" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <div className="h-3/4 w-full bg-black" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
