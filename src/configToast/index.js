import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView, Animated } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const { width } = Dimensions.get('window');

const colorSuccess = '#11da7e'
const colorError = '#e9171a'

export const ToastType = {
  success: 'customSuccess',
  error: 'customError',
}

const shadow = {
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.24,
  shadowRadius: 10,
  elevation: 10,
};

let isFinished = false
const baseCustomConfig = (props) => {
  const { type, isVisible, text1, color, sourceIcon } = props;
  const timerEnd = useRef(null)
  const timerStart = useRef(null)
  const sizeIcon = type == ToastType.error ? 14 : 16

  const fallAnim = useRef(new Animated.Value(0)).current;
  const sizeProgressAnimation = useRef(new Animated.Value(0)).current;
  const messageAnimation = useRef(new Animated.Value(0)).current;
  const progress1Animation = useRef(new Animated.Value(0)).current;
  const rotationAnimation = useRef(new Animated.Value(0)).current;
  const icAnimation = useRef(new Animated.Value(0)).current;
  const borderAnimation = useRef(new Animated.Value(0)).current;

  const refProgress1 = useRef(null)
  const wrapProgressRef = useRef(null)
  const imageRef = useRef(null)
  const wapLinesRef = useRef(null)

  useEffect(() => {
    wapLinesRef.current.setNativeProps({
      width: 0
    });
    if (timerEnd.current) {
      clearTimeout(timerEnd.current)
    }
    if (timerStart.current) {
      clearTimeout(timerStart.current)
    }
    timerEnd.current = null
    if (props.isVisible) {
      timerStart.current = setTimeout(() => {
        startAnimation()
      }, 10)
    } else {
      timerEnd.current = setTimeout(() => {
        fallAnim.setValue(0);
        sizeProgressAnimation.setValue(0);
        messageAnimation.setValue(0);
        icAnimation.setValue(0)
        borderAnimation.setValue(0)
        // resetScaleX progress & icon
        resetScale()
      }, 80);
    }
  }, [isVisible]);

  const startAnimation = () => {
    Animated.parallel([
      Animated.spring(fallAnim, {
        toValue: 1,
        friction: 4,
        tension: 25,
        // easing: (t) => 1 - Math.pow(1 - t, 2),
        // easing: Easing.cubic,
        useNativeDriver: true,
      }),
      Animated.timing(icAnimation, {
        toValue: 1,
        duration: 400,
        delay: 300,
        useNativeDriver: false,
      }),
      Animated.timing(sizeProgressAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(progress1Animation, {
        toValue: 1,
        duration: 50,
        delay: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {});
  }

  const startThenFinishPhase1 = () => {
    wrapProgressRef.current.setNativeProps({
      transform: [{ scaleX: -1 }]
    });
    imageRef.current.setNativeProps({
      transform: [{ scaleX: -1 }]
    });
    
    progress1Animation.setValue(0)
    isFinished = true
    Animated.sequence([
      Animated.timing(messageAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(rotationAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      })
    ]).start(() => {
      wapLinesRef.current.setNativeProps({
        width: 4
      });
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start()
    })
  }

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const sizeProgress = sizeProgressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 55],
  });

  const borderRadiusContainer = messageAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [55 / 2, 9],
  });

  // message
  const widthMessage = messageAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 80],
  });
  const opacityMessage = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // progress & icon

  const resetScale = () => {
    isFinished = false
    rotationAnimation.setValue(0)
    wrapProgressRef.current.setNativeProps({
      transform: [{ scaleX: 1 }]
    });
    imageRef.current.setNativeProps({
      transform: [{ scaleX: 1 }]
    });
  }

  const progress1 = progress1Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const widthIcon = icAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, sizeIcon],
  });

  const heightIcon = icAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, sizeIcon],
  });

  const rotation = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 75],
  });

  // animation border

  const heightBorder = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25.5],
  });

  const renderProgress = () => {
    return (
      <Animated.View ref={wrapProgressRef} style={{ position: 'relative'}}>
        <AnimatedCircularProgress
          ref={refProgress1}
          rotation={rotation}
          size={sizeProgress}
          width={4}
          fill={progress1}
          duration={400}
          tintTransparency={true}
          tintColor={color}
          onAnimationComplete={(e) => {
            if (e.finished && !isFinished) {
              startThenFinishPhase1()
            }
          }}
          backgroundColor="#fff"
          style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}} >
          {() => {
            return <Animated.Image ref={imageRef} source={sourceIcon} resizeMode='contain'
              style={{ width: widthIcon, height: heightIcon }} />
          }}
        </AnimatedCircularProgress>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView>
      <Animated.View style={[{ ...shadow }, { transform: [{ translateY }]}]}>
        <Animated.View style={{ flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: borderRadiusContainer, position: 'relative', overflow: 'hidden' }}>
          <View ref={wapLinesRef} style={{position: 'absolute', top: 0, left: 0, zIndex: 20, justifyContent: 'center', height: 55}}>
            <View style={{backgroundColor: color}}>
              <Animated.View style={{width: 4, height: heightBorder, backgroundColor: color}} />
              <Animated.View style={{width: 4, height: heightBorder, backgroundColor: color}} />
            </View>
          </View>
          {renderProgress()}
          <Animated.Text numberOfLines={2} ellipsizeMode='clip' style={[styles.message, { width: widthMessage, opacity: opacityMessage}]}>{text1}</Animated.Text>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  message: {
    fontSize: 12,
    color: '#373437'
  }
});

