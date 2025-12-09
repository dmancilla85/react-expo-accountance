import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/src/components/HelloWave';
import ParallaxScrollView from '@/src/components/ParallaxScrollView';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { BarPlot } from '@/src/components/plots/BarPlot';
import { CircularBarPlot } from '@/src/components/plots/CircularBarPlot';

export default function Dashboard() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/src/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Incomes and Outcomes</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Incomes</ThemedText>
        <ThemedText>Incomes plot</ThemedText>
        <BarPlot
          data={[
            { _id: 'A', count: 38 },
            { _id: 'B', count: 73 },
            { _id: 'C', count: 15 },
            { _id: 'D', count: 98 },
            { _id: 'E', count: 26 },
            { _id: 'F', count: 65 },
          ]}
          canvasId={'incomes_plot'}
          width={300}
          height={300}
          color={'blue'}
          rotateTextX={0}
          labelY={'incomes'}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Outcomes</ThemedText>
        <ThemedText>Outcomes plot</ThemedText>
        <CircularBarPlot
          data={[
            { _id: 'A', count: 38 },
            { _id: 'B', count: 7 },
            { _id: 'C', count: 15 },
            { _id: 'D', count: 43 },
            { _id: 'E', count: 33 },
            { _id: 'F', count: 98 },
          ]}
          canvasId={'outcomes_plot'}
          width={400}
          height={400}
          color={'red'}
          rotateTextX={0}
          labelY={'outcomes'}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
