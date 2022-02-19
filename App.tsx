import 'react-native-url-polyfill/auto';

import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  LayoutRectangle,
  LayoutAnimation,
  StyleSheet,
} from 'react-native';
import WebView from 'react-native-webview';

import { TouchableOpacity, HeaderBar } from '@/components/index';
import { useColors } from '@/hooks';

const App = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [title, setTitle] = useState('');
  const [uri, setUri] = useState('https://github.com/');
  const webviewRef = useRef<WebView>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [inputLayout, setInputLayout] = useState<LayoutRectangle>();
  const [historyItemHovering, setHistoryItemHovering] = useState(-1);
  const [loading, setLoading] = useState(false);
  const colors = useColors();

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
    setHistory((prevHistory) => {
      const filtered = prevHistory.filter((item) => item !== uri);
      return [uri, ...filtered];
    });
  }, [uri]);

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
      {editing && history.length > 0 && (
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
            }}
          >
            {history.map(
              (historyUri, i) =>
                historyUri !== uri && (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      LayoutAnimation.easeInEaseOut();
                      setUri(historyUri);
                      setEditing(false);
                    }}
                    onMouseEnter={() => {
                      LayoutAnimation.easeInEaseOut();
                      setHistoryItemHovering(i);
                    }}
                    onMouseLeave={() => {
                      LayoutAnimation.easeInEaseOut();
                      setHistoryItemHovering(-1);
                    }}
                  >
                    <View
                      style={{
                        padding: 8,
                        margin: 3,
                        backgroundColor: colors.bg,
                        borderRadius: 4,
                        opacity: historyItemHovering === i ? 1 : 0.8,
                      }}
                    >
                      <Text numberOfLines={1}>{historyUri}</Text>
                    </View>
                  </TouchableOpacity>
                )
            )}
          </View>
          <View
            style={[
              StyleSheet.absoluteFill,
              {
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

export default App;
