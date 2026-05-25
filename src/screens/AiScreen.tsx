import * as Haptics from 'expo-haptics';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBuildStore } from '../store/useBuildStore';
import { useThemeStore } from '../store/useThemeStore';
import { themes } from '../theme/themes';

// The AI Model Database
const AI_MODELS = [
  // Large Language Models (LLMs)
  { id: '1', name: 'Llama 3 (8B)', type: 'LLM', quant: '4-bit GGUF', vramReq: 6, targetTier: 4 },
  { id: '2', name: 'Mistral Instruct (7B)', type: 'LLM', quant: '4-bit GGUF', vramReq: 5, targetTier: 4 },
  { id: '3', name: 'Phi-3 Mini (3.8B)', type: 'LLM', quant: '4-bit GGUF', vramReq: 3, targetTier: 2 },
  { id: '4', name: 'DeepSeek Coder (33B)', type: 'LLM', quant: '4-bit EXL2', vramReq: 20, targetTier: 8 },
  
  // Computer Vision & Generation
  { id: '5', name: 'Stable Diffusion XL', type: 'Vision', quant: 'FP16', vramReq: 12, targetTier: 7 },
  { id: '6', name: 'Stable Diffusion 1.5', type: 'Vision', quant: 'FP16', vramReq: 6, targetTier: 4 },
  { id: '7', name: 'YOLOv10 (Real-Time)', type: 'Vision', quant: 'FP16', vramReq: 4, targetTier: 3 },
  
  // Audio & Multi-modal
  { id: '8', name: 'Whisper Large V3', type: 'Audio', quant: 'FP16', vramReq: 10, targetTier: 6 },
  { id: '9', name: 'LLaVA (Vision-Language)', type: 'Multi-modal', quant: '4-bit GGUF', vramReq: 8, targetTier: 5 },
];

export default function AiScreen({ navigation }: any) {
  const { cpu, gpu, ram } = useBuildStore();
  const { activeTheme, cycleTheme } = useThemeStore();
  const theme = themes[activeTheme];

  // AI Performance Estimation Logic
  const calculateInference = (model: any) => {
    if (!cpu || !gpu || !ram) return null;

    // VRAM is the ultimate gatekeeper for AI
    // We assume higher GPU tiers generally have more VRAM
    const estimatedVram = gpu.tier * 2; 
    
    // Check if the system has enough total RAM for CPU fallback
    const hasEnoughSysRam = parseInt(ram.size) >= model.vramReq * 1.5;

    if (estimatedVram >= model.vramReq && gpu.tier >= model.targetTier) {
      return { status: 'OPTIMAL', speed: 'High Tokens/s', color: theme.primary, method: 'GPU Accelerated' };
    } 
    if (estimatedVram >= model.vramReq && gpu.tier < model.targetTier) {
      return { status: 'CAPABLE', speed: 'Moderate', color: theme.success, method: 'GPU Accelerated' };
    }
    if (estimatedVram < model.vramReq && hasEnoughSysRam) {
      return { status: 'SLOW', speed: '1-5 Tokens/s', color: '#eab308', method: 'CPU Fallback (RAM)' };
    }
    
    return { status: 'INSUFFICIENT', speed: 'Out of Memory', color: theme.danger, method: 'Upgrade Required' };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Global Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
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
              <Text style={[styles.title, { color: theme.textMain }]}>AI <Text style={{ color: theme.primary }}>COMPUTE</Text></Text>
              <Text style={[styles.subtitle, { color: theme.textMuted }]}>LOCAL INFERENCE BENCHMARK</Text>
            </View>
          </View>

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
            <Text style={[styles.emptyIcon, { color: theme.border }]}>🧠</Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>Select hardware to see which neural network models you can run locally.</Text>
          </View>
        ) : (
          <>
            <View style={[styles.configBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.configLabel, { color: theme.textMuted }]}>INFERENCE HARDWARE:</Text>
              <Text style={[styles.configValue, { color: theme.textMain }]}>{gpu.name} (CUDA/OpenCL)</Text>
            </View>

            {/* Render Model Categories */}
            {['LLM', 'Vision', 'Audio', 'Multi-modal'].map(category => {
              const categoryModels = AI_MODELS.filter(m => m.type === category);
              if (categoryModels.length === 0) return null;

              return (
                <View key={category}>
                  <Text style={[styles.sectionTitle, { color: theme.primary, marginTop: 20 }]}>
                    {category === 'LLM' ? 'LARGE LANGUAGE MODELS' : 
                     category === 'Vision' ? 'COMPUTER VISION & GENERATION' : 
                     category.toUpperCase()}
                  </Text>
                  
                  {categoryModels.map(model => (
                    <AiCard key={model.id} model={model} perf={calculateInference(model)} theme={theme} />
                  ))}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// The AI Model Card Component
const AiCard = ({ model, perf, theme }: any) => (
  <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <View style={styles.cardLeft}>
      <Text style={[styles.modelName, { color: theme.textMain }]}>{model.name}</Text>
      <Text style={[styles.modelDetails, { color: theme.textMuted }]}>
        {model.quant} • Requires ~{model.vramReq}GB VRAM
      </Text>
    </View>
    <View style={styles.cardRight}>
      <Text style={[styles.methodText, { color: theme.textMain }]}>{perf?.method || '--'}</Text>
      <View style={[styles.badge, { backgroundColor: `${perf?.color || theme.textMuted}20` }]}>
        <Text style={[styles.badgeText, { color: perf?.color || theme.textMuted }]}>{perf?.status || 'UNKNOWN'}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 50 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 30, paddingTop: 10, paddingBottom: 15, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  subtitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 2 },
  themeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 50 },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyText: { textAlign: 'center', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  
  configBanner: { padding: 15, borderRadius: 16, borderWidth: 1, marginBottom: 15, alignItems: 'center' },
  configLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  configValue: { fontSize: 15, fontWeight: 'bold' },
  
  sectionTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 15, marginLeft: 5 },
  
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  cardLeft: { flex: 1, paddingRight: 10 },
  modelName: { fontSize: 16, fontWeight: '900', marginBottom: 6 },
  modelDetails: { fontSize: 12, fontWeight: '700' },
  
  cardRight: { alignItems: 'flex-end', justifyContent: 'center' },
  methodText: { fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 }
});