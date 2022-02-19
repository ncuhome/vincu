import React, { FC, useEffect, useRef } from 'react';
import { Text, View, TextInput, LayoutRectangle, StyleSheet, ActivityIndicator, LayoutAnimation } from 'react-native';

import { TouchableOpacity } from '@/components/index';
import { useColors } from '@/hooks';

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
  loading: boolean;
  editing: boolean;
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
  loading,
  editing,
}) => {
  const colors = useColors();
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
      {
        editing &&
        <View
          style={[StyleSheet.absoluteFill,
          {
            backgroundColor: colors.deepBg,
          }]}
        />

      }
      <View style={{
        padding: 6,
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        backgroundColor: colors.deepBg,
        borderRadius: 32,
      }}
        onLayout={e => {
          onInputLayout(e.nativeEvent.layout);
        }}
      >
        <TextInput
          ref={inputRef}
          style={{
            flex: 1,
            fontSize: 16,
            paddingHorizontal: 4,
          }}
          onSubmitEditing={({ nativeEvent: { text } }) => {
            try {
              const parsed = new URL(text);
              if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                LayoutAnimation.easeInEaseOut();
                onUri(text);
              }
            } catch (e) {
              console.log(e);
            }
          }}
          onFocus={() => {
            LayoutAnimation.easeInEaseOut();
            onEditing(true);
          }}
          onBlur={() => {
            LayoutAnimation.easeInEaseOut();
            onEditing(false);
          }}
          // @ts-ignore
          enableFocusRing={false}
          selectTextOnFocus
          defaultValue={uri}
          placeholder="Enter URL"
        />
        {loading &&
          <ActivityIndicator style={{
            position: 'absolute',
            alignSelf: 'center',
            right: 8,
          }} />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnCon: {
    paddingHorizontal: 10,
  },
});

export default HeaderBar;
