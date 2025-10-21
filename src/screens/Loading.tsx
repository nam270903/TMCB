import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { SvgXml } from "react-native-svg";
import { SvgItem } from "../../types/firestore";

const Loading: React.FC = () => {
  const [svgData, setSvgData] = useState<SvgItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = firestore().collection("svg_img_colored").doc("animal_01_colored");
        const docSnap = await docRef.get();

        if (docSnap.exists()) {
          const data = docSnap.data() as SvgItem;
          setSvgData(data);
        } else {
          console.warn("Không tìm thấy document!");
        }
      } catch (error) {
        console.error("Lỗi Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#888" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!svgData) {
    return (
      <View style={styles.center}>
        <Text>Không có dữ liệu SVG</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.category}>Category: {svgData.category}</Text>
      <Text style={styles.version}>Version: {svgData.version ?? "N/A"}</Text>

      <View style={styles.svgContainer}>
        <SvgXml xml={svgData.svgContent} width="100%" height="300" />
      </View>
    </ScrollView>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  category: {
    fontSize: 18,
    fontWeight: "600",
  },
  version: {
    marginTop: 4,
    color: "#666",
  },
  svgContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});
