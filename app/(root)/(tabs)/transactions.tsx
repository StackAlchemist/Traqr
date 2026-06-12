import { View, Text, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useEffect } from "react";
import { getTransactions } from "@/lib/transactions";


useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getTransactions();

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, []);

type Transaction = {
  id: string
  merchant: string
  amount: number
  category: string
  time: string
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
}

export default function Transactions() {
  const todayTransactions: Transaction[] = [
    { id: '1', merchant: 'Chicken Republic', amount: 7500,  category: 'Food',      time: '10:00 AM', icon: '🍗', source: 'screenshot' },
    { id: '2', merchant: 'Bolt',             amount: 4200,  category: 'Transport', time: '08:45 AM', icon: '🚖', source: 'bank'       },
  ]

  const yesterdayTransactions: Transaction[] = [
    { id: '3', merchant: 'Shoprite', amount: 18000, category: 'Shopping', time: '03:20 PM', icon: '🛒', source: 'receipt'    },
    { id: '4', merchant: 'MTN',      amount: 1000,  category: 'Bills',    time: '01:10 PM', icon: '📱', source: 'bank'       },
    { id: '5', merchant: 'Airtel',   amount: 5000,  category: 'Income',   time: '09:00 AM', icon: '💰', source: 'screenshot' },
  ]

  const mayTransactions: Transaction[] = [
    { id: '6',  merchant: 'Amazon',  amount: 12000, category: 'Shopping', time: '11:00 AM', icon: '🛒', source: 'receipt'    },
    { id: '7',  merchant: 'Netflix', amount: 4500,  category: 'Bills',    time: '12:00 PM', icon: '🎬', source: 'bank'       },
    { id: '8',  merchant: 'Spotify', amount: 2000,  category: 'Bills',    time: '12:00 PM', icon: '🎵', source: 'bank'       },
    { id: '9',  merchant: 'Jumia',   amount: 8500,  category: 'Shopping', time: '02:30 PM', icon: '📦', source: 'screenshot' },
    { id: '10', merchant: 'DSTV',    amount: 6000,  category: 'Bills',    time: '09:00 AM', icon: '📺', source: 'bank'       },
    { id: '11', merchant: 'Salary',  amount: 250000,category: 'Income',   time: '08:00 AM', icon: '💰', source: 'bank'       },
  ]

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
    const src = SOURCE_META[item.source]
    const catColor = CATEGORY_COLOR[item.category] ?? '#c0bbb4'
    const isIncome = item.category === 'Income'

    return (
      <View
        className={`bg-white px-4 py-3.5 flex-row items-center justify-between border-[#e8e4de]
          ${isOnly  ? 'rounded-2xl border'                              : ''}
          ${!isOnly && isFirst ? 'rounded-t-2xl border border-b-0'     : ''}
          ${!isOnly && isLast  ? 'rounded-b-2xl border border-t-[#f0ece6]' : ''}
          ${!isOnly && !isFirst && !isLast ? 'border-x border-b border-[#e8e4de] border-t-[#f0ece6]' : ''}
        `}
      >
        {/* Icon */}
        <View className="w-10 h-10 rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center mr-3 flex-shrink-0">
          <Text className="text-lg">{item.icon}</Text>
        </View>

        {/* Details */}
        <View className="flex-1">
          <Text className="text-[13px] font-medium text-[#1a1a1a] mb-1" numberOfLines={1}>
            {item.merchant}
          </Text>

          <View className="flex-row items-center gap-2 flex-wrap">
            {/* Category dot */}
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
              <Text className="text-[10px] text-[#c0bbb4]">{item.category}</Text>
            </View>

            <Text className="text-[10px] text-[#e8e4de]">·</Text>
            <Text className="text-[10px] text-[#c0bbb4]">{item.time}</Text>

            <Text className="text-[10px] text-[#e8e4de]">·</Text>

            {/* Source badge */}
            <View className="flex-row items-center gap-0.5 bg-[#f5f3ef] border border-[#e8e4de] rounded-full px-1.5 py-0.5">
              <Text style={{ fontSize: 9 }}>{src.emoji}</Text>
              <Text className="text-[9px] text-[#a8a49c]">{src.label}</Text>
            </View>
          </View>
        </View>

        {/* Amount */}
        <Text
          className="text-[15px] font-semibold tracking-tight ml-2"
          style={{ color: isIncome ? '#1db464' : '#1a1a1a' }}
        >
          {isIncome ? '+' : ''}₦{item.amount.toLocaleString()}
        </Text>
      </View>
    )
  }

  const Section = ({
    label,
    data,
  }: {
    label: string
    data: Transaction[]
  }) => {
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
              <Text className="text-[11px] text-[#0d7a4a]">324 transactions</Text>
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
                  isSelected
                    ? 'bg-[#1a3328] border-[#1a3328]'
                    : 'bg-white border-[#e8e4de]'
                }`}
              >
                <Text
                  className={`text-[12px] font-medium ${
                    isSelected ? 'text-white' : 'text-[#a8a49c]'
                  }`}
                >
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

        {/* Sections */}
        <Section label="TODAY"    data={todayTransactions}     />
        <Section label="YESTERDAY" data={yesterdayTransactions} />
        <Section label="MAY 2026" data={mayTransactions}       />
      </ScrollView>
    </SafeAreaView>
  )
}