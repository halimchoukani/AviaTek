import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Courses() {
  return (
    <SafeAreaView className="flex-1 bg-primary items-center justify-center">
      <Text className="text-white text-xl font-bold">Courses</Text>
    </SafeAreaView>
  );
}
