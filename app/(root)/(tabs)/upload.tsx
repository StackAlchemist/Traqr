import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator 
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { uploadFiles } from "@/lib/uploads"
import { Alert } from "react-native";
import { useRouter } from "expo-router";

type UploadFile = {
  id: string;
  name: string;
  uri: string;
  mimeType: string;
};

export default function Upload() {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handlePick = () => {
    if (uploading) return; // prevent picking new files while uploading
    Alert.alert("Add files", "Choose a source", [
      {
        text: "Photo Library",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
          });
          if (!result.canceled) {
            const newFiles: UploadFile[] = result.assets.map((asset) => ({
              id: Date.now().toString() + Math.random().toString(),
              name: asset.fileName ?? `photo_${Date.now()}.jpg`,
              uri: asset.uri,
              mimeType: asset.mimeType ?? "image/jpeg",
            }));
            setUploads((prev) => [...prev, ...newFiles]);
          }
        },
      },
      {
        text: "Take a Photo",
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) {
            Alert.alert("Permission needed", "Camera access is required.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
          });
          if (!result.canceled) {
            const asset = result.assets[0];
            setUploads((prev) => [
              ...prev,
              {
                id: Date.now().toString() + Math.random().toString(),
                name: asset.fileName ?? `photo_${Date.now()}.jpg`,
                uri: asset.uri,
                mimeType: asset.mimeType ?? "image/jpeg",
              },
            ]);
          }
        },
      },
      {
        text: "Files",
        onPress: async () => {
          const result = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf"],
            multiple: true,
            copyToCacheDirectory: false,
          });
          if (!result.canceled) {
            const newFiles: UploadFile[] = result.assets.map((asset) => ({
              id: Date.now().toString() + Math.random().toString(),
              name: asset.name,
              uri: asset.uri,
              mimeType: asset.mimeType ?? "application/octet-stream",
            }));
            setUploads((prev) => [...prev, ...newFiles]);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleUpload = async () => {
    if (!uploads.length || uploading) return;
    try {
      setUploading(true);
      const response = await uploadFiles(uploads);
      console.log('Upload Response:', response);
      setUploads([]);
      setSuccess(true);

      // Route to home after 5 seconds
      timerRef.current = setTimeout(() => {
        router.replace("/");
      }, 5000);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Clean up timer when component unmounts or before scheduling another
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const removeUpload = (id: string) => {
    if (uploading) return; // Prevent removing during upload
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
        disabled={uploading}
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
        scrollEnabled={!uploading}
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
          activeOpacity={uploading ? 1 : 0.8}
          className="w-full bg-white border border-dashed border-[#c8c4be] rounded-[20px] py-10 items-center mb-5"
          disabled={uploading}
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

        {/* Submit button & ActivityIndicator (loading state) */}
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            onPress={handleUpload}
            disabled={uploading || uploads.length === 0}
            activeOpacity={uploading ? 1 : 0.85}
            className={`w-full bg-[#1a3328] rounded-2xl py-4 items-center justify-center flex-row gap-2 ${uploading ? 'opacity-70' : ''}`}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 7 }} />
            ) : (
              <Ionicons name="arrow-up" size={16} color="#fff" />
            )}
            <Text className="text-[14px] text-white tracking-wide">
              {uploading
                ? "Analysing..."
                : `Analyse ${uploads.length} ${uploads.length === 1 ? "file" : "files"}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show a page-overlay loading spinner if uploading */}
        {uploading && (
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(245, 243, 239, 0.55)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
            pointerEvents="auto"
          >
            <ActivityIndicator size="large" color="#1a3328" />
            <Text className="text-[#1a3328] text-[15px] mt-3 font-medium">Uploading & analysing your files…</Text>
          </View>
        )}

        {/* Success message with progress to home */}
        {success && (
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(245, 243, 239, 0.77)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
            pointerEvents="auto"
          >
            <Ionicons name="checkmark-circle" size={46} color="#1db464" style={{ marginBottom: 13 }} />
            <Text className="text-[#1a3328] text-[16px] font-semibold mb-2">Upload complete</Text>
            <Text className="text-[#888079] text-[12px] text-center mb-1">Redirecting you to home…</Text>
            <Text className="text-[#1db464] text-[13px] text-center">(5 seconds)</Text>
          </View>
        )}

        {/* Footer note */}
        <Text className="text-[11px] text-[#b0aa9f] text-center mt-3">
          Your files are processed securely and never stored
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}