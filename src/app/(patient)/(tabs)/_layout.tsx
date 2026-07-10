import { View } from 'react-native';
import { Header } from '@/components/header';
import { BottomBar } from '@/components/bottom-bar';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFC' }}>
      <Header />
      <BottomBar />
    </View>
  );
}
