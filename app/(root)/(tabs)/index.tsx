import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-gifted-charts";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-[#f7f8fa] px-[22px]">
      {/* Background ambient shapes */}
      {/* <View className="absolute -top-[60px] -right-[60px] w-[280px] h-[280px] rounded-full bg-[#aef0cc] opacity-45" />
      <View className="absolute bottom-[120px] -left-[40px] w-[160px] h-[160px] rounded-full bg-[#c8f7e4] opacity-50" /> */}

      {/* Top bar */}
      <View className="flex-row items-center justify-between mt-4">
        <View>
          <Text className="text-[13px] text-[#7a8a80] font-normal tracking-wide">
            Good Morning 👋🏾
          </Text>
          <Text className="text-[22px] font-extrabold text-[#121f1a] tracking-tighter leading-tight">
            Olamide
          </Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-[#1db36a] items-center justify-center">
          <Text className="text-base font-extrabold text-white">O</Text>
        </View>
      </View>

      {/* Insight pill */}
      <View className="flex-row items-center self-start gap-x-1.5 mt-3 bg-[#e3faf0] border border-[#b2ecd3] rounded-full px-3 py-[5px]">
        <View className="w-[7px] h-[7px] rounded-full bg-[#1db36a]" />
        <Text className="text-[12px] text-[#0d7a4a] font-medium tracking-wide">
          Spending 12% lower this week
        </Text>
      </View>

      {/* Balance card — outer View owns the rounding + clipping */}
      <View className="mt-5 rounded-3xl overflow-hidden">
        <LinearGradient
          colors={["#121f1a", "#1a3328", "#0d2b20"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 24 }}>
          {/* Glow overlay — needs explicit dimensions to not affect layout */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: "#1db36a",
              opacity: 0.25,
            }}
          />

          <Text className="text-[11px] text-white/40 tracking-[1px] font-medium mb-2">
            spent this month
          </Text>

          <Text className="text-[38px] font-extrabold text-white -tracking-[1.2px] leading-[44px]">
            <Text className="text-[20px] font-semibold text-white/60">₦</Text>
            847,200
          </Text>

          <LineChart
            areaChart
            hideDataPoints
            hideYAxisText
            hideAxesAndRules
            color="#5de8a0"
            startFillColor="#5de8a0"
            endFillColor="#5de8a0"
            startOpacity={0.25}
            endOpacity={0.02}
            data={[
              { value: 20 },
              { value: 35 },
              { value: 25 },
              { value: 45 },
              { value: 40 },
              { value: 60 },
              { value: 50 },
            ]}
          />

          <View className="flex-row items-center justify-between mt-[18px] pt-[14px] border-t border-white/[0.08]">
            <View className="flex-row items-center gap-x-1.5">
              <View className="w-1.5 h-1.5 rounded-full bg-[#1db36a]" />
              <Text className="text-[11px] text-white/50 font-normal">
                May 2026
              </Text>
            </View>
            <View className="bg-[#1db36a]/20 border border-[#1db36a]/35 rounded-full px-2.5 py-[3px]">
              <Text className="text-[11px] text-[#5de8a0] font-medium">
                ↓ 12% spent
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}
