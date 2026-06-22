import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart, LineChart } from "react-native-gifted-charts";
import {
  getTopCategories,
  getChartData,
  getAIInsight,
  getTopMerchants,
  getBiggestTransaction,
  getMonthlyComparison,
  getHeatmap,
} from "@/lib/transactions";

const CATEGORY_COLOR: Record<string, string> = {
  FOOD:          "#2EE6A6",
  TRANSPORT:     "#4DA3FF",
  SHOPPING:      "#A78BFA",
  BILLS:         "#FFB020",
  DATA:          "#FF6B6B",
  AIRTIME:       "#60A5FA",
  TRANSFER:      "#F472B6",
  ENTERTAINMENT: "#FB923C",
  OTHER:         "#c0bbb4",
}

const CAT_ICONS: Record<string, string> = {
  FOOD: "🍔", TRANSPORT: "🚗", SHOPPING: "🛍️",
  BILLS: "💰", HEALTH: "💪", EDUCATION: "🎓",
  DATA: "📱", AIRTIME: "📱", TRANSFER: "💸",
  ENTERTAINMENT: "🎉", OTHER: "💰",
}

const getHeatColor = (amount: number) => {
  if (amount === 0)       return "#e8e4de"
  if (amount < 3000)      return "#b6e8ce"
  if (amount < 7000)      return "#4db87a"
  if (amount < 10000)     return "#1db464"
  return "#0d7a4a"
}

