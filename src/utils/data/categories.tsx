import { AiOutlineCar } from 'react-icons/ai'
import { BsBrush, BsEmojiLaughing } from 'react-icons/bs'
import { CgGames } from 'react-icons/cg'
import {
  FcElectronics,
  FcGraduationCap,
  FcMusic,
  FcNews,
  FcOrganization,
  FcReadingEbook,
  FcVideoProjector,
  FcVoicemail
} from 'react-icons/fc'
import { GiPopcorn } from 'react-icons/gi'
import {
  MdCardTravel,
  MdOutlinePets,
  MdOutlineSportsHandball
} from 'react-icons/md'

export const CREATOR_VIDEO_CATEGORIES = [
  {
    name: 'People & Blogs',
    tag: 'people',
    icon: <FcReadingEbook className="w-6 h-6" />
  },
  {
    name: 'Podcast',
    tag: 'podcast',
    icon: <FcVoicemail className="w-6 h-6" />
  },
  {
    name: 'Autos & Vehicles',
    tag: 'vehicles',
    icon: <AiOutlineCar className="w-6 h-6 text-red-500" />
  },
  {
    name: 'Comedy',
    tag: 'comedy',
    icon: <BsEmojiLaughing className="w-6 h-6 text-sky-500" />
  },
  {
    name: 'Education',
    tag: 'education',
    icon: <FcGraduationCap className="w-6 h-6" />
  },
  {
    name: 'Entertainment',
    tag: 'entertainment',
    icon: <GiPopcorn className="w-6 h-6 text-orange-500" />
  },
  {
    name: 'Film & Animation',
    tag: 'film',
    icon: <FcVideoProjector className="w-6 h-6" />
  },
  {
    name: 'Gaming',
    tag: 'gaming',
    icon: <CgGames className="w-6 h-6 text-purple-500" />
  },
  {
    name: 'Howto & Style',
    tag: 'howto',
    icon: <BsBrush className="w-6 h-6 text-pink-500" />
  },
  { name: 'Music', tag: 'music', icon: <FcMusic className="w-6 h-6" /> },
  {
    name: 'News & Politics',
    tag: 'news',
    icon: <FcNews className="w-6 h-6" />
  },
  {
    name: 'Nonprofits & Activism',
    tag: 'nonprofits',
    icon: <FcOrganization className="w-6 h-6" />
  },
  {
    name: 'Pets & Animals',
    tag: 'pets',
    icon: <MdOutlinePets className="w-6 h-6 text-yellow-500" />
  },
  {
    name: 'Science & Technology',
    tag: 'technology',
    icon: <FcElectronics className="w-6 h-6" />
  },
  {
    name: 'Sports',
    tag: 'sports',
    icon: <MdOutlineSportsHandball className="w-6 h-6 text-orange-500" />
  },
  {
    name: 'Travel & Events',
    tag: 'travel',
    icon: <MdCardTravel className="w-6 h-6 text-blue-500" />
  }
]
