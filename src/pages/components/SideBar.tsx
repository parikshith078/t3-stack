import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const SideBar = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col gap-2 whitespace-nowrap">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        {user && (
          <li>
            <Link href={`/profile/${user.id}`}>Profile</Link>
          </li>
        )}
        {user ? (
          <li>
            <button onClick={() => signOut()}>Logout</button>
          </li>
        ) : (
          <li>
            <button onClick={() => signIn()}>Login</button>
          </li>
        )}
      </ul>
    </nav>
  );
};
