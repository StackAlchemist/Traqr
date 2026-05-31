import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart, LineChart } from "react-native-gifted-charts";

export default function Insights() {
  const transactions = [
    {
      id: "1",
      merchant: "Chicken Republic",
      amount: 42000,
      category: "Food",
      date: "Today",
      icon: "🍗",
    },
    {
      id: "2",
      merchant: "Bolt",
      amount: 3100,
      category: "Transport",
      date: "Yesterday",
      icon: "🚖",
    },
    {
      id: "3",
      merchant: "Shoprite",
      amount: 18000,
      category: "Shopping",
      date: "Yesterday",
      icon: "🛒",
    },
  ];

  const pieData = [
    { value: 42000, color: "#2EE6A6", label: "Food" },
    { value: 18000, color: "#4DA3FF", label: "Transport" },
    { value: 12000, color: "#A78BFA", label: "Shopping" },
    { value: 10000, color: "#FFB020", label: "Bills" },
  ];

  // Week totals in ₦ (W1–W4), mapped to chart values
  const weekTotals = [45000, 62000, 82000, 71000];
  const trendData = weekTotals.map((v) => ({ value: v }));
  const peakWeekIndex = weekTotals.indexOf(Math.max(...weekTotals));
  const peakWeekLabel = `Week ${peakWeekIndex + 1}`;

  // Rows = days (Mon–Sun), Cols = weeks (W1–W5)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeks = ["W1", "W2", "W3", "W4", "W5"];

  const heatmapData = [
    // Mon → Sun, each row = one day, each col = one week
    [2000, 4000, 8000, 1000, 6000],
    [6000, 3000, 1000, 0, 4000],
    [1000, 5000, 7000, 3000, 0],
    [0, 2000, 6000, 8000, 9000],
    [9000, 12000, 15000, 11000, 14000],
    [10000, 8000, 12000, 9000, 13000],
    [3000, 5000, 2000, 7000, 4000],
  ];

  const getHeatColor = (amount: number) => {
    if (amount === 0) return "#e8e4de";
    if (amount < 3000) return "#b6e8ce";
    if (amount < 7000) return "#4db87a";
    if (amount < 10000) return "#1db464";
    return "#0d7a4a";
  };

  // Monthly comparison bar chart
  const maxAmount = 125000;
  const months = [
    { label: "April 2026", amount: 125000 },
    { label: "May 2026", amount: 108000 },
  ];

  const renderTransaction = ({
    item,
    index,
  }: {
    item: (typeof transactions)[0];
    index: number;
  }) => {
    const isFirst = index === 0;
    const isLast = index === transactions.length - 1;
    return (
      <View
        className={`bg-white px-4 py-[14px] flex-row items-center justify-between
          ${isFirst ? "rounded-t-2xl border border-b-0 border-[#e8e4de]" : ""}
          ${isLast ? "rounded-b-2xl border border-t-[#f0ece6] border-[#e8e4de]" : ""}
          ${!isFirst && !isLast ? "border-x border-b border-[#e8e4de] border-t-[#f0ece6]" : ""}
        `}>
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-9 h-9 rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center">
            <Text className="text-base">{item.icon}</Text>
          </View>
          <View>
            <Text className="text-[13px] text-[#2a2a2a] mb-0.5">
              {item.merchant}
            </Text>
            <Text className="text-[11px] text-[#c0bbb4]">
              {item.category} · {item.date}
            </Text>
          </View>
        </View>
        <Text className="text-[17px] text-[#1a1a1a] tracking-tight">
          ₦{item.amount.toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f3ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 64 }}>
        {/* Header */}
        <Text className="text-[30px] font-semibold text-[#1a1a1a] tracking-tight mb-1">
          Insights
        </Text>
        <Text className="text-[12px] text-[#a8a49c] mb-7">
          May 2026 · your full breakdown
        </Text>

        {/* ── Spending Breakdown ── */}
        <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mb-3">
          SPENDING BREAKDOWN
        </Text>

        <View className="bg-white border border-[#e8e4de] rounded-[18px] p-5">
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
                <View
                  key={item.label}
                  className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-[12px] text-[#2a2a2a]">
                      {item.label}
                    </Text>
                  </View>
                  <Text className="text-[14px] font-medium text-[#1a1a1a]">
                    ₦{item.value.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Spending Trend ── */}
        <View className="bg-[#1a3328] rounded-[18px] overflow-hidden p-5 mt-3">
          {/* Header row */}
          <Text className="text-[10px] text-white/30 tracking-[2.5px] mb-4">
            SPENDING TREND
          </Text>

          {/* Amount + badge */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[28px] font-semibold text-white tracking-tight">
              ₦108,000
            </Text>
            <View className="bg-[#1db464]/15 border border-[#1db464]/25 rounded-full px-2.5 py-[3px]">
              <Text className="text-[11px] text-[#5de8a0]">
                ↓ 13.6% vs last month
              </Text>
            </View>
          </View>

          {/* Chart */}
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

          {/* Week labels */}
          <View className="flex-row justify-between mt-2 px-1">
            {["W1", "W2", "W3", "W4"].map((w) => (
              <Text key={w} className="text-[10px] text-white/30">
                {w}
              </Text>
            ))}
          </View>

          {/* Divider */}
          <View className="border-t border-white/[0.08] mt-4 pt-3 flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-[#5de8a0]" />
            <Text className="text-[11px] text-white/40">
              Peak spending: {peakWeekLabel}
            </Text>
          </View>
        </View>

        {/* ── AI Insight ── */}
        <View className="bg-white border border-[#e8e4de] border-l-2 border-l-[#1db464] rounded-tr-2xl rounded-br-2xl p-4 mt-3">
          <Text className="text-[10px] text-[#1db464] tracking-[2px] mb-1">
            AI INSIGHT
          </Text>
          <Text className="text-[12px] text-[#888079] leading-[18px] mb-3">
            AI analyses your spending and gives meaningful insights on how to
            improve your financial habits.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-[#1a3328] rounded-xl py-2.5 items-center">
            <Text className="text-[13px] text-white">✨ Get Insights</Text>
          </TouchableOpacity>
        </View>

        {/* ── Top Merchants ── */}
        <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mt-7 mb-3">
          TOP MERCHANTS
        </Text>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        {/* ── Spending Activity Heatmap ── */}
        <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mt-7 mb-3">
          SPENDING ACTIVITY
        </Text>

        <View className="bg-white border border-[#e8e4de] rounded-[18px] p-4">
          {/* Week header */}
          <View className="flex-row mb-2" style={{ marginLeft: 36 }}>
            {weeks.map((w) => (
              <View key={w} style={{ width: 36, alignItems: "center" }}>
                <Text className="text-[10px] text-[#c0bbb4]">{w}</Text>
              </View>
            ))}
          </View>

          {/* Day rows */}
          {heatmapData.map((row, dayIndex) => (
            <View key={dayIndex} className="flex-row items-center mb-1.5">
              {/* Day label */}
              <View style={{ width: 36 }}>
                <Text className="text-[11px] text-[#a8a49c]">
                  {days[dayIndex]}
                </Text>
              </View>
              {/* Cells */}
              {row.map((value, weekIndex) => (
                <View
                  key={weekIndex}
                  style={{ width: 36, alignItems: "center" }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      backgroundColor: getHeatColor(value),
                    }}
                  />
                </View>
              ))}
            </View>
          ))}

          {/* Legend */}
          <View className="flex-row items-center gap-1.5 mt-3 pt-3 border-t border-[#f0ece6]">
            <Text className="text-[10px] text-[#c0bbb4] mr-1">Less</Text>
            {["#e8e4de", "#b6e8ce", "#4db87a", "#1db464", "#0d7a4a"].map(
              (c) => (
                <View
                  key={c}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    backgroundColor: c,
                  }}
                />
              ),
            )}
            <Text className="text-[10px] text-[#c0bbb4] ml-1">More</Text>
          </View>
        </View>

        {/* ── The Big Buy ── */}
        <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mt-7 mb-3">
          THE BIG BUY
        </Text>

        <View className="bg-white border border-[#e8e4de] rounded-[18px] p-4 flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center flex-shrink-0">
            <Text className="text-xl">💻</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-medium text-[#1a1a1a] mb-0.5">
              Macbook 2019
            </Text>
            <Text className="text-[11px] text-[#c0bbb4]">12 May 2026</Text>
          </View>
          <Text className="text-[18px] font-medium text-[#1a1a1a] tracking-tight">
            ₦850,000
          </Text>
        </View>

        {/* ── Monthly Comparison ── */}
        <Text className="text-[10px] text-[#b0aa9f] tracking-[2.5px] mt-7 mb-3">
          MONTHLY COMPARISON
        </Text>

        <View className="bg-white border border-[#e8e4de] rounded-[18px] p-5">
          {months.map((m, i) => (
            <View key={m.label} className={i === 1 ? "mt-4" : ""}>
              {/* Label + amount */}
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-[12px] text-[#a8a49c]">{m.label}</Text>
                <Text className="text-[14px] font-medium text-[#1a1a1a]">
                  ₦{m.amount.toLocaleString()}
                </Text>
              </View>
              {/* Bar */}
              <View className="w-full h-2 bg-[#f0ece6] rounded-full overflow-hidden">
                <View
                  className="h-2 rounded-full"
                  style={{
                    width: `${(m.amount / maxAmount) * 100}%`,
                    backgroundColor: i === 0 ? "#c0bbb4" : "#1db464",
                  }}
                />
              </View>
            </View>
          ))}

          <View className="flex-row items-center gap-1.5 mt-5 self-start bg-[#eaf7f0] border border-[#b6e8ce] rounded-full px-3 py-1.5">
            <Text className="text-[#1db464] text-[12px]">↓</Text>
            <Text className="text-[12px] text-[#0d7a4a]">
              13.6% lower this month
            </Text>
          </View>

          <Text className="text-[12px] text-[#a8a49c] mt-3 leading-[18px]">
            You spent ₦17,000 less this month. Keep it up.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
