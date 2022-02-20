import React, { useState, FC } from 'react';
import {
  Text,
  View,
  LayoutAnimation,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { debounce } from 'lodash';

import { TouchableOpacity } from '@/components/index';
import { useColors } from '@/hooks';
import { useStore } from '@/store';

export interface HistoryItem {
  uri: string;
  title: string;
}

const History: FC = () => {
  const { editing, history, inputLayout, uri, setTitle, setUri, setEditing } =
    useStore((state) => state);

  const { height } = useWindowDimensions();
  const [scrolling, setScrolling] = useState(false);
  const colors = useColors();
  const [historyItemHovering, setHistoryItemHovering] = useState(-1);

  const delayHoverTrigger = debounce((i: number) => {
    LayoutAnimation.easeInEaseOut();
    setHistoryItemHovering(i);
  });

  if (editing && history.length > 1) {
    return (
      <>
        <View
          style={{
            width: inputLayout?.width || 0,
            position: 'absolute',
            left: inputLayout?.x,
            top: (inputLayout?.y ?? 0) + 30,
            overflow: 'visible',
            zIndex: 1000,
            backgroundColor: colors.deepBg,
            padding: 8,
            borderRadius: 8,
            maxHeight: height * 0.7,
          }}
        >
          <ScrollView
            onMomentumScrollEnd={() => {
              setScrolling(false);
            }}
            onMomentumScrollBegin={() => {
              setScrolling(true);
            }}
          >
            {history.map(
              (item, i) =>
                item.uri !== uri && (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (scrolling) {
                        return;
                      }
                      LayoutAnimation.easeInEaseOut();
                      setUri(item.uri);
                      setTitle(item.title);
                      setEditing(false);
                    }}
                    onMouseEnter={() => {
                      if (scrolling) {
                        return;
                      }
                      delayHoverTrigger(i);
                    }}
                    onMouseLeave={() => {
                      if (scrolling) {
                        return;
                      }
                      delayHoverTrigger(-1);
                    }}
                  >
                    <View
                      style={{
                        padding: 8,
                        margin: 6,
                        backgroundColor: colors.bg,
                        borderRadius: 4,
                        opacity: historyItemHovering === i ? 1 : 0.8,
                      }}
                    >
                      <Text style={styles.title}>{item.title}</Text>
                      <Text numberOfLines={1} style={styles.subtitle}>
                        {item.uri}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
            )}
          </ScrollView>
        </View>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              top: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          ]}
          pointerEvents="none"
        />
      </>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default History;