export default {
  customSuccess: options => baseCustomConfig({...options, color: colorSuccess, sourceIcon: require('../../access/ic_correct_new.png')}, ToastType.success),
  customError: options => baseCustomConfig({...options, color: colorError, sourceIcon: require('../../access/ic_error_new.png')}, ToastType.error),
};


// import React, { useEffect, useRef } from 'react';
// import { View, StyleSheet, Dimensions, SafeAreaView, Animated, Vibration } from 'react-native';
// import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import Toast from 'react-native-toast-message';
// import fonts from '../../../../assets/fonts';
// import Identify from '../../../core/helper/Identify';

// const { width } = Dimensions.get('window');

// const colorSuccess = '#11da7e'
// const colorError = '#e9171a'

// export const toastVisibleTime = 2700
// export const ToastType = {
//   success: 'customSuccess',
//   error: 'customError',
// }

// const shadow = {
//   shadowColor: '#000000',
//   shadowOffset: {
//     width: 0,
//     height: 5,
//   },
//   shadowOpacity: 0.24,
//   shadowRadius: 10,
//   elevation: 10,
// };

// let isFinished = false
// const queueToast = [] 
// const baseCustomConfig = (props) => {
//   const { type, isVisible, text1, color, sourceIcon, text2 } = props;

//   const timerEnd = useRef(null)
//   const timerStart = useRef(null)
//   const timerReset = useRef(null)
//   const timerReCall = useRef(null)
//   const sizeIcon = type == ToastType.error ? 14 : 16

//   const fallAnim = useRef(new Animated.Value(0)).current;
//   const sizeProgressAnimation = useRef(new Animated.Value(0)).current;
//   const messageAnimation = useRef(new Animated.Value(0)).current;
//   const progress1Animation = useRef(new Animated.Value(0)).current;
//   const rotationAnimation = useRef(new Animated.Value(0)).current;
//   const icAnimation = useRef(new Animated.Value(0)).current;
//   const borderAnimation = useRef(new Animated.Value(0)).current;

//   const refProgress1 = useRef(null)
//   const wrapProgressRef = useRef(null)
//   const imageRef = useRef(null)
//   const wapLinesRef = useRef(null)

//   // handle queue task

//   if(isVisible) {
//     if(timerReset.current) {
//       clearTimeout(timerReset.current)
//     }
//     const isExistToast = queueToast.find(item => item.text2 == text2)
//     if(text2 && !isExistToast) {
//       queueToast.push({
//         isVisible: isVisible,
//         type: type,
//         text1: text1,
//         color: color,
//         sourceIcon: sourceIcon,
//         text2: text2
//       })
//     }
    
//     if(queueToast.length > 1) {
//       timerReset.current = setTimeout(() => {
//         Toast.hide()
//       }, 1000);
//     }
//   }

//   useEffect(() => {
//     wapLinesRef.current.setNativeProps({
//       width: 0
//     });
//     if (timerEnd.current) {
//       clearTimeout(timerEnd.current)
//     }
//     if (timerStart.current) {
//       clearTimeout(timerStart.current)
//     }
//     timerEnd.current = null
//     if (props.isVisible) {
//       timerStart.current = setTimeout(() => {
//         startAnimation()
//       }, 10)
//     } else {
//       queueToast.shift()
//       if(timerReCall.current) {
//         clearTimeout(timerReCall.current)
//       }

//       timerEnd.current = setTimeout(() => {
//         fallAnim.setValue(0);
//         sizeProgressAnimation.setValue(0);
//         messageAnimation.setValue(0);
//         icAnimation.setValue(0)
//         borderAnimation.setValue(0)
//         // resetScaleX progress & icon
//         resetScale()
//       }, 50);

//       if(queueToast.length > 0) {
//         timerReCall.current = setTimeout(() => {
//           Toast.show(queueToast[0])
//         }, 100)
//       }
//     }
//   }, [isVisible]);

