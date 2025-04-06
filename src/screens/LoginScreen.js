import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.0.111:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store user data in AsyncStorage
        const userData = {
          id: result.user.id,           // Assuming the server returns user.id
          name: result.user.name,       // Assuming the server returns user.name
          email: result.user.email,     // Already stored, but keeping for completeness
          roomid: result.user.roomid,   // Assuming the server returns user.roomid
        };

        // Save all user data to AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        // Optionally, you can still save the token if returned
        if (result.session?.access_token) {
          await AsyncStorage.setItem("token", result.session.access_token);
        }

        Alert.alert("Success", "Login successful");
        navigation.replace("Home");
      } else {
        Alert.alert("Error", result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        error.message || "Login failed. Please check your credentials and network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.topBackground}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={20} color="#aaa" style={styles.icon} />
          <TextInput
            placeholder="Email address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#aaa" style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBackground: {
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#eee",
    marginTop: 10,
  },
  formContainer: {
    padding: 20,
    marginTop: -40,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#0f2027",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#007BFF",
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
  },
});

export default LoginScreen;