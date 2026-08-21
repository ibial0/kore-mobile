import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useWalletStore } from '../store/useWalletStore';

export const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const { addWallet } = useWalletStore();

  const handleSearch = () => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    
    // In a real app, this would query the backend API
    // For now, we mock finding an ARC wallet address
    if (/^0x[a-fA-F0-9]{40}$/i.test(searchQuery)) {
      setResults([searchQuery]);
    } else {
      setResults([]);
    }
  };

  const handleAddTrack = async (address: string) => {
    try {
      await addWallet(address, 'Tracked Wallet', 'Watchlist');
      alert('Wallet added to Watchlist!');
    } catch (e: any) {
      alert(e.message || 'Error adding wallet');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color={colors.textSecondary} size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search wallet, token, or contract..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (text.length > 5) handleSearch();
          }}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.resultsContainer}>
        {results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <View>
                  <Text style={styles.resultType}>Wallet Address</Text>
                  <Text style={styles.resultText}>
                    {item.substring(0, 6)}...{item.substring(item.length - 4)}
                  </Text>
                </View>
                <Pressable style={styles.trackBtn} onPress={() => handleAddTrack(item)}>
                  <Text style={styles.trackBtnText}>Track</Text>
                </Pressable>
              </View>
            )}
          />
        ) : (
          searchQuery.length > 0 && (
            <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
          )
        )}
        
        {searchQuery.length === 0 && (
          <View style={styles.trendingSection}>
            <Text style={styles.sectionTitle}>Trending Tokens</Text>
            {/* Mock Trending Tokens */}
            <View style={styles.trendingItem}>
              <Text style={styles.trendingName}>ARC</Text>
              <Text style={styles.trendingChange}>+4.5%</Text>
            </View>
            <View style={styles.trendingItem}>
              <Text style={styles.trendingName}>ETH</Text>
              <Text style={styles.trendingChange}>+2.1%</Text>
            </View>
          </View>
        )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 12,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  resultItem: {
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
  resultType: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  resultText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  trackBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  trendingSection: {
    marginTop: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trendingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  trendingName: {
    color: colors.text,
    fontSize: 16,
  },
  trendingChange: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '600',
  }
});
