import { BlurView } from 'expo-blur';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Modal, PanResponder, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { themes } from '../theme/themes';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const PartPickerModal = ({ visible, title, data, onClose, onSelect }: any) => {
  const { activeTheme } = useThemeStore();
  const theme = themes[activeTheme];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState('All');
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (visible) panY.setValue(0); }, [visible]);

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dy > 5,
    onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dy > 150 || gestureState.vy > 1.5) {
        Animated.timing(panY, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }).start(() => handleClose());
      } else {
        Animated.spring(panY, { toValue: 0, bounciness: 8, useNativeDriver: true }).start();
      }
    }
  })).current;

  const availableBrands = useMemo(() => {
    const brands = data.map((item: any) => item.brand).filter(Boolean);
    return ['All', ...new Set(brands)];
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = data;
    if (activeBrand !== 'All') filtered = filtered.filter((item: any) => item.brand === activeBrand);
    if (searchQuery) filtered = filtered.filter((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [searchQuery, activeBrand, data]);

  const handleClose = () => { setSearchQuery(''); setActiveBrand('All'); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <BlurView intensity={activeTheme === 'arcticLight' ? 80 : 40} tint={activeTheme === 'arcticLight' ? 'light' : 'dark'} style={styles.modalContainer}>
        <Animated.View style={[styles.content, { backgroundColor: theme.card, borderColor: theme.border, transform: [{ translateY: panY.interpolate({ inputRange: [0, SCREEN_HEIGHT], outputRange: [0, SCREEN_HEIGHT], extrapolate: 'clamp' }) }] }]}>
          
          <View {...panResponder.panHandlers} style={styles.swipeArea}>
            <View style={[styles.dragHandle, { backgroundColor: theme.border }]} />
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.textMain }]}>{title}</Text>
              <TouchableOpacity onPress={handleClose}><Text style={{ color: theme.textMuted, fontSize: 24, fontWeight: 'bold' }}>✕</Text></TouchableOpacity>
            </View>
          </View>

          {availableBrands.length > 2 && (
            <View style={{ marginBottom: 15 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {availableBrands.map((brand: any) => (
                  <TouchableOpacity 
                    key={brand} 
                    style={[styles.tabBtn, { backgroundColor: activeBrand === brand ? theme.primary : theme.background, borderColor: theme.border }]}
                    onPress={() => setActiveBrand(brand)}
                  >
                    <Text style={{ color: activeBrand === brand ? theme.background : theme.textMuted, fontWeight: 'bold' }}>{brand}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <TextInput
            style={[styles.searchInput, { backgroundColor: theme.background, color: theme.textMain, borderColor: theme.border }]}
            placeholder={`Search ${title}...`}
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isRam = !!item.size;
              const brandColor = item.brand === 'AMD' ? theme.danger : item.brand === 'NVIDIA' ? theme.success : theme.primary;
              return (
                <TouchableOpacity style={[styles.itemCard, { backgroundColor: theme.background, borderColor: theme.border }]} onPress={() => { onSelect(item); handleClose(); }}>
                  <View>
                    <Text style={[styles.itemName, { color: theme.textMain }]}>{isRam ? item.size : item.name}</Text>
                    <Text style={[styles.itemBrand, { color: brandColor }]}>{isRam ? `${item.brand} Memory` : item.brand}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: `${theme.primary}20` }]}>
                    <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 12 }}>{isRam ? `x${item.multiplier}` : `Tier ${item.tier}`}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  content: { height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingBottom: 20, borderWidth: 1 },
  swipeArea: { paddingTop: 12, paddingBottom: 10 },
  dragHandle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  title: { fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 10 },
  searchInput: { padding: 15, borderRadius: 15, fontSize: 16, marginBottom: 20, borderWidth: 1 },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  itemName: { fontSize: 18, fontWeight: '900' },
  itemBrand: { fontSize: 12, marginTop: 4, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }
});