import 'react-native-url-polyfill/auto';

import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  LayoutRectangle,
  LayoutAnimation,
  StyleSheet,
  ScrollView,
} from 'react-native';
import WebView from 'react-native-webview';
import { debounce } from 'lodash';

import { TouchableOpacity, HeaderBar } from '@/components/index';
import { useColors } from '@/hooks';

interface HistoryItem {
  uri: string;
  title: string;
}

const App = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [title, setTitle] = useState('');
  const [uri, setUri] = useState('https://github.com/');
  const webviewRef = useRef<WebView>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [inputLayout, setInputLayout] = useState<LayoutRectangle>();
  const [historyItemHovering, setHistoryItemHovering] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const colors = useColors();

  const delayHoverTrigger = debounce((i: number) => {
    LayoutAnimation.easeInEaseOut();
    setHistoryItemHovering(i);
  });

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
    setHistory((prevHistory) => {
      const filtered = prevHistory.filter((item) => item.uri !== uri);
      return [
        {
          uri,
          title,
        },
        ...filtered,
      ];
    });
  }, [uri, title]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <HeaderBar
        goBack={webviewRef.current?.goBack}
        goForward={webviewRef.current?.goForward}
        refresh={webviewRef?.current?.reload}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onUri={setUri}
        uri={uri}
        title={title}
        onEditing={setEditing}
        onInputLayout={setInputLayout}
        loading={loading}
        editing={editing}
      />
      <WebView
        ref={webviewRef}
        source={{ uri: uri }}
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
        }}
        onLoadEnd={({ nativeEvent: e }) => {
          setCanGoBack(e.canGoBack);
          setCanGoForward(e.canGoForward);
          setUri(e.url);
          setTitle(e.title);
          setLoading(e.loading);
        }}
        onLoadStart={() => setLoading(true)}
      />
      {editing && history.length > 1 && (
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
              maxHeight: 600,
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
      )}
    </View>
  );
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

export default App;
