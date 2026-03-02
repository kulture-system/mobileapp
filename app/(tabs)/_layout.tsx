import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const scheme = useColorScheme();
  const activeColor = scheme === "dark" ? "#fff" : "#000";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="explore" size={28} color={color} />
          )
        }}
      />
    </Tabs>
  );
}