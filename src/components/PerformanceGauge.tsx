import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface Props {
  score: number;
}

export const PerformanceGauge = ({ score }: Props) => {
  const rotation = useSharedValue(-90);

  useEffect(() => {
    // Mapping 0-10 score to -90 to 90 degrees
    const targetRotation = (score * 18) - 90;
    rotation.value = withSpring(targetRotation, { damping: 12, stiffness: 90 });
  }, [score]);

  const animatedNeedleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Dynamic color based on score
  const getScoreColor = () => {
    if (score >= 8) return '#38bdf8'; // Enthusiast Blue
    if (score >= 5) return '#eab308'; // High-Performance Gold
    return '#ef4444'; // Entry Red
  };

  return (
    <View style={styles.gaugeContainer}>
      <Svg width="240" height="130" viewBox="0 0 200 110">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#ef4444" />
            <Stop offset="50%" stopColor="#eab308" />
            <Stop offset="100%" stopColor="#22c55e" />
          </LinearGradient>
        </Defs>
        <Path 
          d="M 20 100 A 80 80 0 0 1 180 100" 
          fill="none" 
          stroke="url(#grad)" 
          strokeWidth="12" 
          strokeLinecap="round" 
        />
      </Svg>
      
      <Animated.View style={[styles.needlePivotWrapper, animatedNeedleStyle]}>
        <View style={[styles.needleLine, { backgroundColor: getScoreColor() }]} />
        <View style={styles.needleGap} />
      </Animated.View>
      
      <View style={[styles.needleHub, { borderColor: getScoreColor() }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  gaugeContainer: { height: 130, width: 240, justifyContent: 'flex-end', alignItems: 'center' },
  needlePivotWrapper: { position: 'absolute', top: 20, height: 160, width: 4, alignItems: 'center' },
  needleLine: { width: 4, height: 80, borderRadius: 2, shadowOpacity: 0.5, shadowRadius: 5 },
  needleGap: { height: 80 },
  needleHub: { position: 'absolute', bottom: 24, width: 14, height: 14, borderRadius: 7, backgroundColor: '#020617', borderWidth: 3 },
});