//   const startAnimation = () => {
//     Vibration.vibrate()
//     Animated.parallel([
//       Animated.spring(fallAnim, {
//         toValue: 1,
//         friction: 4,
//         tension: 25,
//         // easing: (t) => 1 - Math.pow(1 - t, 2),
//         // easing: Easing.cubic,
//         useNativeDriver: false,
//       }),
//       Animated.timing(icAnimation, {
//         toValue: 1,
//         duration: 400,
//         delay: 300,
//         useNativeDriver: false,
//       }),
//       Animated.timing(sizeProgressAnimation, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: false,
//       }),
//       Animated.timing(progress1Animation, {
//         toValue: 1,
//         duration: 50,
//         delay: 200,
//         useNativeDriver: false,
//       }),
//     ]).start(() => {});
//   }

//   const startThenFinishPhase1 = () => {
//     wrapProgressRef.current.setNativeProps({
//       transform: [{ scaleX: -1 }]
//     });
//     imageRef.current.setNativeProps({
//       transform: [{ scaleX: -1 }]
//     });
    
//     progress1Animation.setValue(0)
//     isFinished = true
//     Animated.sequence([
//       Animated.timing(messageAnimation, {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//       Animated.timing(rotationAnimation, {
//         toValue: 1,
//         duration: 150,
//         useNativeDriver: false,
//       })
//     ]).start(() => {
//       wapLinesRef.current.setNativeProps({
//         width: 4
//       });
//       Animated.timing(borderAnimation, {
//         toValue: 1,
//         duration: 400,
//         useNativeDriver: false,
//       }).start()
//     })
//   }

//   const translateY = fallAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 15],
//   });

//   const sizeProgress = sizeProgressAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [30, 55],
//   });

//   const borderRadiusContainer = messageAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [55 / 2, 9],
//   });

//   // message
//   const widthMessage = messageAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, width - 80],
//   });
//   const opacityMessage = borderAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1],
//   });

//   // progress & icon

//   const resetScale = () => {
//     isFinished = false
//     rotationAnimation.setValue(0)
//     wrapProgressRef.current.setNativeProps({
//       transform: [{ scaleX: 1 }]
//     });
//     imageRef.current.setNativeProps({
//       transform: [{ scaleX: 1 }]
//     });
//   }

//   const progress1 = progress1Animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 100],
//   });

//   const widthIcon = icAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, sizeIcon],
//   });

//   const heightIcon = icAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, sizeIcon],
//   });

//   const rotationProgress = Identify.isRtl() ? -120 : 75

//   const rotation = rotationAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, rotationProgress], // -120
//   });

//   // animation border

//   const heightBorder = borderAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 25.5],
//   });

//   const renderProgress = () => {
//     return (
//       <Animated.View ref={wrapProgressRef} style={{ position: 'relative'}}>
//         <AnimatedCircularProgress
//           ref={refProgress1}
//           rotation={rotation}
//           size={sizeProgress}
//           width={4}
//           fill={progress1}
//           duration={400}
//           tintTransparency={true}
//           tintColor={color}
//           onAnimationComplete={(e) => {
//             if (e.finished && !isFinished) {
//               startThenFinishPhase1()
//             }
//           }}
//           backgroundColor="#fff"
//           style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}} >
//           {() => {
//             return <Animated.Image ref={imageRef} source={sourceIcon} resizeMode='contain'
//               style={{ width: widthIcon, height: heightIcon }} />
//           }}
//         </AnimatedCircularProgress>
//       </Animated.View>
//     )
//   }

//   return (
//     <SafeAreaView>
//       <Animated.View style={[{ ...shadow, backgroundColor: '#fff', borderRadius: borderRadiusContainer }, { transform: [{ translateY }]}]}>
//         <Animated.View style={{ flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: borderRadiusContainer, position: 'relative', overflow: 'hidden' }}>
//           <View ref={wapLinesRef} style={{position: 'absolute', top: 0, left: 0, zIndex: 20, justifyContent: 'center', height: 55}}>
//             <View style={{backgroundColor: color}}>
//               <Animated.View style={{width: 4, height: heightBorder, backgroundColor: color}} />
//               <Animated.View style={{width: 4, height: heightBorder, backgroundColor: color}} />
//             </View>
//           </View>
//           {renderProgress()}
//           <Animated.Text numberOfLines={2} ellipsizeMode='clip' style={[styles.message, { width: widthMessage, opacity: opacityMessage, textAlign: 'left'}]}>{Identify.__(queueToast[0]?.text1 || '')}</Animated.Text>
//         </Animated.View>
//       </Animated.View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {

//   },
//   message: {
//     fontSize: 12,
//     fontFamily: fonts.fontFamily('regular'),
//     color: '#373437'
//   }
// });

// export default {
//   customSuccess: options => baseCustomConfig({...options, color: colorSuccess, sourceIcon: require('@media/ic_correct_new.png')}, ToastType.success),
//   customError: options => baseCustomConfig({...options, color: colorError, sourceIcon: require('@media/ic_error_new.png')}, ToastType.error),
// };
