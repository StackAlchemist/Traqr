import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

type UploadFile = {
  id: string;
  name: string;
};

export default function Upload() {
  const [uploads, setUploads] = useState<UploadFile[]>([
    { id: "0", name: "Screenshot_Opay_2389884.img" },
    { id: "1", name: "Screenshot_GTBank_2u99884.img" },
    { id: "2", name: "Screenshot_Wema_2i8884.img" },
  ]);

  const handlePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      multiple: true,
      copyToCacheDirectory: false,
    });
    if (!result.canceled) {
      const newFiles: UploadFile[] = result.assets.map((asset) => ({
        id: Date.now().toString() + Math.random().toString(),
        name: asset.name,
      }));
      setUploads((prev) => [...prev, ...newFiles]);
    }
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((f) => f.id !== id));
  };

  const renderUpload = ({ item }: { item: UploadFile }) => (
    <View className="w-full flex-row items-center gap-3 bg-white border border-[#e8e4de] rounded-2xl px-4 py-3 mb-2">
      {/* File icon */}
      <View className="w-9 h-9 rounded-xl bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center flex-shrink-0">
        <Text className="text-base">📄</Text>
      </View>

      {/* Filename */}
      <Text
        className="flex-1 text-[13px] text-[#2a2a2a]"
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {item.name}
      </Text>

      {/* Remove button */}
      <TouchableOpacity
        onPress={() => removeUpload(item.id)}
        className="w-7 h-7 rounded-lg bg-[#f5f3ef] border border-[#e8e4de] items-center justify-center flex-shrink-0"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={14} color="#a8a49c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f5f3ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
      >
        {/* Header */}
        <Text className="text-[28px] text-[#1a1a1a] tracking-tight mb-1">
          Upload receipts
        </Text>
        <Text className="text-[12px] text-[#a8a49c] mb-6">
          JPG, PNG or PDF · max 10MB each
        </Text>

        {/* Drop zone */}
        <TouchableOpacity
          onPress={handlePick}
          activeOpacity={0.8}
          className="w-full bg-white border border-dashed border-[#c8c4be] rounded-[20px] py-10 items-center mb-5"
        >
          <View className="w-12 h-12 rounded-2xl bg-[#f0f7f3] border border-[#b6e8ce] items-center justify-center mb-3">
            <Text className="text-2xl">📸</Text>
          </View>
          <Text className="text-[14px] font-medium text-[#2a2a2a] mb-1">
            Drop files here
          </Text>
          <Text className="text-[12px] text-[#b0aa9f] mb-4">
            or tap to browse your device
          </Text>
          <View className="bg-[#1a3328] rounded-full px-5 py-2">
            <Text className="text-[12px] text-white tracking-wide">
              Choose files
            </Text>
          </View>
        </TouchableOpacity>

        {/* File list */}
        {uploads.length > 0 && (
          <FlatList
            data={uploads}
            renderItem={renderUpload}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            className="mb-6"
          />
        )}

        {/* Submit button */}
        <TouchableOpacity
          activeOpacity={0.85}
          className="w-full bg-[#1a3328] rounded-2xl py-4 items-center justify-center flex-row gap-2"
        >
          <Ionicons name="arrow-up" size={16} color="#fff" />
          <Text className="text-[14px] text-white tracking-wide">
            Analyse {uploads.length} {uploads.length === 1 ? "file" : "files"}
          </Text>
        </TouchableOpacity>

        {/* Footer note */}
        <Text className="text-[11px] text-[#b0aa9f] text-center mt-3">
          Your files are processed securely and never stored
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}