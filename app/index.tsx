import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Theme Imports
import { useThemeStore } from '../src/store/useThemeStore';
import { themes } from '../src/theme/themes';

import AiScreen from '../src/screens/AiScreen';
import Dashboard from '../src/screens/Dashboard';
import GamingScreen from '../src/screens/GamingScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  const { activeTheme } = useThemeStore();
  const theme = themes[activeTheme];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* We removed NavigationContainer here! Let Expo Router handle it. */}
      <Drawer.Navigator
        screenOptions={{
          headerShown: false, 
          drawerStyle: {
            backgroundColor: theme.card, 
            width: 280,
            borderRightWidth: 1,
            borderColor: theme.border 
          },
          drawerActiveTintColor: theme.primary, 
          drawerInactiveTintColor: theme.textMuted, 
          drawerLabelStyle: { fontWeight: '900', letterSpacing: 1, fontSize: 14 },
          drawerActiveBackgroundColor: `${theme.primary}15`, 
        }}
      >
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Can I Run It?" component={GamingScreen} />
        <Drawer.Screen name="AI Models" component={AiScreen} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}