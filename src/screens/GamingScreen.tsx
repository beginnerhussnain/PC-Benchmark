import * as Haptics from 'expo-haptics';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBuildStore } from '../store/useBuildStore';
import { useThemeStore } from '../store/useThemeStore';
import { themes } from '../theme/themes';

const GAMES_LIST = [
  { id: '1', name: 'Valorant', category: 'Esports', targetTier: 2, maxFps: 500, cpuBound: true },
  { id: '2', name: 'Counter-Strike 2', category: 'Esports', targetTier: 3, maxFps: 400, cpuBound: true },
  { id: '3', name: 'Fortnite', category: 'Esports', targetTier: 4, maxFps: 360, cpuBound: false },
  { id: '4', name: 'Call of Duty: Warzone', category: 'Esports', targetTier: 6, maxFps: 240, cpuBound: false },
  { id: '5', name: 'Grand Theft Auto V', category: 'AAA', targetTier: 3, maxFps: 180, cpuBound: true },
  { id: '6', name: 'The Witcher 3: Wild Hunt', category: 'AAA', targetTier: 4, maxFps: 144, cpuBound: false },
  { id: '7', name: 'Resident Evil 4 Remake', category: 'AAA', targetTier: 6, maxFps: 144, cpuBound: false },
  { id: '8', name: 'Forza Horizon 5', category: 'AAA', targetTier: 6, maxFps: 165, cpuBound: false },
  { id: '9', name: 'Spider-Man Remastered', category: 'AAA', targetTier: 7, maxFps: 144, cpuBound: true },
  { id: '10', name: 'Shadow of the Tomb Raider', category: 'AAA', targetTier: 5, maxFps: 165, cpuBound: false },
  { id: '11', name: 'Red Dead Redemption 2', category: 'AAA', targetTier: 7, maxFps: 120, cpuBound: false },
];

export default function GamingScreen({ navigation }: any) {
  const { cpu, gpu, ram } = useBuildStore();
  
  // Brought in the cycleTheme function
  const { activeTheme, cycleTheme } = useThemeStore();
  const theme = themes[activeTheme];

  const calculatePerformance = (game: any) => {
    if (!cpu || !gpu || !ram) return null;

    const primaryTier = game.cpuBound 
      ? (cpu.tier * 0.6 + gpu.tier * 0.4) 
      : (gpu.tier * 0.7 + cpu.tier * 0.3);
    
    const tierDiff = primaryTier - game.targetTier;
    
    let fps = 60 + (tierDiff * 25);
    fps = fps * (ram.multiplier || 1.0); 

    if (fps < 30) return { fps: Math.max(15, Math.floor(fps)), status: 'UNPLAYABLE', color: theme.danger, settings: 'Low (720p)' };
    if (fps < 60) return { fps: Math.floor(fps), status: 'PLAYABLE', color: theme.textMuted, settings: 'Medium (1080p)' };
    if (fps < 120) return { fps: Math.floor(fps), status: 'SMOOTH', color: theme.success, settings: 'High (1080p)' };
    return { fps: Math.min(game.maxFps, Math.floor(fps)), status: 'FLAWLESS', color: theme.primary, settings: 'Ultra (1440p)' };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Moved the ScrollView to wrap the entire screen, just like Dashboard */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header (Now perfectly matching Dashboard alignment and spacing) */}
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
              <Text style={[styles.title, { color: theme.textMain }]}>CAN I <Text style={{ color: theme.primary }}>RUN IT?</Text></Text>
              <Text style={[styles.subtitle, { color: theme.textMuted }]}>REAL-TIME FPS ESTIMATOR</Text>
            </View>
          </View>

          {/* Theme Switcher Button */}
          <TouchableOpacity 
            style={[styles.themeBtn, { borderColor: theme.border, backgroundColor: theme.card }]} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              cycleTheme();
            }}
          >
            <Text style={{ color: theme.textMain, fontSize: 16 }}>◐</Text>
          </TouchableOpacity>

        </View>

        {!cpu || !gpu ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyIcon, { color: theme.border }]}>🎮</Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>Select a CPU and GPU from the Dashboard to see game performance.</Text>
          </View>
        ) : (
          <>
            <View style={[styles.configBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.configLabel, { color: theme.textMuted }]}>CURRENT RIG:</Text>
              <Text style={[styles.configValue, { color: theme.textMain }]}>{gpu.name} + {cpu.name}</Text>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.primary }]}>ESPORTS & COMPETITIVE</Text>
            {GAMES_LIST.filter(g => g.category === 'Esports').map(game => (
              <GameCard key={game.id} game={game} perf={calculatePerformance(game)} theme={theme} />
            ))}

            <Text style={[styles.sectionTitle, { color: theme.primary, marginTop: 25 }]}>AAA MASTERPIECES</Text>
            {GAMES_LIST.filter(g => g.category === 'AAA').map(game => (
              <GameCard key={game.id} game={game} perf={calculatePerformance(game)} theme={theme} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const GameCard = ({ game, perf, theme }: any) => (
  <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <View style={styles.cardLeft}>
      <Text style={[styles.gameName, { color: theme.textMain }]}>{game.name}</Text>
      <Text style={[styles.gameSettings, { color: theme.textMuted }]}>Target: {perf?.settings || 'N/A'}</Text>
    </View>
    <View style={styles.cardRight}>
      <Text style={[styles.fpsText, { color: perf?.color || theme.textMuted }]}>{perf?.fps || '--'} <Text style={styles.fpsLabel}>FPS</Text></Text>
      <View style={[styles.badge, { backgroundColor: `${perf?.color || theme.textMuted}20` }]}>
        <Text style={[styles.badgeText, { color: perf?.color || theme.textMuted }]}>{perf?.status || 'UNKNOWN'}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Header is now flex-row to support the side-by-side elements
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  subtitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 2 },
  themeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyText: { textAlign: 'center', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  
  scrollContent: { padding: 20, paddingBottom: 50 },
  configBanner: { padding: 15, borderRadius: 16, borderWidth: 1, marginBottom: 25, alignItems: 'center' },
  configLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  configValue: { fontSize: 15, fontWeight: 'bold' },
  
  sectionTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 15, marginLeft: 5 },
  
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  cardLeft: { flex: 1 },
  gameName: { fontSize: 16, fontWeight: '900', marginBottom: 4 },
  gameSettings: { fontSize: 12, fontWeight: 'bold' },
  
  cardRight: { alignItems: 'flex-end' },
  fpsText: { fontSize: 22, fontWeight: '900', marginBottom: 6 },
  fpsLabel: { fontSize: 12, fontWeight: 'bold' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 }
});