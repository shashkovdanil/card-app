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
    onPanResponderRelease: (event, gestureState) => {
      Animated.timing(this.state.pan, {
        toValue: 0,
        duration: 300,
      }).start()
      Animated.timing(this.state.animatedValue, {
        toValue: 1,
        duration: 300,
      }).start(() => {
        this.state.animatedValue.setValue(0)
        this.setState({
          currentIndex: this.state.currentIndex + 1,
        })
      })
    },
  })

  renderFirstCard = () => {
    const { animatedValue, currentIndex } = this.state
    return (
      <Animated.View
        style={{
          width: '100%',
          height: 150,
          position: 'absolute',
          backgroundColor: data[(currentIndex + 2) % 3].color,
          zIndex: 1,
          bottom: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 20],
          }),
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 0.9],
              }),
            },
          ],
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.6],
          }),
        }}
      />
    )
  }

  renderLastCard = () => {
    const { animatedValue, currentIndex, pan } = this.state
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={{
          width: '100%',
          height: 150,
          position: 'absolute',
          backgroundColor: data[currentIndex % 3].color,
          zIndex: animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [3, 2, 0],
          }),
          bottom: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 40],
          }),
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.3],
          }),
          transform: [
            { translateX: pan.x },
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.8],
              }),
            },
          ],
        }}
      />
    )
  }

  renderCard = () => {
    const { animatedValue, currentIndex } = this.state
    return (
      <Animated.View
        style={{
          width: '100%',
          height: 150,
          position: 'absolute',
          backgroundColor: data[(currentIndex + 1) % 3].color,
          zIndex: 2,
          bottom: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1.0],
              }),
            },
          ],
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          }),
        }}
      />
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.area}>
        <View style={styles.cardWrapper}>
          {data.map((card, index, array) => {
            if (index === 0) {
              return this.renderFirstCard()
            }
            if (index === array.length - 1) {
              return this.renderLastCard()
            }
            return this.renderCard()
          })}
        </View>
      </SafeAreaView>
    )
  }
}

export default App
