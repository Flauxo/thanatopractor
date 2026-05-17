import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {

    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Configure WKWebView
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.allowsInlineMediaPlayback = true
        webConfiguration.mediaTypesRequiringUserActionForPlayback = []
        
        let preferences = WKWebpagePreferences()
        preferences.allowsContentJavaScript = true
        webConfiguration.defaultWebpagePreferences = preferences
        
        // Enable local storage persistence
        webConfiguration.websiteDataStore = WKWebsiteDataStore.default()

        webView = WKWebView(frame: view.bounds, configuration: webConfiguration)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.backgroundColor = UIColor(red: 10/255.0, green: 6/255.0, blue: 16/255.0, alpha: 1.0)
        webView.isOpaque = true
        
        view.addSubview(webView)
        
        // Load local index.html from www folder
        if let bundlePath = Bundle.main.path(forResource: "www", ofType: nil),
           let htmlPath = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "www") {
            let htmlURL = URL(fileURLWithPath: htmlPath)
            let accessURL = URL(fileURLWithPath: bundlePath)
            webView.loadFileURL(htmlURL, allowingReadAccessTo: accessURL)
        }
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .all
    }

    // MARK: - WKUIDelegate (Support JavaScript Alerts/Confirm)
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: "Thanatopractor", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in completionHandler() }))
        present(alert, animated: true, completion: nil)
    }
}
