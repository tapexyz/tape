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

type ExamplesStackComposite<S extends keyof ExampleStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      BottomTabScreenProps<MainTabParamList, 'ExamplesStack'>,
      StackScreenProps<ExampleStackParamList, S>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >

type HomeStackComposite<S extends keyof HomeStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<HomeStackParamList, S>,
      BottomTabScreenProps<MainTabParamList, 'HomeStack'>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >

type MediaStackComposite<S extends keyof MediaStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<MediaStackParamList, S>,
      BottomTabScreenProps<MainTabParamList, 'MediaStack'>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >

declare global {
  // PARAMS
  type HomeStackParamList = {
    Home: undefined
    Details: { id: string }
  }

  type MediaStackParamList = {
    Media: undefined
  }

  type ExampleStackParamList = {
    Examples: undefined
    Components: undefined
    Colors: undefined
    Typography: undefined
  }

  type MainTabParamList = {
    HomeStack: NavigatorScreenParams<HomeStackParamList>
    MediaStack: NavigatorScreenParams<MediaStackParamList>
    ExamplesStack: NavigatorScreenParams<ExampleStackParamList>
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
    'ExamplesStack' | 'HomeStack' | 'MediaStack'
  >

  // Root stack
  type RootStackScreenProps = RootStackComposite

  // Home stack
  type HomeScreenProps = HomeStackComposite<'Home'>
  type MediaScreenProps = MediaStackComposite<'Media'>
  type DetailsScreenProps = HomeStackComposite<'Details'>

  // Examples stack
  type ExamplesScreenProps = ExamplesStackComposite<'Examples'>
  type ComponentsScreenProps = ExamplesStackComposite<'Components'>
}
