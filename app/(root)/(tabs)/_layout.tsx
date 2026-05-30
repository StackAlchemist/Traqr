import { Platform } from "react-native";
import { Tabs } from "expo-router";
import {
  NativeTabs,
  Icon,
  Label,
} from "expo-router/unstable-native-tabs";
import { Ionicons } from "@expo/vector-icons";

function AndroidTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#121A26",
          borderTopColor: "#1A2433",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },

        tabBarActiveTintColor: "#4DA3FF",
        tabBarInactiveTintColor: "#5B6B86",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="add-circle"
              color="#4DA3FF"
              size={size + 10}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "History",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function IOSTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="upload">
        <Icon sf="plus.circle.fill" />
        <Label>Upload</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="insights">
        <Icon sf="chart.pie.fill" />
        <Label>Insights</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="transactions">
        <Icon sf="receipt.fill" />
        <Label>History</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

export default function TabsLayout() {
  return Platform.OS === "ios" ? <IOSTabs /> : <AndroidTabs />;
}