export default function Insights() {
  const [loading, setLoading]                   = useState(true)
  const [aiLoading, setAiLoading]               = useState(true)
  const [topCategories, setTopCategories]       = useState<any[]>([])
  const [chartData, setChartData]               = useState<any[]>([])
  const [topMerchants, setTopMerchants]         = useState<any[]>([])
  const [biggestTx, setBiggestTx]               = useState<any>(null)
  const [monthlyData, setMonthlyData]           = useState<any>(null)
  const [heatmapData, setHeatmapData]           = useState<any[]>([])
  const [aiInsight, setAiInsight]               = useState<{ insight: string; tips: string[] } | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [categories, chart, merchants, biggest, monthly, heatmap] =
          await Promise.all([
            getTopCategories(),
            getChartData(),
            getTopMerchants(),
            getBiggestTransaction(),
            getMonthlyComparison(),
            getHeatmap(),
          ])

          console.log('categories:', categories)
console.log('chart:', chart)
console.log('merchants:', merchants)
console.log('biggest:', biggest)
console.log('monthly:', monthly)
console.log('heatmap:', heatmap)

        setTopCategories(categories.data ?? [])
        setChartData(chart.data ?? [])
        setTopMerchants(merchants.data ?? [])
        setBiggestTx(biggest.data ?? null)
        setMonthlyData(monthly.data ?? null)
        setHeatmapData(heatmap.data ?? [])
      } catch (error) {
        console.error("Insights fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  useEffect(() => {
    const fetchAI = async () => {
      try {
        setAiLoading(true)
        const data = await getAIInsight()
        setAiInsight(data.data)
      } catch (error) {
        console.error("AI insight error:", error)
      } finally {
        setAiLoading(false)
      }
    }
    fetchAI()
  }, [])

  // ── Derived data ────────────────────────────────────────────────

  const pieData = topCategories.map((c) => ({
    value: c.total,
    color: CATEGORY_COLOR[c.category] ?? "#c0bbb4",
    label: c.category,
  }))

  const trendData = chartData.map((d) => ({ value: d.total }))

  const totalSpent = chartData.reduce((s, d) => s + d.total, 0)

  // Build heatmap: last 5 weeks × 7 days grid
  const days  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weeks = ["W1", "W2", "W3", "W4", "W5"]

  const heatGrid: number[][] = Array.from({ length: 7 }, () =>
    Array(5).fill(0)
  )
  heatmapData.forEach(({ day, total }) => {
    const d   = new Date(day)
    const dow = (d.getDay() + 6) % 7  // Mon=0 … Sun=6
    // bucket into W1-W5 by date of month
    const weekIdx = Math.min(Math.floor((d.getDate() - 1) / 7), 4)
    heatGrid[dow][weekIdx] += total
  })

  const maxAmount = Math.max(
    monthlyData?.thisMonth ?? 1,
    monthlyData?.lastMonth ?? 1
  )

  const changeAbs  = Math.abs(monthlyData?.change ?? 0)
  const changeDown = (monthlyData?.change ?? 0) <= 0

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f5f3ef]">
        <ActivityIndicator size="large" color="#1db464" />
      </View>
    )
  }

  // ── Render helpers ───────────────────────────────────────────────

  const renderMerchant = ({ item, index }: { item: any; index: number }) => {
    const isFirst = index === 0
    const isLast  = index === topMerchants.length - 1
    return (
      <View className={`bg-white px-4 py-[14px] flex-row items-center justify-between
        ${isFirst ? "rounded-t-2xl border border-b-0 border-[#e8e4de]" : ""}
        ${isLast  ? "rounded-b-2xl border border-t-[#f0ece6] border-[#e8e4de]" : ""}
        ${!isFirst && !isLast ? "border-x border-b border-[#e8e4de] border-t-[#f0ece6]" : ""}
      `}>
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-9 h-9 rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center">
            <Text className="text-base">🏪</Text>
          </View>
          <Text className="text-[13px] text-[#2a2a2a]" numberOfLines={1}>
            {item.merchant}
          </Text>
        </View>
        <Text className="text-[17px] text-[#1a1a1a] tracking-tight">
          ₦{item.total.toLocaleString()}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f5f3ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 64 }}
      >
        {/* Header */}
        <Text className="text-[30px] font-semibold text-[#1a1a1a] tracking-tight mb-1">
          Insights
        </Text>
        <Text className="text-[12px] text-[#a8a49c] mb-7">
          {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })} · your full breakdown
        </Text>

        {/* ── Spending Breakdown ── */}
        <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mb-3">
          SPENDING BREAKDOWN
        </Text>
        <View className="bg-white border border-[#e8e4de] rounded-[18px] p-5">
          {pieData.length > 0 ? (
            <View className="flex-row items-center gap-5">
              <PieChart
                data={pieData}
                donut
                radius={55}
                innerRadius={34}
                innerCircleColor="#ffffff"
                showText={false}
              />
              <View className="flex-1 gap-y-2.5">
                {pieData.map((item) => (
                  <View key={item.label} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <View className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <Text className="text-[12px] text-[#2a2a2a]">{item.label}</Text>
                    </View>
                    <Text className="text-[14px] font-medium text-[#1a1a1a]">
                      ₦{item.value.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text className="text-[13px] text-[#c0bbb4] text-center py-4">No data yet</Text>
          )}
        </View>

        {/* ── Spending Trend ── */}
        <View className="bg-[#1a3328] rounded-[18px] overflow-hidden p-5 mt-3">
          <Text className="text-[10px] text-white/30 tracking-[2.5px] mb-4">
            SPENDING TREND
          </Text>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[28px] font-semibold text-white tracking-tight">
              ₦{totalSpent.toLocaleString()}
            </Text>
            {monthlyData && (
              <View className="bg-[#1db464]/15 border border-[#1db464]/25 rounded-full px-2.5 py-[3px]">
                <Text className="text-[11px] text-[#5de8a0]">
                  {changeDown ? "↓" : "↑"} {changeAbs}% vs last month
                </Text>
              </View>
            )}
          </View>
          {trendData.length > 1 ? (
            <LineChart
              areaChart
              data={trendData}
              color="#2EE6A6"
              startFillColor="#2EE6A6"
              endFillColor="#2EE6A6"
              startOpacity={0.22}
              endOpacity={0.02}
              hideDataPoints
              hideYAxisText
              hideAxesAndRules
              thickness={2}
              height={80}
              spacing={72}
              initialSpacing={8}
            />
          ) : (
            <Text className="text-[12px] text-white/30 py-4">Not enough data for trend</Text>
          )}
          <View className="border-t border-white/[0.08] mt-4 pt-3 flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-[#5de8a0]" />
            <Text className="text-[11px] text-white/40">
              {chartData.length} days tracked this month
            </Text>
          </View>
        </View>

        {/* ── AI Insight ── */}
        <View className="bg-white border border-[#e8e4de] border-l-2 border-l-[#1db464] rounded-tr-2xl rounded-br-2xl p-4 mt-3">
          <Text className="text-[10px] text-[#1db464] tracking-[2px] mb-1">
            AI INSIGHT
          </Text>
          {aiLoading ? (
            <ActivityIndicator size="small" color="#1db464" />
          ) : aiInsight ? (
            <>
              <Text className="text-[12px] text-[#888079] leading-[18px] mb-1">
                {aiInsight.insight}
              </Text>
              {aiInsight.tips?.map((tip, i) => (
                <Text key={i} className="text-[12px] text-[#888079] leading-[18px] mt-1">
                  • {tip}
                </Text>
              ))}
            </>
          ) : (
            <Text className="text-[12px] text-[#888079] leading-[18px]">
              Could not load insight.
            </Text>
          )}
        </View>

        {/* ── Top Merchants ── */}
        <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mt-7 mb-3">
          TOP MERCHANTS
        </Text>
        <FlatList
          data={topMerchants}
          renderItem={renderMerchant}
          keyExtractor={(item) => item.merchant}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text className="text-[13px] text-[#c0bbb4] text-center py-4">No merchants yet</Text>
          }
        />

        {/* ── Spending Activity Heatmap ── */}
        <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mt-7 mb-3">
          SPENDING ACTIVITY
        </Text>
        <View className="bg-white border border-[#e8e4de] rounded-[18px] p-4">
          <View className="flex-row mb-2" style={{ marginLeft: 36 }}>
            {weeks.map((w) => (
              <View key={w} style={{ width: 36, alignItems: "center" }}>
                <Text className="text-[10px] text-[#c0bbb4]">{w}</Text>
              </View>
            ))}
          </View>
          {heatGrid.map((row, dayIndex) => (
            <View key={dayIndex} className="flex-row items-center mb-1.5">
              <View style={{ width: 36 }}>
                <Text className="text-[11px] text-[#a8a49c]">{days[dayIndex]}</Text>
              </View>
              {row.map((value, weekIndex) => (
                <View key={weekIndex} style={{ width: 36, alignItems: "center" }}>
                  <View style={{
                    width: 22, height: 22, borderRadius: 6,
                    backgroundColor: getHeatColor(value),
                  }} />
                </View>
              ))}
            </View>
          ))}
          <View className="flex-row items-center gap-1.5 mt-3 pt-3 border-t border-[#f0ece6]">
            <Text className="text-[10px] text-[#c0bbb4] mr-1">Less</Text>
            {["#e8e4de", "#b6e8ce", "#4db87a", "#1db464", "#0d7a4a"].map((c) => (
              <View key={c} style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: c }} />
            ))}
            <Text className="text-[10px] text-[#c0bbb4] ml-1">More</Text>
          </View>
        </View>

        {/* ── The Big Buy ── */}
        {biggestTx && (
          <>
            <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mt-7 mb-3">
              THE BIG BUY
            </Text>
            <View className="bg-white border border-[#e8e4de] rounded-[18px] p-4 flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center flex-shrink-0">
                <Text className="text-xl">{CAT_ICONS[biggestTx.category] ?? "💳"}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-medium text-[#1a1a1a] mb-0.5">
                  {biggestTx.merchant}
                </Text>
                <Text className="text-[11px] text-[#c0bbb4]">
                  {biggestTx.transactionAt
                    ? new Date(biggestTx.transactionAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                    : "Date unknown"}
                </Text>
              </View>
              <Text className="text-[18px] font-medium text-[#1a1a1a] tracking-tight">
                ₦{biggestTx.amount.toLocaleString()}
              </Text>
            </View>
          </>
        )}

        {/* ── Monthly Comparison ── */}
        {monthlyData && (
          <>
            <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mt-7 mb-3">
              MONTHLY COMPARISON
            </Text>
            <View className="bg-white border border-[#e8e4de] rounded-[18px] p-5">
              {[
                { label: new Date(new Date().getFullYear(), new Date().getMonth() - 1).toLocaleString("en-US", { month: "long", year: "numeric" }), amount: monthlyData.lastMonth, i: 0 },
                { label: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }), amount: monthlyData.thisMonth, i: 1 },
              ].map((m) => (
                <View key={m.label} className={m.i === 1 ? "mt-4" : ""}>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[12px] text-[#a8a49c]">{m.label}</Text>
                    <Text className="text-[14px] font-medium text-[#1a1a1a]">
                      ₦{m.amount.toLocaleString()}
                    </Text>
                  </View>
                  <View className="w-full h-2 bg-[#f0ece6] rounded-full overflow-hidden">
                    <View
                      className="h-2 rounded-full"
                      style={{
                        width: `${(m.amount / maxAmount) * 100}%`,
                        backgroundColor: m.i === 0 ? "#c0bbb4" : "#1db464",
                      }}
                    />
                  </View>
                </View>
              ))}

              <View className="flex-row items-center gap-1.5 mt-5 self-start bg-[#eaf7f0] border border-[#b6e8ce] rounded-full px-3 py-1.5">
                <Text className="text-[#1db464] text-[12px]">{changeDown ? "↓" : "↑"}</Text>
                <Text className="text-[12px] text-[#0d7a4a]">
                  {changeAbs}% {changeDown ? "lower" : "higher"} this month
                </Text>
              </View>

              <Text className="text-[12px] text-[#a8a49c] mt-3 leading-[18px]">
                {changeDown
                  ? `You spent ₦${(monthlyData.lastMonth - monthlyData.thisMonth).toLocaleString()} less this month. Keep it up.`
                  : `You spent ₦${(monthlyData.thisMonth - monthlyData.lastMonth).toLocaleString()} more this month.`}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}