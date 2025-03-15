import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PhotoContext } from "./PhotoContext";

const PhotoDetails = ({ route, navigation }) => {
  const { photos } = useContext(PhotoContext);
  const { photoId } = route.params;
  const photo = photos.find((p) => p.id === photoId);

  if (!photo) {
    return (
      <View style={styles.container}>
        <Text>Photo not found!</Text>
      </View>
    );
  }

  const comments = [
    {
      user: "tuanbinentertainment",
      content: "Người đẹp vậy cho tớ làm quen nhé",
      time: "2 giờ",
    },
    { user: "kimth", content: "ngành gì ngày b", time: "2 giờ" },
    {
      user: "ntuyennhngoc_",
      content: "Mang máy tính & Truyện trong túi à",
      time: "1 giờ",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.mainHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PhotoFORUM</Text>
          <Ionicons name="reorder-two-outline" size={24} />
        </View>
        <View style={styles.header}>
          <Image source={require("../assets/p2.png")} style={styles.avatar} />
          <View style={styles.userTitle}>
            <Text style={styles.username}>vanh.004</Text>
            <Text style={styles.time}>{photo.timestamp}</Text>
          </View>
          <Ionicons
            name="ellipsis-horizontal"
            size={15}
            color="gray"
            style={{ bottom: 10 }}
          />
        </View>
        <View style={{ paddingLeft: 5 }}>
          <Text>{photo.caption || "No caption"}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
        >
          <Image source={{ uri: photo.uri }} style={styles.image} />
        </ScrollView>
        <View style={styles.reactions}>
          <Ionicons name="heart-outline" size={24} />
          <Ionicons name="chatbubble-ellipses-outline" size={24} />
          <Ionicons name="repeat-outline" size={24} />
          <Ionicons name="paper-plane-outline" size={24} />
        </View>
        <View style={styles.commentsContainer}>
          {comments.map((comment, index) => (
            <View
              style={[styles.comment, index > 0 && styles.commentWithBorder]}
              key={index}
            >
              <View style={styles.userInfo}>
                <Image
                  source={require("../assets/p2.png")}
                  style={styles.avatar}
                />
                <View style={styles.commentText}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.time}>{comment.time}</Text>
                  </View>
                  <View style={styles.commentContentContainer}>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                  <View style={styles.reactions}>
                    <Ionicons name="heart-outline" size={20} />
                    <Ionicons name="chatbubble-ellipses-outline" size={20} />
                    <Ionicons name="repeat-outline" size={20} />
                    <Ionicons name="paper-plane-outline" size={20} />
                  </View>
                </View>
                <View style={{ bottom: 18 }}>
                  <Ionicons name="ellipsis-horizontal" size={15} color="gray" />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }}>
          <TextInput placeholder="Viết bình luận..." style={styles.input} />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: { paddingLeft: 10, paddingRight: 10 },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 7,
    bottom: 10,
  },
  userTitle: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
    bottom: 6,
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
  },
  time: {
    color: "gray",
    fontSize: 13,
    paddingLeft: 7,
    alignItems: "center",
    top: 1,
  },
  imagesContainer: { marginBottom: 10, marginTop: 10 },
  image: { width: 230, height: 300, borderRadius: 15, marginRight: 10 },
  commentsContainer: {
    paddingTop: 10,
  },
  comment: {
    flexDirection: "column",
    marginBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#2bbef9",
  },
  commentWithBorder: {
    paddingTop: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    flex: 1,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 15,
  },
  commentContent: {
    fontSize: 13,
  },
  reactions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#05fad1",
    borderRadius: 15,
    padding: 14,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007260",
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default PhotoDetails;