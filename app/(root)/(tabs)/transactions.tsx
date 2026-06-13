import { View, Text, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useEffect } from "react";
import { getTransactions } from "@/lib/transactions";



type Transaction = {
  id: string
  merchant: string
  amount: number
  category: string
  time: string
  date: string        // ← added: ISO date string "2026-06-13"
  icon: string
  source: 'receipt' | 'screenshot' | 'bank'
}

const SOURCE_META = {
  receipt:    { label: 'Receipt',        emoji: '📄' },
  screenshot: { label: 'Screenshot',     emoji: '📱' },
  bank:       { label: 'Bank Statement', emoji: '🏦' },
}

const CATEGORY_COLOR: Record<string, string> = {
  Food:      '#FFB020',
  Transport: '#4DA3FF',
  Shopping:  '#A78BFA',
  Bills:     '#FF6B6B',
  Income:    '#2EE6A6',
  Transfer:  '#60A5FA',  // ← add this
}

// ── Date helpers ────────────────────────────────────────────────────────────

function toDateKey(dateVal: string | Date): string {
  // Returns "2026-06-13"
  return new Date(dateVal).toISOString().split('T')[0]
}

function getSectionLabel(dateKey: string): string {
  const today     = toDateKey(new Date())
  const yesterday = toDateKey(new Date(Date.now() - 86_400_000))

  if (dateKey === today)     return 'TODAY'
  if (dateKey === yesterday) return 'YESTERDAY'

  // e.g. "JUNE 2026"
  return new Date(dateKey).toLocaleDateString('en-US', {
    month: 'long',
    year:  'numeric',
  }).toUpperCase()
}

// Groups an array of transactions into ordered sections: [{ label, data }]
function getGroupKey(dateKey: string): string {
  const today     = toDateKey(new Date())
  const yesterday = toDateKey(new Date(Date.now() - 86_400_000))

  if (dateKey === today)     return 'today'
  if (dateKey === yesterday) return 'yesterday'

  // Group everything else by month: "2026-05"
  return dateKey.slice(0, 7)
}



function groupByDate(transactions: Transaction[]) {
  const map = new Map<string, Transaction[]>()

  for (const t of transactions) {
    const key = getGroupKey(t.date)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(t)
  }

  const sortedKeys = [...map.keys()].sort((a, b) => b.localeCompare(a))

  return sortedKeys.map((key) => ({
    label: getSectionLabel(key),
    data:  map.get(key)!,
  }))
}
// ────────────────────────────────────────────────────────────────────────────

