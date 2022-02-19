import React, { FC, useEffect, useRef } from 'react';
import { Text, View, TextInput, LayoutRectangle, StyleSheet } from 'react-native';

import { TouchableOpacity } from '@/components/index';

export interface HeaderBarProps {
  goBack?: () => void;
  goForward?: () => void;
  refresh?: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  title: string;
  uri: string;
  onUri: (uri: string) => void;
  onEditing: (editing: boolean) => void;
  onInputLayout: (layout: LayoutRectangle) => void;
}

const HeaderBar: FC<HeaderBarProps> = ({
  goBack,
  goForward,
  refresh,
  canGoBack,
  canGoForward,
  uri,
  onUri,
  onEditing,
  onInputLayout,
}) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.blur();
  }, [uri]);

  return (
    <View
      style={{
        height: 50,
        alignItems: 'center',
        padding: 10,
        flexDirection: 'row',
      }}>
      <TouchableOpacity style={styles.btnCon} onPress={goBack}>
        <Text
          style={{
            opacity: canGoBack ? 1 : 0.5,
          }}>
          👈
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCon} onPress={goForward}>
        <Text
          style={{
            opacity: canGoForward ? 1 : 0.5,
          }}>
          👉
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCon} onPress={refresh}>
        <Text>♻️</Text>
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        onLayout={e => {
          console.log(e.nativeEvent.layout);
          onInputLayout(e.nativeEvent.layout);
        }}
        style={{
          paddingVertical: 4,
          flex: 1,
          fontSize: 16,
        }}
        defaultValue={uri}
        onSubmitEditing={({ nativeEvent: { text } }) => {
          try {
            const parsed = new URL(text);
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
              onUri(text);
            }
          } catch (e) {
            console.log(e);
          }
        }}
        onFocus={() => {
          onEditing(true);
        }}
        onBlur={() => onEditing(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnCon: {
    paddingHorizontal: 10,
  },
});

export default HeaderBar;
