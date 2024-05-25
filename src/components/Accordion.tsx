import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { Square } from 'tamagui';

export default function Accordion({ title, details }: { title: string; details: string }) {
  const [opened, setOpened] = useState(false);

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  function toggleAccordion() {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeIn', property: 'opacity' },
      update: { type: 'linear', springDamping: 0.3, duration: 250 },
    });
    setOpened(!opened);
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>

          <Square animation="quick" rotate={opened ? '180deg' : '0deg'}>
            <Ionicons name="chevron-down" size={16} />
          </Square>
        </View>
      </TouchableWithoutFeedback>

      {opened && (
        <View style={[styles.content]}>
          <Text style={styles.details}>{details}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  details: {
    opacity: 0.65,
    fontFamily: 'RalewayRegular',
  },
  title: {
    fontFamily: 'RalewaySemiBold',
    maxWidth: '90%',
  },
  content: {
    marginTop: 15,
  },
  container: {
    padding: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EBEDF3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
