import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FullBenchmarksModal } from '../components/FullBenchmarksModal';
import { PartPickerModal } from '../components/PartPickerModal';
import { PerformanceGauge } from '../components/PerformanceGauge';
import hardwareData from '../data/hardwareData.json';
import { useBuildStore } from '../store/useBuildStore';
import { useThemeStore } from '../store/useThemeStore';
import { themes } from '../theme/themes';
import { calculateFinalScore, detectBottleneck } from '../utils/scoreCalculator';
export default function Dashboard({ navigation }: any) {
  const { cpu, gpu, ram, setCPU, setGPU, setRAM } = useBuildStore();
  
  // Theme Engine Hooks
  const { activeTheme, cycleTheme } = useThemeStore();
  const theme = themes[activeTheme];

  const [activePicker, setActivePicker] = useState<'cpu' | 'gpu' | 'ram' | null>(null);
  const [benchmarksOpen, setBenchmarksOpen] = useState(false);

  const finalScore = useMemo(() => {
    if (!cpu || !gpu) return 0;
    const ramMult = ram?.multiplier || 1.0;
    return calculateFinalScore(cpu.tier, gpu.tier, ramMult);
  }, [cpu, gpu, ram]);

  const bottlenecks = useMemo(() => {
    if (!cpu || !gpu || !ram) return [];
    return detectBottleneck(cpu.tier, gpu.tier, ram.id);
  }, [cpu, gpu, ram]);

  const openPicker = (type: 'cpu' | 'gpu' | 'ram') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActivePicker(type);
  };

  const handleThemeSwitch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    cycleTheme();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Sleek Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.openDrawer();
              }} 
              style={{ marginRight: 15, padding: 5, paddingLeft: 0 }}
            >
              <Text style={{ color: theme.primary, fontSize: 28, fontWeight: 'bold' }}>≡</Text>
            </TouchableOpacity>

            <View>
              <Text style={[styles.title, { color: theme.textMain }]}>RIG<Text style={{ color: theme.primary }}>.AI</Text></Text>
              <Text style={[styles.subtitle, { color: theme.textMuted }]}>HARDWARE BENCHMARK</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* NEW: Theme Switcher Button */}
            <TouchableOpacity 
              style={[styles.exportBtn, { borderColor: theme.border, backgroundColor: theme.card }]} 
              onPress={handleThemeSwitch}
            >
              <Text style={{ color: theme.textMain, fontSize: 16 }}>◐</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.exportBtn, { borderColor: theme.primary }]} onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}>
              <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 12, letterSpacing: 1 }}>PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Score Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, finalScore >= 8 ? { shadowColor: theme.primary, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 } : {}]}>
          <PerformanceGauge score={finalScore} />
          <Text style={[styles.scoreText, { color: theme.textMain }]}>{finalScore > 0 ? finalScore.toFixed(1) : '--'}</Text>
          <Text style={[styles.rankText, { color: theme.primary }]}>
            {finalScore >= 8 ? 'ENTHUSIAST TIER' : finalScore >= 5 ? 'HIGH-PERFORMANCE' : finalScore > 0 ? 'ENTRY LEVEL' : 'AWAITING HARDWARE'}
          </Text>
        </View>

        {/* Bottleneck Alerts */}
        {bottlenecks.length > 0 && (
          <View style={[styles.warningContainer, { backgroundColor: `${theme.danger}15`, borderColor: `${theme.danger}40` }]}>
            {bottlenecks.map((warning: string, index: number) => (
              <Text key={index} style={[styles.warningText, { color: theme.danger }]}>{warning}</Text>
            ))}
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>SYSTEM CONFIGURATION</Text>
        
        <View style={[styles.configContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          
          <TouchableOpacity style={styles.selectRow} onPress={() => openPicker('cpu')}>
            <Text style={[styles.rowLabel, { color: theme.textMuted }]}>CPU</Text>
            <View style={styles.rowSelection}>
              {cpu ? (
                <View style={styles.rowTextContainer}>
                  <Text style={[styles.rowValue, { color: theme.textMain }]}>{cpu.name}</Text>
                  <Text style={[styles.rowSubText, { color: cpu.brand === 'AMD' ? theme.danger : theme.primary }]}>
                    {cpu.brand} • Tier {cpu.tier}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.rowPlaceholder, { color: theme.textMuted }]}>Select Processor</Text>
              )}
              <Text style={[styles.chevron, { color: theme.border }]}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.selectRow} onPress={() => openPicker('gpu')}>
            <Text style={[styles.rowLabel, { color: theme.textMuted }]}>GPU</Text>
            <View style={styles.rowSelection}>
              {gpu ? (
                <View style={styles.rowTextContainer}>
                  <Text style={[styles.rowValue, { color: theme.textMain }]}>{gpu.name}</Text>
                  <Text style={[styles.rowSubText, { color: gpu.brand === 'AMD' ? theme.danger : theme.success }]}>
                    {gpu.brand} • Tier {gpu.tier}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.rowPlaceholder, { color: theme.textMuted }]}>Select Graphics</Text>
              )}
              <Text style={[styles.chevron, { color: theme.border }]}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.selectRow} onPress={() => openPicker('ram')}>
            <Text style={[styles.rowLabel, { color: theme.textMuted }]}>RAM</Text>
            <View style={styles.rowSelection}>
              {ram ? (
                <View style={styles.rowTextContainer}>
                  <Text style={[styles.rowValue, { color: theme.textMain }]}>{ram.size}</Text>
                  <Text style={[styles.rowSubText, { color: theme.textMuted }]}>{ram.brand} Memory</Text>
                </View>
              ) : (
                <Text style={[styles.rowPlaceholder, { color: theme.textMuted }]}>Select Memory</Text>
              )}
              <Text style={[styles.chevron, { color: theme.border }]}>›</Text>
            </View>
          </TouchableOpacity>

        </View>

        {finalScore > 0 && (
          <TouchableOpacity 
            style={[styles.fullBenchBtn, { backgroundColor: `${theme.primary}10`, borderColor: theme.primary }]} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setBenchmarksOpen(true);
            }}
          >
            <Text style={[styles.fullBenchBtnText, { color: theme.primary }]}>VIEW FULL SYNTHETIC SCORES</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* Modals */}
      <PartPickerModal visible={activePicker === 'cpu'} title="Select CPU" data={hardwareData.cpus} onClose={() => setActivePicker(null)} onSelect={setCPU} />
      <PartPickerModal visible={activePicker === 'gpu'} title="Select GPU" data={hardwareData.gpus} onClose={() => setActivePicker(null)} onSelect={setGPU} />
      <PartPickerModal visible={activePicker === 'ram'} title="Select RAM" data={hardwareData.ram} onClose={() => setActivePicker(null)} onSelect={setRAM} />
      <FullBenchmarksModal visible={benchmarksOpen} onClose={() => setBenchmarksOpen(false)} cpu={cpu} gpu={gpu} />

    </SafeAreaView>
  );
}

