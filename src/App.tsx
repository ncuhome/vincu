import 'react-native-url-polyfill/auto';

import React, { useEffect, useRef, useState } from 'react';
import { View, LayoutAnimation, Text } from 'react-native';
import WebView from 'react-native-webview';
import { useStore } from '@/store';

import HeaderBar from '@/components/HeaderBar';
import History from '@/components/History';

const App = () => {
  const webviewRef = useRef<WebView>(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const { uri, title, history, setLoading, setTitle, setUri, setHistory } =
    useStore((state) => state);

  useEffect(() => {
    if (uri.length > 0 && title.length > 0) {
      LayoutAnimation.easeInEaseOut();
      const filtered = history.filter((item) => item.uri !== uri);
      setHistory([
        {
          uri,
          title,
        },
        ...filtered,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      />
      {uri?.length > 0 ? (
        <WebView
          ref={webviewRef}
          source={{ uri }}
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
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>No URL</Text>
        </View>
      )}
      <History />
    </View>
  );
};

export default App;
