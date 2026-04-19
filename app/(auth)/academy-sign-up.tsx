import { registerAcademy } from "@/lib/api/academies";
import { getAllRegulations } from "@/lib/api/regulations";
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AcademySignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [orgName, setOrgName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [regulationCode, setRegulationCode] = useState<string>("");
  const [regulation, setRegulation] = useState<string>("");

  const [orgEmail, setOrgEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: regulations, isLoading: isRegulationsLoading } = useQuery({
    queryKey: ["regulations"],
    queryFn: () => getAllRegulations(),
  });

  const handleRegister = async () => {
    if (!orgName || !adminEmail || !password) {
      Alert.alert("Required Fields", "Please complete all essential academy details.");
      return;
    }

    setLoading(true);
    try {
      await registerAcademy({
        name: orgName,
        country,
        city,
        address,
        email: orgEmail,
        phone,
        website,
        adminName,
        adminEmail,
        password,
        regulation
      });

      Alert.alert("Commission Successful", "Academy portal initialized.", [
        { text: "FINALIZE", onPress: () => router.replace("/(academy)/home") },
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Deployment Failed", error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !orgName) {
      Alert.alert("Validation", "Academy name is required for registration.");
      return;
    }
    if (step === 3 && (!adminEmail || !password || !adminName)) {
      Alert.alert("Validation", "Administrator credentials must be fully defined.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const toggleRegulation = (cert: string) => {
    if (regulation === cert) {
      setRegulationCode("");
      setRegulation("");
    } else {
      const reg = regulations?.find((r: any) => r.$id === cert);
      setRegulationCode(reg?.code || "");
      setRegulation(cert);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.indicatorContainer}>
      {[1, 2, 3, 4].map((s) => (
        <View key={s} style={styles.indicatorWrapper}>
          <View style={[
            styles.indicator,
            step === s && styles.indicatorActive,
            step > s && styles.indicatorComplete
          ]} />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#020617', '#0F172A', '#1E293B']}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.logoBadge}>
              <FontAwesome5 name="building" size={28} color="#C9A961" />
            </View>
            <Text style={styles.title}>ACADEMY <Text style={styles.titleGold}>PARTNER</Text></Text>
            <Text style={styles.subtitle}>ESTABLISH TRAINING FACILITY</Text>
          </View>

          {renderStepIndicator()}

          {/* Form Card */}
          <View style={styles.card}>
            {step === 1 && (
              <View>
                <Text style={styles.stepTitle}>Organization Basics</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ACADEMY IDENTITY (NAME)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Skybound Flight Science"
                    placeholderTextColor="#475569"
                    value={orgName}
                    onChangeText={setOrgName}
                  />
                </View>

                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.label}>NATION</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="USA"
                      placeholderTextColor="#475569"
                      value={country}
                      onChangeText={setCountry}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.label}>CITY</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Chicago"
                      placeholderTextColor="#475569"
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>HQ ADDRESS</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Terminal 4, Gate B"
                    placeholderTextColor="#475569"
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>
              </View>
            )}

            {step === 2 && (
              <View>
                <Text style={styles.stepTitle}>Regulatory Context</Text>
                {isRegulationsLoading ? (
                  <ActivityIndicator color="#C9A961" style={{ margin: 20 }} />
                ) : (
                  regulations?.map((reg: any) => (
                    <TouchableOpacity
                      key={reg.$id}
                      style={[styles.certOption, regulation === reg.$id && styles.certOptionSelected]}
                      onPress={() => toggleRegulation(reg.$id)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.certTitle, regulation === reg.$id && styles.certTitleSelected]}>{reg.code}</Text>
                        <Text style={styles.certSubtitle}>{reg.name}</Text>
                      </View>
                      <View style={[styles.radio, regulation === reg.$id && styles.radioActive]}>
                        {regulation === reg.$id && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

            {step === 3 && (
              <View>
                <Text style={styles.stepTitle}>Contact & Admin</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>OFFICIAL COMMS (EMAIL)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ops@academy.id"
                    placeholderTextColor="#475569"
                    value={orgEmail}
                    onChangeText={setOrgEmail}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ADMIN FULL NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Head of Operations"
                    placeholderTextColor="#475569"
                    value={adminName}
                    onChangeText={setAdminName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ADMIN EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="[EMAIL_ADDRESS]"
                    placeholderTextColor="#475569"
                    value={adminEmail}
                    onChangeText={setAdminEmail}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ADMIN PASSWORD</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Secure access key"
                    placeholderTextColor="#475569"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>
            )}

            {step === 4 && (
              <View>
                <Text style={styles.stepTitle}>Mission Review</Text>
                <View style={styles.reviewBox}>
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewLabel}>Academy</Text>
                    <Text style={styles.reviewValue}>{orgName}</Text>
                  </View>
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewLabel}>Authority</Text>
                    <Text style={styles.reviewValue}>{regulationCode || 'Standard'}</Text>
                  </View>
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewLabel}>Admin</Text>
                    <Text style={styles.reviewValue}>{adminName}</Text>
                  </View>
                </View>
                <Text style={styles.disclaimer}>
                  By confirming, you authorize Aviatek to initialize your digital training infrastructure.
                </Text>
              </View>
            )}

            {/* Nav */}
            <View style={styles.nav}>
              {step > 1 && (
                <TouchableOpacity style={styles.navBack} onPress={prevStep}>
                  <Text style={styles.navBackText}>BACK</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.navNext}
                onPress={step === 4 ? handleRegister : nextStep}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#020617" />
                ) : (
                  <>
                    <Text style={styles.navNextText}>{step === 4 ? 'ESTABLISH' : 'CONTINUE'}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#020617" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 97, 0.3)',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  titleGold: {
    color: "#C9A961",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 4,
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  indicatorWrapper: {
    height: 6,
    justifyContent: 'center',
  },
  indicator: {
    height: 4,
    width: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  indicatorActive: {
    backgroundColor: '#C9A961',
    width: 32,
  },
  indicatorComplete: {
    backgroundColor: 'rgba(201, 169, 97, 0.4)',
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
    height: 52,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  certOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
    padding: 16,
    marginBottom: 12,
  },
  certOptionSelected: {
    borderColor: '#C9A961',
    backgroundColor: 'rgba(201, 169, 97, 0.05)',
  },
  certTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  certTitleSelected: {
    color: '#C9A961',
  },
  certSubtitle: {
    color: '#64748B',
    fontSize: 11,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#C9A961',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C9A961',
  },
  reviewBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  reviewValue: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  disclaimer: {
    color: '#475569',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  nav: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  navBack: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBackText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  navNext: {
    flex: 2,
    backgroundColor: '#C9A961',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  navNextText: {
    color: '#020617',
    fontSize: 14,
    fontWeight: '900',
  },
});
