export const Sidebar = () => {
  return (
    <div className="flex w-[14rem] flex-col">
      <div>
        <span className="font-medium text-muted text-xs">
          Basic Information
        </span>
        <ul className="-mx-2 my-1.5 list-none text-primary/80 text-sm *:rounded-md *:px-2 *:py-1.5 *:hover:bg-secondary">
          <li>About</li>
          <li>Links</li>
        </ul>
      </div>
      <div>
        <span className="font-medium text-muted text-xs">
          Account management
        </span>
        <ul className="-mx-2 my-1.5 list-none text-primary/80 text-sm *:rounded-md *:px-2 *:py-1.5 *:hover:bg-secondary">
          <li>Wallet</li>
          <li>Sessions</li>
          <li>Usernames</li>
          <li>Protection</li>
          <li>Delegates</li>
          <li>Transfer</li>
        </ul>
      </div>
      <div>
        <span className="font-medium text-muted text-xs">Application</span>
        <ul className="-mx-2 my-1.5 list-none text-primary/80 text-sm *:rounded-md *:px-2 *:py-1.5 *:hover:bg-secondary">
          <li>Usage</li>
          <li>Blocked</li>
        </ul>
      </div>
    </div>
  );
};