export default function Transactions() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransactions();
        console.log('getTransactions response:', data);
        setTransactions(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CATEGORY_MAP: Record<string, string> = {
    DATA:        'Bills',
    AIRTIME:     'Bills',
    TRANSFER:    'Transfer',
    FOOD:        'Food',
    TRANSPORT:   'Transport',
    SHOPPING:    'Shopping',
    INCOME:      'Income',
    
    // add more as your AI starts returning new categories
  }
  
  const mappedTransactions: Transaction[] = transactions.map((transaction) => {
    const dateObj = transaction.transactionAt
      ? new Date(transaction.transactionAt)
      : new Date(transaction.createdAt)
  
    return {
      id:       transaction.id,
      merchant: transaction.merchant,
      amount:   transaction.amount,
      category: CATEGORY_MAP[transaction.category] ?? transaction.category,
      date:     toDateKey(dateObj),
      time:     dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon:     '💳',
      source:
        transaction.source === 'RECEIPT'   ? 'receipt'    :
        transaction.source === 'STATEMENT' ? 'bank'       :
                                             'screenshot',
    }
  });

  const totalSpent = mappedTransactions
    .filter((t) => t.category !== 'Income')   // optional: exclude income
    .reduce((sum, t) => sum + t.amount, 0);

  const sections = groupByDate(mappedTransactions);   // ← the grouped data

  const filters = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Income']
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [query, setQuery] = useState('')

  const filterData = (data: Transaction[]) =>
    data.filter((t) => {
      const matchesFilter = selectedFilter === 'All' || t.category === selectedFilter
      const matchesQuery  = t.merchant.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })

  const renderTransaction = (
    { item, index }: { item: Transaction; index: number },
    total: number
  ) => {
    const isFirst = index === 0
    const isLast  = index === total - 1
    const isOnly  = total === 1
    const src      = SOURCE_META[item.source]
    const catColor = CATEGORY_COLOR[item.category] ?? '#c0bbb4'
    const isIncome = item.category === 'Income'

    return (
      <View
        className={`bg-white px-4 py-3.5 flex-row items-center justify-between border-[#e8e4de]
          ${isOnly  ? 'rounded-2xl border'                                  : ''}
          ${!isOnly && isFirst ? 'rounded-t-2xl border border-b-0'         : ''}
          ${!isOnly && isLast  ? 'rounded-b-2xl border border-t-[#f0ece6]' : ''}
          ${!isOnly && !isFirst && !isLast ? 'border-x border-b border-[#e8e4de] border-t-[#f0ece6]' : ''}
        `}
      >
        <View className="w-10 h-10 rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center mr-3 flex-shrink-0">
          <Text className="text-lg">{item.icon}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-[13px] font-medium text-[#1a1a1a] mb-1" numberOfLines={1}>
            {item.merchant}
          </Text>
          <View className="flex-row items-center gap-2 flex-wrap">
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
              <Text className="text-[10px] text-[#c0bbb4]">{item.category}</Text>
            </View>
            <Text className="text-[10px] text-[#e8e4de]">·</Text>
            <Text className="text-[10px] text-[#c0bbb4]">{item.time}</Text>
            <Text className="text-[10px] text-[#e8e4de]">·</Text>
            <View className="flex-row items-center gap-0.5 bg-[#f5f3ef] border border-[#e8e4de] rounded-full px-1.5 py-0.5">
              <Text style={{ fontSize: 9 }}>{src.emoji}</Text>
              <Text className="text-[9px] text-[#a8a49c]">{src.label}</Text>
            </View>
          </View>
        </View>

        <Text
          className="text-[15px] font-semibold tracking-tight ml-2"
          style={{ color: isIncome ? '#1db464' : '#1a1a1a' }}
        >
          {isIncome ? '+' : ''}₦{item.amount.toLocaleString()}
        </Text>
      </View>
    )
  }

  const Section = ({ label, data }: { label: string; data: Transaction[] }) => {
    const filtered = filterData(data)
    if (filtered.length === 0) return null
    return (
      <>
        <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mt-7 mb-3">
          {label}
        </Text>
        <FlatList
          data={filtered}
          renderItem={(props) => renderTransaction(props, filtered.length)}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f5f3ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64, paddingHorizontal: 24 }}
      >
        {/* Header */}
        <View className="pt-5 mb-5">
          <Text className="text-[28px] font-semibold text-[#1a1a1a] tracking-tight mb-2">
            Transactions
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1.5 bg-[#eaf7f0] border border-[#b6e8ce] rounded-full px-3 py-1">
              <Text className="text-[11px] text-[#0d7a4a]">
                ₦{totalSpent.toLocaleString()} spent
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5 bg-white border border-[#e8e4de] rounded-full px-3 py-1">
              <Text className="text-[11px] text-[#8c857b]">
                {mappedTransactions.length} transactions
              </Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white border border-[#e8e4de] rounded-2xl px-4 py-3 gap-3">
          <Ionicons name="search-outline" size={17} color="#c0bbb4" />
          <TextInput
            placeholder="Search transactions..."
            placeholderTextColor="#c0bbb4"
            value={query}
            onChangeText={setQuery}
            className="flex-1 text-[13px] text-[#1a1a1a]"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color="#c0bbb4" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 14, gap: 8 }}
        >
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full border ${
                  isSelected ? 'bg-[#1a3328] border-[#1a3328]' : 'bg-white border-[#e8e4de]'
                }`}
              >
                <Text className={`text-[12px] font-medium ${isSelected ? 'text-white' : 'text-[#a8a49c]'}`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Source legend */}
        <View className="flex-row items-center gap-3 mb-1">
          {Object.values(SOURCE_META).map((s) => (
            <View key={s.label} className="flex-row items-center gap-1">
              <Text style={{ fontSize: 11 }}>{s.emoji}</Text>
              <Text className="text-[10px] text-[#c0bbb4]">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Sections — now fully dynamic */}
        {loading ? (
          <Text className="text-[13px] text-[#c0bbb4] text-center mt-10">
            Loading transactions...
          </Text>
        ) : sections.length === 0 ? (
          <Text className="text-[13px] text-[#c0bbb4] text-center mt-10">
            No transactions yet.
          </Text>
        ) : (
          sections.map((section) => (
            <Section key={section.label} label={section.label} data={section.data} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}