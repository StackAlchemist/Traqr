import { View, Text, FlatList, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-gifted-charts";

export default function Home() {
  const categories = [
    { id: "0", name: "Food", amtSpent: 24000, percentage: 44, icon: "🍔", barColor: "#e8a020" },
    { id: "1", name: "Transport", amtSpent: 18000, percentage: 33, icon: "🚗", barColor: "#3a7bd5" },
    { id: "2", name: "Shopping", amtSpent: 12000, percentage: 22, icon: "🛍️", barColor: "#8b5cf6" },
  ];

  const transactions = [
    { id: "1", merchant: "Chicken Republic", amount: 7500, category: "Food", date: "Today", icon: "🍗" },
    { id: "2", merchant: "Bolt", amount: 4200, category: "Transport", date: "Yesterday", icon: "🚖" },
  ];

  const sparklineData = [
    { value: 20 }, { value: 35 }, { value: 25 },
    { value: 45 }, { value: 40 }, { value: 60 }, { value: 50 },
  ];

  const renderCategory = ({ item, index }) => (
    <View className="bg-white border border-[#e8e4de] rounded-2xl p-4 mb-2.5 flex-row items-center justify-between overflow-hidden">
      {/* Percentage bar */}
      <View
        className="absolute left-0 top-0 bottom-0 rounded-l-2xl opacity-[0.06]"
        style={{ width: `${item.percentage}%`, backgroundColor: item.barColor }}
      />
      <View className="flex-row items-center gap-3.5">
        <View className="w-[38px] h-[38px] rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center">
          <Text className="text-lg">{item.icon}</Text>
        </View>
        <View>
          <Text className="text-[13px] text-[#2a2a2a] mb-0.5" >
            {item.name}
          </Text>
          <Text className="text-[11px] text-[#c0bbb4]" >
            {item.percentage}% of spending
          </Text>
        </View>
      </View>
      <Text className="text-[19px] text-[#1a1a1a] tracking-tight">
        ₦{item.amtSpent.toLocaleString()}
      </Text>
    </View>
  );

  const renderTransaction = ({ item, index }) => {
    const isFirst = index === 0;
    const isLast = index === transactions.length - 1;
    return (
      <View
        className={`bg-white px-[18px] py-[15px] flex-row items-center justify-between border-[#e8e4de]
          ${isFirst ? "rounded-t-2xl border border-b-0" : ""}
          ${isLast ? "rounded-b-2xl border border-t-[#f0ece6]" : ""}
          ${!isFirst && !isLast ? "border-x border-b border-[#e8e4de] border-t-[#f0ece6]" : ""}
        `}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-[38px] h-[38px] rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center">
            <Text className="text-[17px]">{item.icon}</Text>
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
        <Text className="text-[18px] text-[#1a1a1a] tracking-tight">
          ₦{item.amount.toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f3ef]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-5">
          <View>
            <Text className="text-[10px] text-[#a8a49c] tracking-[2px] mb-0.5">
              GOOD EVENING
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
                847,200
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
          data={categories}
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
          <Text className="text-[12px] text-[#888079] leading-[18px]">
            Food spending increased 24% this week. Consider meal prepping to reduce recurring costs.
          </Text>
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
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}