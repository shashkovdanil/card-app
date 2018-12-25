import * as React from 'react'
import { SafeAreaView, View, Animated, PanResponder } from 'react-native'
import data from './db'
import styles from './styles'

interface IState {
  cards: Array<{ id: number; color: string }>
  pan: Animated.ValueXY
  animatedValue: Animated.Value
  currentIndex: number
}

class App extends React.Component<{}, IState> {
  state = {
    cards: data,
    pan: new Animated.ValueXY(),
    animatedValue: new Animated.Value(0),
    currentIndex: 0,
  }

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (event, gestureState) => {
      this.state.pan.setValue({ x: gestureState.dx, y: 0 })
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: () => {
      const { pan, animatedValue, currentIndex } = this.state
      Animated.timing(pan, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        animatedValue.setValue(0)
        this.setState({
          currentIndex: currentIndex + 1,
        })
      })
    },
  })

  render() {
    const { animatedValue, currentIndex, pan } = this.state
    return (
      <SafeAreaView style={styles.area}>
        <View style={styles.cardWrapper}>
          {data.map((card, index, array) => {
            const count = array.length
            const isLast = index === count - 1
            const panHandlers = isLast ? this.panResponder.panHandlers : {}
            const getTranslateYOutputRange = () => {
              const start = (index + 1) * 20
              const end = isLast ? 20 : start + 20
              return [start, end]
            }
            const getOpacityOutputRange = () => {
              const start = (index + 1) / count
              const end = start === 1 ? 1 / count : (index + 2) / count
              return [start, end]
            }
            const getScaleOutputRange = () => {
              const del = (1 - 0.7) / count
              const start = 0.7 + (del * (index + 1))
              const end = isLast ? 0.7 + (del * (0 + 1)) : start + del
              return [start, end]
            }
            return (
              <Animated.View
                {...panHandlers}
                key={card.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: data[(currentIndex + (count - 1 - index)) % count].color,
                    zIndex: index + 1,
                    transform: [
                      { translateX: isLast ? pan.x : 0 },
                      {
                        translateY: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: getTranslateYOutputRange(),
                        }),
                      },
                      {
                        scale: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: getScaleOutputRange(),
                        }),
                      },
                    ],
                    opacity: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: getOpacityOutputRange(),
                    }),
                  },
                ]}
              />
            )
          })}
        </View>
      </SafeAreaView>
    )
  }
}

export default App
