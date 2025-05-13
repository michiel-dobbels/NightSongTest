import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import { SafeAreaView, StatusBar } from 'react-native';

function ForYouScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1d152b', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>For You Content</Text>
    </View>
  );
}

function FollowingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1d152b', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>Following Content</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function TopTabsNavigator() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1d152b' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1d152b" />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#1d152b',
            marginTop: 65,
          },
          tabBarLabelStyle: {
            color: 'white',
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#7814db',
          },
        }}
      >
        <Tab.Screen name="For you" component={ForYouScreen} />
        <Tab.Screen name="Following" component={FollowingScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
