import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Requests() {
  return (
    <SafeAreaView className="flex-1 bg-primary items-center justify-center">
      <Text className="text-white text-xl font-bold">Requests</Text>
    </SafeAreaView>
  );
}
