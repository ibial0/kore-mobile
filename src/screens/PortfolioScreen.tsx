import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Pressable, TextInput } from 'react-native';
import { useWalletStore, SavedWallet } from '../store/useWalletStore';
import { TokenCard } from '../components/TokenCard';
import { colors } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';

export const PortfolioScreen = () => {
  const { wallets, isRefreshing, refreshAllWallets, addWallet } = useWalletStore();
  const [addressInput, setAddressInput] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);

  // Load a default wallet for demonstration if empty
  useEffect(() => {
    if (wallets.length === 0) {
      addWallet('0x71C000000000000000000000000000000000A92F', 'Main Wallet', 'MyWallets').catch(console.error);
    }
  }, []);

  const handleAddWallet = async () => {
    if (!addressInput) return;
    try {
      await addWallet(addressInput, 'New Wallet', 'Watchlist');
      setAddressInput('');
      setIsAdding(false);
    } catch (e: any) {
      alert(e.message || 'Failed to add wallet');
    }
  };

  const renderWallet = ({ item }: { item: SavedWallet }) => {
    if (!item.data) {
      return (
        <View style={styles.walletContainer}>
          <Text style={styles.walletTitle}>{item.label}</Text>
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
        </View>
      );
    }

    const nonSpamTokens = item.data.tokens.filter(t => !t.is_spam);

    return (
      <View style={styles.walletContainer}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>{item.label}</Text>
          <Text style={styles.walletTotal}>${item.data.total_value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        </View>
        
        {item.lastUpdated && (
          <Text style={styles.updatedText}>
            Updated {Math.floor((Date.now() - item.lastUpdated) / 1000)}s ago
          </Text>
        )}

        {nonSpamTokens.map(token => (
          <TokenCard key={token.id} token={token} />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Portfolio</Text>
        <Pressable onPress={() => setIsAdding(!isAdding)} style={styles.addButton}>
          <Plus color={colors.primary} size={24} />
        </Pressable>
      </View>

      {isAdding && (
        <View style={styles.addWalletForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter ARC address (0x...)"
            placeholderTextColor={colors.textSecondary}
            value={addressInput}
            onChangeText={setAddressInput}
          />
          <Pressable style={styles.submitBtn} onPress={handleAddWallet}>
            <Text style={styles.submitBtnText}>Add</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={wallets}
        keyExtractor={item => item.address}
        renderItem={renderWallet}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAllWallets}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No wallets tracked yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 20,
  },
  addWalletForm: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  walletContainer: {
    marginBottom: 32,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  walletTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  walletTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryGlow,
  },
  updatedText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  }
});
