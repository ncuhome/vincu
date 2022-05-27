//
//  ContentView.swift
//  Shared
//
//  Created by kuss on 2022/5/26.
//

import SwiftUI
import WebKit

extension URL {
    func query(_ queryParameterName: String) -> String? {
        guard let url = URLComponents(string: self.absoluteString) else { return nil }
        return url.queryItems?.first(where: { $0.name == queryParameterName })?.value
    }
}

extension String {
    var isValidURL: Bool {
        let detector = try! NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
        if let match = detector.firstMatch(in: self, options: [], range: NSRange(location: 0, length: self.utf16.count)) {
            // it is a link, if the match covers the whole string
            return match.range.length == self.utf16.count
        } else {
            return false
        }
    }
}

struct ContentView: View {
    @State private var action = WebViewAction.idle
    @State private var state = WebViewState.empty
    @State private var address = "https://incu.ncuos.com/"
    private let contentController: WKUserContentController
    
    init() {
        let script = """
    window.appReady = true;
    window.ReactNativeWebView = window.webkit.messageHandlers.SwiftUIWebView;
    window.appData = {
      user: {
        token: '',
        colorScheme: 'light',
        colors: {},
        inset: { top: 0, right: 0, bottom: 0, left: 0 },
        profile: {
          basicProfile: {
            app_avatar_url: '',
            department: '',
            department_id: '',
            head_pic_url: '',
            max_role_level: 0,
            message: '',
            name: '',
            status: 0,
          },
          entireProfile: {
            base_info: {
                xb: {}
            },
            is_teacher: false,
            message: '',
            status: 0,
          },
        },
      }
    };
    """

        let userScript = WKUserScript(source: script, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        
        let contentController = WKUserContentController()
            
        contentController.addUserScript(userScript)
        
        self.contentController = contentController

    }
    
    func onMessage(message: WKScriptMessage) {
        print(message.name, message.body)
    }
    
    var body: some View {
        navigationToolbar
        Divider()
        WebView(action: $action, state: $state, contentController: self.contentController,
                onMessage: onMessage).onAppear(perform: onLoad)
            .handlesExternalEvents(preferring: Set(arrayLiteral: "*"), allowing: Set(arrayLiteral: "*"))
            .onOpenURL(perform: {scheme in
                print(scheme)
                let url = scheme.query("url")
                
 
                if let nextUrl = url {
                    if nextUrl.isValidURL {
                        address = nextUrl;
                        onLoad()
                    }
                }
            })
    }
    
    func onLoad() {
        if let url = URL(string: address) {
            action = .load(URLRequest(url: url))
        }
    }
    
    private var navigationToolbar: some View {
        HStack(spacing: 10) {
            TextField("Address", text: $address)
                .onSubmit {
                    onLoad()
                }
            if state.isLoading {
                if #available(iOS 14, macOS 11, *) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                } else {
                    Text("Loading")
                }
            }
            Spacer()
            Button("Go") {
                onLoad()
            }
            Button(action: {
                action = .reload
            }) {
                if #available(iOS 14, macOS 11, *) {
                    Image(systemName: "arrow.counterclockwise")
                        .imageScale(.large)
                } else {
                    Text("Reload")
                }
            }
            if state.canGoBack {
                Button(action: {
                    action = .goBack
                }) {
                    if #available(iOS 14, macOS 11, *) {
                        Image(systemName: "chevron.left")
                            .imageScale(.large)
                    } else {
                        Text("<")
                    }
                }
            }
            if state.canGoForward {
                Button(action: {
                    action = .goForward
                }) {
                    if #available(iOS 14, macOS 11, *) {
                        Image(systemName: "chevron.right")
                            .imageScale(.large)
                    } else {
                        Text(">")
                    }
                }
            }
            Button("Test") {
                action = .evaluateJS("""
                                     (function() {
                                        alert(1);
                                     })();
""", noop);
            }
        }.padding(.horizontal, 10)
            .padding(.top, 10)
    }
    
    func noop(arg: Result<Any?, Error>) -> Void {
        print(arg)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
