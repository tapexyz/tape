import { BsBrush } from 'react-icons/bs'
import { CgGames } from 'react-icons/cg'
import {
  FcElectronics,
  FcGraduationCap,
  FcMusic,
  FcNews,
  FcReadingEbook,
  FcVideoProjector
} from 'react-icons/fc'
import { GiMailShirt } from 'react-icons/gi'
import { HiFire } from 'react-icons/hi'
import { MdOutlineSportsHandball } from 'react-icons/md'

export const CREATOR_VIDEO_CATEGORIES = [
  { name: 'People & Blogs', tag: 'people' },
  { name: 'Autos & Vehicles', tag: 'vehicles' },
  { name: 'Comedy', tag: 'comedy' },
  { name: 'Education', tag: 'education' },
  { name: 'Entertainment', tag: 'entertainment' },
  { name: 'Film & Animation', tag: 'film' },
  { name: 'Gaming', tag: 'gaming' },
  { name: 'Howto & Style', tag: 'howto' },
  { name: 'Music', tag: 'music' },
  { name: 'News & Politics', tag: 'news' },
  { name: 'Nonprofits & Activism', tag: 'nonprofits' },
  { name: 'Pets & Animals', tag: 'pets' },
  { name: 'Science & Technology', tag: 'technology' },
  { name: 'Sports', tag: 'sports' },
  { name: 'Travel & Events', tag: 'travel' }
]

export const WEB_VIEW_CATEGORIES = [
  {
    name: 'Trending',
    icon: <HiFire className="text-red-500 md:text-4xl" />
  },
  { name: 'Technology', icon: <FcElectronics className="md:text-4xl" /> },
  { name: 'Music', icon: <FcMusic className="md:text-4xl" /> },
  { name: 'Movies', icon: <FcVideoProjector className="md:text-4xl" /> },
  { name: 'Games', icon: <CgGames className="text-purple-500 md:text-4xl" /> },
  { name: 'News', icon: <FcNews className="md:text-4xl" /> },
  { name: 'Learning', icon: <FcReadingEbook className="md:text-4xl" /> },
  {
    name: 'Education',
    icon: <FcGraduationCap className="md:text-4xl" />
  },
  {
    name: 'Sports',
    icon: <MdOutlineSportsHandball className="text-orange-500 md:text-4xl" />
  },
  { name: 'Beauty', icon: <BsBrush className="text-pink-500 md:text-4xl" /> },
  {
    name: 'Fashion',
    icon: <GiMailShirt className="text-cyan-500 md:text-4xl" />
  }
]
