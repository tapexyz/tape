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

type ExploreStackComposite<S extends keyof ExploreStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<ExploreStackParamList, S>,
      BottomTabScreenProps<MainTabParamList, 'ExploreStack'>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >

type BytesStackComposite<S extends keyof BytesStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<BytesStackParamList, S>,
      BottomTabScreenProps<MainTabParamList, 'BytesStack'>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >

declare global {
  // PARAMS
  type HomeStackParamList = {
    Home: undefined
  }

  type ExploreStackParamList = {
    Explore: undefined
    Music: undefined
  }

  type BytesStackParamList = {
    Bytes: undefined
  }

  type MainTabParamList = {
    BytesStack: NavigatorScreenParams<BytesStackParamList>
    HomeStack: NavigatorScreenParams<HomeStackParamList>
    ExploreStack: NavigatorScreenParams<ExploreStackParamList>
  }

  type RootStackParamList = {
    ExploreTopsModal: undefined
    ExploreCategoriesModal: undefined
    WatchVideo: { id: string }

    MainTab: NavigatorScreenParams<MainTabParamList>
    Settings: undefined

    // modals
    ApplicationInfo: undefined
    NotFound: undefined
  }

  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }

  // SCREENS - specific screens props
  // You can get navigation or route prop for every screen f. eg.
  // - HomeScreenNavigationProps['route']
  // - HomeScreenNavigationProps['navigation']

  type BottomTabScreenProps = BaseBottomTabScreenProps<
    MainTabParamList,
    'HomeStack' | 'ExploreStack' | 'BytesStack'
  >

  // Root stack
  type RootStackScreenProps = RootStackComposite
  type WatchScreenProps = RootStackComposite<'WatchVideo'>

  // Home stack
  type HomeScreenProps = HomeStackComposite<'Home'>

  type ExploreScreenProps = ExploreStackComposite<'Explore'>
  type MusicScreenProps = ExploreStackComposite<'Music'>

  type BytesScreenProps = BytesStackComposite<'Bytes'>
}