// Notice how we removed the hardcoded colors from the styles below!
// The layout stays here, but the colors are injected inline above.
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 30, paddingTop: 10 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  subtitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 2 },
  exportBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  
  card: { width: '100%', borderRadius: 24, padding: 30, alignItems: 'center', borderWidth: 1, marginBottom: 25 },
  scoreText: { fontSize: 56, fontWeight: '900', marginTop: 10 },
  rankText: { fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginTop: 5 },
  
  warningContainer: { width: '100%', padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 25 },
  warningText: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  
  sectionTitle: { alignSelf: 'flex-start', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 10, marginLeft: 5 },
  
  configContainer: { width: '100%', borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  selectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20 },
  divider: { height: 1, marginLeft: 20 },
  
  rowLabel: { fontSize: 14, fontWeight: 'bold' },
  rowSelection: { flexDirection: 'row', alignItems: 'center' },
  rowTextContainer: { alignItems: 'flex-end', marginRight: 12 },
  rowValue: { fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  rowSubText: { fontSize: 11, fontWeight: 'bold', marginTop: 3, letterSpacing: 0.5 },
  rowPlaceholder: { fontSize: 15, fontWeight: '600', marginRight: 12 },
  chevron: { fontSize: 26, fontWeight: '300', marginBottom: 3 },

  fullBenchBtn: { marginTop: 20, marginBottom: 40, width: '100%', padding: 18, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  fullBenchBtnText: { fontWeight: '900', letterSpacing: 1.5, fontSize: 13 }
});