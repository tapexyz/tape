import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React, { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'
import Stagger from '../ui/Stagger'

const BORDER_RADIUS = 30

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    gap: 10
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    gap: 10
  },
  gridCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS,
    height: 200,
    aspectRatio: 1 / 1,
    overflow: 'hidden',
    backgroundColor: theme.colors.backdrop
  },
  card: {
    flex: 1,
    borderRadius: BORDER_RADIUS,
    height: 200,
    width: '100%',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    contentFit: 'cover',
    justifyContent: 'flex-end',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden'
  },
  title: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(24),
    paddingVertical: 8,
    paddingHorizontal: 18
  },
  whTextWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 18
  },
  whTitle: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(24)
  },
  whDescription: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary,
    letterSpacing: 0.8
  }
})

const Showcase = () => {
  const { navigate } = useNavigation()

  return (
    <View style={styles.container}>
      <Stagger>
        <View style={styles.card}>
          <AnimatedPressable onPress={() => haptic()}>
            <ImageBackground
              placeholder={
                '|JGv6ax-AMS7#YZloQtKNK=*r?OBNwr;ahOWniWAJHWH$Qr;XMTJM{aPt39;K5xA,BOsS~v%X8ozD_Rk$vS~R:#k$|WCa{XjwcRVKQw4#Ro{jtbE=xW-JPsDe-X7bYovjIacWDnos9X7S}objGsDtit2adR*oMW;RUaPS$'
              }
              source={{
                uri: imageCdn(`${STATIC_ASSETS}/mobile/images/couch-garden.jpg`)
              }}
              style={styles.image}
              imageStyle={{
                opacity: 0.8,
                backgroundColor: theme.colors.backdrop
              }}
            >
              <LinearGradient
                colors={['transparent', '#00000080', '#00000090']}
              >
                <View style={styles.whTextWrapper}>
                  <Text style={styles.whTitle}>What's happening?</Text>
                  <Text style={styles.whDescription}>
                    Adventure awaits beyond the horizon.
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </AnimatedPressable>
        </View>
      </Stagger>
      <Stagger>
        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <AnimatedPressable
              onPress={() => {
                haptic()
                navigate('MainTab', {
                  screen: 'ExploreStack',
                  params: { screen: 'Podcast' }
                })
              }}
            >
              <ImageBackground
                placeholder={
                  '|JGj?v^cZ@Ios~XPNaN2n6{Nv#nns+kDWFR+SeX50K$k%W%1R:VwWCofSzK*?G-lR*M{W-n#r^V[=LiyVhRon,XRbYS2V^}?OkS#t6xpr@WZNdoNIoOsbqxUfSnPaOnhobFxnirZWFbHS}R*n,W-xZ-7xtS#jXX5X5ozaj'
                }
                source={{
                  uri: imageCdn(
                    `${STATIC_ASSETS}/mobile/images/couch-watch.jpeg`
                  )
                }}
                style={styles.image}
                imageStyle={{
                  opacity: 0.8,
                  backgroundColor: theme.colors.backdrop
                }}
              >
                <LinearGradient
                  colors={['transparent', '#00000080', '#00000090']}
                >
                  <Text style={styles.title}>Podcast</Text>
                </LinearGradient>
              </ImageBackground>
            </AnimatedPressable>
          </View>
          <View style={styles.gridCard}>
            <AnimatedPressable
              onPress={() => {
                haptic()
                navigate('MainTab', {
                  screen: 'ExploreStack',
                  params: { screen: 'Music' }
                })
              }}
            >
              <ImageBackground
                placeholder={
                  '|GJsxXE*.pt8%e#l+Znmg5cFxVJENLSvskSiW=Rk_Pw^PnrqM}KPOtNcnh1SNI$ut2#TbdslwIt6^OS5OCT0RQrWbHxWS5M|ofs9wbO@RnrqOYs.TJjGn4jqt6XTOFoer=xuV[n+X9i^SeXTnhR.Ipt6W?RRS~xCv|V]XA'
                }
                source={{
                  uri: imageCdn(
                    `${STATIC_ASSETS}/mobile/images/couch-listen.jpeg`
                  )
                }}
                style={styles.image}
                imageStyle={{
                  opacity: 0.8,
                  backgroundColor: theme.colors.backdrop
                }}
              >
                <LinearGradient
                  colors={['transparent', '#00000070', '#000000']}
                >
                  <Text style={styles.title}>Music</Text>
                </LinearGradient>
              </ImageBackground>
            </AnimatedPressable>
          </View>
        </View>
      </Stagger>
    </View>
  )
}

export default memo(Showcase)
