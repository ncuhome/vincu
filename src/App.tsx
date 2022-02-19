import 'react-native-url-polyfill/auto';

import React, { useEffect, useRef, useState } from 'react';
import { View, LayoutRectangle, LayoutAnimation } from 'react-native';
import WebView from 'react-native-webview';

import HeaderBar from '@/components/HeaderBar';
import History, { HistoryItem } from '@/components/History';

const App = () => {
  const webviewRef = useRef<WebView>(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [title, setTitle] = useState('');
  const [uri, setUri] = useState('https://github.com/');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [inputLayout, setInputLayout] = useState<LayoutRectangle>();
  const [loading, setLoading] = useState(false);

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
      <History
        uri={uri}
        editing={editing}
        history={history}
        inputLayout={inputLayout}
        setUri={setUri}
        setTitle={setTitle}
        setEditing={setEditing}
      />
    </View>
  );
};

export default App;
