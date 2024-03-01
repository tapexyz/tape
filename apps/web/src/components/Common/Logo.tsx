import { TAPE_LOGO } from '@dragverse/constants';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const Logo = () => {
  const { resolvedTheme } = useTheme()

  return (
    <Link href="/" className="inline-flex">
      {resolvedTheme === 'dark' ? (
        <img
          src={`${TAPE_LOGO}`}
          className="-mb-0.5 h-20"
          alt="dragverse"
          height={30}
          width={110}
          draggable={false}
        />
      ) : (
        <img
          src={`${TAPE_LOGO}`}
          className="-mb-0.5 h-20"
          height={30}
          width={110}
          alt="dragverse"
          draggable={false}
        />
      )}
    </Link>
  )
}

export default Logo
