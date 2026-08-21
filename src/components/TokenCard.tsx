import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Token } from '../api/client';
import { colors } from '../theme/colors';
import { useWalletStore } from '../store/useWalletStore';

import { formatCurrency } from '../utils/format';

interface TokenCardProps {
  token: Token;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const [expanded, setExpanded] = useState(false);
  const primaryMetric = useWalletStore(state => state.primaryMetric);

  const isPositive = (token.change_24h || 0) >= 0;

  const getMetricValue = () => {
    switch(primaryMetric) {
      case 'MarketCap': return formatCurrency(token.market_cap);
      case 'Price': return formatCurrency(token.price);
      case 'Liquidity': return '--'; // Not in mock yet
      case 'FDV': return '--'; // Not in mock yet
      default: return formatCurrency(token.market_cap);
    }
  };

  return (
    <Pressable 
      style={styles.card} 
      onPress={() => setExpanded(!expanded)}
      android_ripple={{ color: colors.surfaceHighlight }}
    >
      <View style={styles.header}>
        <View style={styles.leftGroup}>
          <Image 
            source={{ uri: token.logo_url || 'https://via.placeholder.com/40' }} 
            style={styles.logo}
          />
          <View style={styles.nameGroup}>
            <Text style={styles.symbol}>{token.symbol}</Text>
            <Text style={styles.name}>{token.name}</Text>
          </View>
        </View>

        <View style={styles.rightGroup}>
          <Text style={styles.balance}>{token.balance.toLocaleString()} {token.symbol}</Text>
          <Text style={styles.usdValue}>{formatCurrency(token.value_usd)}</Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.priceText}>{formatCurrency(token.price)}</Text>
        <Text style={styles.metricText}>{primaryMetric}: {getMetricValue()}</Text>
        <Text style={[styles.change, { color: isPositive ? colors.success : colors.danger }]}>
          {isPositive ? '+' : ''}{token.change_24h?.toFixed(2)}%
        </Text>
      </View>

      {expanded && (
        <View style={styles.expandedDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Volume 24h</Text>
            <Text style={styles.detailValue}>{formatCurrency(token.volume_24h)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Liquidity</Text>
            <Text style={styles.detailValue}>$84.2K</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Holders</Text>
            <Text style={styles.detailValue}>1,842</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Age</Text>
            <Text style={styles.detailValue}>12d</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#27272A',
  },
  nameGroup: {
    justifyContent: 'center',
  },
  symbol: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  rightGroup: {
    alignItems: 'flex-end',
  },
  balance: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  usdValue: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  metricText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
  },
  expandedDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
});
