import { View, Text, FlatList, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-gifted-charts";
import { getChartData, getRecentTransactions, getTopCategories, getAIInsight } from "@/lib/transactions";

export default function Home() {

  const [topCategories, setTopCategories] = useState([]);  
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsightLoading, setAiInsightLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<{ insight: string; tips: string[] } | null>(null)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [categories, recent, chart] = await Promise.all([
          getTopCategories(),
          getRecentTransactions(),
          getChartData(),
        ])
        setTopCategories(categories.data)
        setRecentTransactions(recent.data)
        setChartData(chart.data)
        console.log('chartData', chart.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  useEffect(() => {
    const fetchAiInsight = async () => {
      try {
        setAiInsightLoading(true)
        const data = await getAIInsight()
        console.log('aiInsight raw response:', JSON.stringify(data))  // ← add this
        setAiInsight(data.data)
      } catch (error) {
        console.error('aiInsight error:', error)  // ← and this
      } finally {
        setAiInsightLoading(false)
      }
    }
    fetchAiInsight()
  }, [])

  const cat_icons = {

    FOOD: "🍔",
    TRANSPORT: "🚗",
    SHOPPING: "🛍️",
    BILLS: "💰",
    HEALTH: "💪",
    EDUCATION: "🎓",
    DATA: "📱",
    AIRTIME: "📱",
    TRANSFER: "💰",
    ENTERTAINMENT: "🎉",
    OTHER: "💰",
  }



  const sparklineData = chartData.map((item) => ({ value: item.total }));

  if (loading) { 
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1db464" />
      </View>
    )
  }

  const renderCategory = ({ item, index }) => (
    <View className="bg-white border border-[#e8e4de] rounded-2xl p-4 mb-2.5 flex-row items-center justify-between overflow-hidden relative">
      {/* Color percentage bar (colored, visible, full height overlay) */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${item.percentage}%`,
          backgroundColor: item.barColor || "#1db464",
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          opacity: 0.14, // increased opacity for more visible color
          zIndex: 0,
        }}
      />
      <View className="flex-row items-center gap-3.5" style={{ zIndex: 1 }}>
        <View className="w-[38px] h-[38px] rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center">
          <Text className="text-lg">{cat_icons[item.category]}</Text>
        </View>
        <View>
          <Text className="text-[13px] text-[#2a2a2a] mb-0.5">
            {item.category}
          </Text>
          <Text className="text-[11px] text-[#c0bbb4]">
            {item.percentage}% of spending
          </Text>
        </View>
      </View>
      <Text className="text-[19px] text-[#1a1a1a] tracking-tight" style={{ zIndex: 1 }}>
        ₦{item.total.toLocaleString()}
      </Text>
    </View>
  );

  const renderTransaction = ({ item, index }) => {
    const isFirst = index === 0
    const isLast  = index === recentTransactions.length - 1
  
    const dateObj = item.transactionAt ?? item.createdAt
    const date    = new Date(dateObj).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const icon    = cat_icons[item.category] ?? '💳'
  
    return (
      <View className={`bg-white px-[18px] py-[15px] flex-row items-center justify-between border-[#e8e4de]
        ${isFirst ? "rounded-t-2xl border border-b-0" : ""}
        ${isLast  ? "rounded-b-2xl border border-t-[#f0ece6]" : ""}
        ${!isFirst && !isLast ? "border-x border-b border-[#e8e4de] border-t-[#f0ece6]" : ""}
      `}>
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-[38px] h-[38px] rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center">
            <Text className="text-[17px]">{icon}</Text>
          </View>
          <View>
            <Text className="text-[13px] text-[#2a2a2a] mb-0.5">{item.merchant}</Text>
            <Text className="text-[11px] text-[#c0bbb4]">{item.category} · {date}</Text>
          </View>
        </View>
        <Text className="text-[18px] text-[#1a1a1a] tracking-tight">
          ₦{item.amount.toLocaleString()}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f5f3ef]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-5">
          <View>
            <Text className="text-[10px] text-[#a8a49c] tracking-[2px] mb-0.5">
              {`GOOD ${new Date().getHours() < 12 ? 'MORNING' : new Date().getHours() < 18 ? 'AFTERNOON' : 'EVENING'}`}
            </Text>
            <Text className="text-[30px] text-[#1a1a1a] tracking-tight">
              Olamide
            </Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-[#1a3328] border border-[#e8e4de] items-center justify-center">
            <Text className="text-[17px] text-white">O</Text>
          </View>
        </View>

        {/* Insight pill */}
        <View className="flex-row items-center self-start gap-1.5 mt-3.5 mx-6 bg-[#eaf7f0] border border-[#b6e8ce] rounded-full px-3 py-[5px]">
          <View className="w-[5px] h-[5px] rounded-full bg-[#1db464]" />
          <Text className="text-[11px] text-[#0d7a4a] tracking-[0.3px]">
            Spending 12% lower this week
          </Text>
        </View>

        {/* Balance card */}
        <View className="mx-6 mt-5 rounded-[22px] overflow-hidden">
          <LinearGradient
            colors={["#1a3328", "#0f2218", "#1a3328"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 26, borderRadius: 22 }}
          >
            {/* Glow */}
            <View
              pointerEvents="none"
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#1db464] opacity-[0.12]"
            />

            <Text className="text-[10px] text-white/30 tracking-[2.5px] mb-2.5">
              SPENT THIS MONTH
            </Text>

            <View className="flex-row items-start">
              <Text className="text-[20px] text-white/35 mt-1.5 mr-0.5">₦</Text>
              <Text className="text-[46px] text-white leading-[52px] -tracking-[2px]">
                ₦{chartData.reduce((acc, item) => acc + item.total, 0).toLocaleString()}
              </Text>
            </View>

            <LineChart
              areaChart
              hideDataPoints
              hideYAxisText
              hideAxesAndRules
              color="#5de8a0"
              startFillColor="#5de8a0"
              endFillColor="#5de8a0"
              startOpacity={0.2}
              endOpacity={0.02}
              data={sparklineData}
              height={44}
              spacing={42}
              initialSpacing={0}
              thickness={1.5}
            />

            <View className="flex-row items-center justify-between mt-4 pt-3.5 border-t border-white/[0.08]">
              <View className="flex-row items-center gap-1.5">
                <View className="w-[5px] h-[5px] rounded-full bg-[#1db464]" />
                <Text className="text-[11px] text-white/30 tracking-[0.5px]">
                  May 2026
                </Text>
              </View>
              <View className="bg-[#1db464]/15 border border-[#1db464]/25 rounded-full px-2.5 py-[3px]">
                <Text className="text-[10px] text-[#5de8a0] tracking-[0.5px]">
                  ↓ 12% vs last month
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View className="flex-row items-center justify-between px-6 pt-7 pb-3.5">
          <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px]">
            TOP CATEGORIES
          </Text>
        </View>

        <FlatList
          data={topCategories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />

{/* AI Insight */}
<View className="mx-6 mt-2.5 bg-white border-[0.5px] border-[#e8e4de] border-l-2 border-l-[#1db464] rounded-tr-2xl rounded-br-2xl p-4">
  <Text className="text-[10px] text-[#1db464] tracking-[2px] mb-1">
    AI INSIGHT
  </Text>
  {aiInsightLoading ? (
    <ActivityIndicator size="small" color="#1db464" />
  ) : (
    <>
      <Text className="text-[12px] text-[#888079] leading-[18px]">
        {aiInsight?.insight ?? "No insight available."}
      </Text>
      {/* {aiInsight?.tips?.map((tip, i) => (
        <Text key={i} className="text-[12px] text-[#888079] leading-[18px] mt-1">
          • {tip}
        </Text>
      ))} */}
    </>
  )}
</View>

        {/* Recent Activity */}
        <View className="flex-row items-center justify-between px-6 pt-7 pb-3.5">
          <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px]">
            RECENT ACTIVITY
          </Text>
          <Text className="text-[12px] text-[#1db464]">
            See all
          </Text>
        </View>

        <FlatList
          data={recentTransactions.slice(0, 2)}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}