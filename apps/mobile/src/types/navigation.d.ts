import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type {
  CompositeScreenProps,
  NavigatorScreenParams
} from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'

type RootStackComposite<
  S extends keyof RootStackParamList = keyof RootStackParamList
> = CompositeScreenProps<
  StackScreenProps<RootStackParamList, S>,
  BottomTabScreenProps<MainTabParamList>
>

type HomeStackComposite<S extends keyof HomeStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<HomeStackParamList, S>,
      BottomTabScreenProps<MainTabParamList, 'HomeStack'>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >

type AudioStackComposite<S extends keyof AudioStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<AudioStackParamList, S>,
      BottomTabScreenProps<MainTabParamList, 'AudioStack'>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >

type VideoStackComposite<S extends keyof VideoStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<VideoStackParamList, S>,
      BottomTabScreenProps<MainTabParamList, 'VideoStack'>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >

declare global {
  // PARAMS
  type HomeStackParamList = {
    Home: undefined
    Details: { id: string }
  }

  type AudioStackParamList = {
    Audio: undefined
  }

  type VideoStackParamList = {
    Video: undefined
  }

  type MainTabParamList = {
    VideoStack: NavigatorScreenParams<VideoStackParamList>
    HomeStack: NavigatorScreenParams<HomeStackParamList>
    AudioStack: NavigatorScreenParams<AudioStackParamList>
  }

  type RootStackParamList = {
    // unauthorized
    SignUp: undefined
    SignIn: undefined

    // authorized
    MainTab: NavigatorScreenParams<MainTabParamList>
    Settings: undefined

    // modals
    ApplicationInfo: undefined
    NotFound: undefined
  }

  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }

  // SCREENS - specific screens props
  // You can get navigation or route prop for every screen f. eg.
  // - HomeScreenNavigationProps['route']
  // - HomeScreenNavigationProps['navigation']

  type BottomTabScreenProps = BaseBottomTabScreenProps<
    MainTabParamList,
    'HomeStack' | 'AudioStack' | 'VideoStack'
  >

  // Root stack
  type RootStackScreenProps = RootStackComposite

  // Home stack
  type HomeScreenProps = HomeStackComposite<'Home'>
  type AudioScreenProps = AudioStackComposite<'Audio'>
  type VideoScreenProps = VideoStackComposite<'Video'>
  type DetailsScreenProps = HomeStackComposite<'Details'>
}
