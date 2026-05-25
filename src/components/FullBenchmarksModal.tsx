import { BlurView } from 'expo-blur';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Modal, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Correct Theme Imports
import { useThemeStore } from '../store/useThemeStore';
import { themes } from '../theme/themes';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const FullBenchmarksModal = ({ visible, onClose, cpu, gpu }: any) => {
  const { activeTheme } = useThemeStore();
  const theme = themes[activeTheme];
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (visible) panY.setValue(0); }, [visible]);

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dy > 150 || gestureState.vy > 1.5) {
        Animated.timing(panY, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }).start(() => onClose());
      } else {
        Animated.spring(panY, { toValue: 0, bounciness: 10, useNativeDriver: true }).start();
      }
    }
  })).current;

  // Fully restored benchmark calculations
  const scores = useMemo(() => {
    if (!cpu || !gpu) return null;
    return {
      cpu: {
        cinebenchSC: cpu.tier * 215,
        cinebenchMC: cpu.tier * 3200,
        geekbenchSC: cpu.tier * 290,
        geekbenchMC: cpu.tier * 2400,
      },
      gpu: {
        timeSpy: gpu.tier * 2100,
        portRoyal: Math.max((gpu.tier - 2) * 1500, 0),
        fireStrike: gpu.tier * 4500,
      },
      compute: {
        geekbenchAI: (gpu.tier * 3500) + (cpu.tier * 1200),
        cudaOpenCL: gpu.tier * 18000,
      }
    };
  }, [cpu, gpu]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <BlurView intensity={50} tint={activeTheme === 'arcticLight' ? 'light' : 'dark'} style={styles.modalContainer}>
        <Animated.View style={[styles.content, { backgroundColor: theme.card, borderColor: theme.primary, transform: [{ translateY: panY.interpolate({ inputRange: [0, SCREEN_HEIGHT], outputRange: [0, SCREEN_HEIGHT], extrapolate: 'clamp' }) }] }]}>
          
          <View {...panResponder.panHandlers} style={styles.swipeArea}>
            <View style={[styles.dragHandle, { backgroundColor: theme.border }]} />
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.textMain }]}>DETAILED BENCHMARKS</Text>
              <TouchableOpacity onPress={onClose}><Text style={{ color: theme.textMuted, fontSize: 24, fontWeight: 'bold' }}>✕</Text></TouchableOpacity>
            </View>
          </View>

          {!scores ? (
            <Text style={{ color: theme.textMuted, textAlign: 'center', marginTop: 40, fontSize: 16 }}>Please select a CPU and GPU to view synthetic benchmarks.</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
              
              {/* CPU Section */}
              <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>CPU PERFORMANCE</Text>
                <BenchmarkRow label="Cinebench R23 (Multi-Core)" value={scores.cpu.cinebenchMC} theme={theme} />
                <BenchmarkRow label="Cinebench R23 (Single-Core)" value={scores.cpu.cinebenchSC} theme={theme} />
                <BenchmarkRow label="Geekbench 6 (Multi-Core)" value={scores.cpu.geekbenchMC} theme={theme} />
              </View>

              {/* GPU Section */}
              <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>GPU & GRAPHICS</Text>
                <BenchmarkRow label="3DMark Time Spy" value={scores.gpu.timeSpy} theme={theme} />
                <BenchmarkRow label="3DMark Port Royal (RT)" value={scores.gpu.portRoyal > 0 ? scores.gpu.portRoyal : 'N/A'} theme={theme} />
                <BenchmarkRow label="3DMark Fire Strike" value={scores.gpu.fireStrike} theme={theme} />
              </View>

              {/* AI & Compute Section */}
              <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>AI & COMPUTE</Text>
                <BenchmarkRow label="Geekbench AI" value={scores.compute.geekbenchAI} theme={theme} />
                <BenchmarkRow label="CUDA / OpenCL Score" value={scores.compute.cudaOpenCL} theme={theme} />
              </View>

            </ScrollView>
          )}
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

// Reusable component to keep the code clean and themeable
const BenchmarkRow = ({ label, value, theme }: any) => (
  <View style={[styles.scoreRow, { borderBottomColor: theme.border }]}>
    <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: 'bold', flex: 1 }}>{label}</Text>
    <Text style={{ color: theme.textMain, fontSize: 16, fontWeight: '900', textAlign: 'right' }}>
      {typeof value === 'number' ? value.toLocaleString() : value} <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: 'bold' }}>{value !== 'N/A' ? 'pts' : ''}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  content: { height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 25, paddingBottom: 25, borderWidth: 1 },
  swipeArea: { paddingTop: 12, paddingBottom: 10 },
  dragHandle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  section: { marginBottom: 25, borderRadius: 16, padding: 15, borderWidth: 1 },
  sectionTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, paddingBottom: 8 }
});