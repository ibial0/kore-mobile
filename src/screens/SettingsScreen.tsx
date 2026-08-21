import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Eye, Database, ChevronRight } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useWalletStore, PrimaryMetric, TokenVisibility } from '../store/useWalletStore';

export const SettingsScreen = () => {
  const { primaryMetric, setPrimaryMetric, tokenVisibility, setTokenVisibility } = useWalletStore();

  const toggleMetric = () => {
    const metrics: PrimaryMetric[] = ['MarketCap', 'Price', 'FDV', 'Liquidity'];
    const idx = metrics.indexOf(primaryMetric);
    setPrimaryMetric(metrics[(idx + 1) % metrics.length]);
  };

  const toggleVisibility = () => {
    const states: TokenVisibility[] = ['All', 'Valuable', 'Hidden', 'Spam'];
    const idx = states.indexOf(tokenVisibility);
    setTokenVisibility(states[(idx + 1) % states.length]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.privacyBadge}>
          <Shield color={colors.success} size={24} style={styles.privacyIcon} />
          <View>
            <Text style={styles.privacyTitle}>Watch-Only Mode Active</Text>
            <Text style={styles.privacyDesc}>No private keys. No seed phrase.</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display Preferences</Text>
        
        <Pressable style={styles.settingRow} onPress={toggleMetric}>
          <View style={styles.settingLeft}>
            <Database color={colors.textSecondary} size={20} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Default Metric</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={styles.settingValue}>{primaryMetric}</Text>
            <ChevronRight color={colors.border} size={20} />
          </View>
        </Pressable>

        <Pressable style={styles.settingRow} onPress={toggleVisibility}>
          <View style={styles.settingLeft}>
            <Eye color={colors.textSecondary} size={20} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Token Visibility</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={styles.settingValue}>{tokenVisibility}</Text>
            <ChevronRight color={colors.border} size={20} />
          </View>
        </Pressable>
      </View>
      
      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>Kore Wallet Tracker v1.0.0</Text>
        <Text style={styles.aboutSub}>Powered by Indeix API</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 16,
    fontWeight: '600',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  privacyIcon: {
    marginRight: 16,
  },
  privacyTitle: {
    color: colors.success,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  privacyDesc: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    color: colors.text,
    fontSize: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 8,
    fontWeight: '500',
  },
  aboutSection: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 40,
  },
  aboutText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  aboutSub: {
    color: colors.border,
    fontSize: 12,
  }
});
