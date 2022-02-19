import 'react-native-url-polyfill/auto';

import React, { useEffect, useRef, useState } from 'react';
import { Text, View, LayoutRectangle } from 'react-native';
import WebView from 'react-native-webview';

import { TouchableOpacity, HeaderBar } from '@/components/index';

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

  useEffect(() => {
    setHistory((prevHistory) => {
      const filtered = prevHistory.filter(item => item !== uri);
      return [uri, ...filtered];
    });
  }, [uri]);

  return (
    <View
      style={{
        flex: 1,
      }}>
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
        }}
      />
      {editing && history.length > 0 && (
        <View
          style={{
            width: inputLayout?.width || 0,
            position: 'absolute',
            left: inputLayout?.x,
            top: (inputLayout?.y ?? 0) + 20,
            overflow: 'visible',
            zIndex: 1000,
            backgroundColor: '#111',
            padding: 8,
            borderRadius: 8,
          }}>
          {history.map(
            (historyUri, i) =>
              historyUri !== uri && (
                <TouchableOpacity
                  key={i}
                  style={{
                    padding: 8,
                    margin: 3,
                    backgroundColor:
                      historyItemHovering === i ? '#222' : '#333',
                    borderRadius: 4,
                  }}
                  onPress={() => {
                    setUri(historyUri);
                    setEditing(false);
                  }}
                  onMouseEnter={() => {
                    setHistoryItemHovering(i);
                  }}
                  onMouseLeave={() => {
                    setHistoryItemHovering(-1);
                  }}>
                  <Text numberOfLines={1}>{historyUri}</Text>
                </TouchableOpacity>
              ),
          )}
        </View>
      )}
    </View>
  );
};

export default App;
