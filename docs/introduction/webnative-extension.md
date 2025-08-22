[🔙](../../README.md#introduction)

# WebNative extension 🔮

[WebNative VSCode Extension](https://marketplace.visualstudio.com/items?itemName=WebNative.webnative) helps you perform various functions that are common to developing an Ionic app. Functions such as running the app locally on Android & iOS device, or upgrading Capacitor core dependencies.

Some useful functionalities that the extension offers:

- [Remote Logging](https://capacitorjs.com/docs/vscode/debugging#remote-logging): Select `Settings > Logging` to filter what is logged to the output window, when you've already opened '[Nexus Browser](https://capacitor.nexusbrowser.com/capacitor)' app in your mobile device and selected `Run > Web` in the extension.

- [Live Reload](https://capacitorjs.com/docs/vscode/build-and-run#live-reload): Select `Settings > Live Reload` to turn on live-reload when running your app on a mobile device.

- [Debug in VS Code](https://capacitorjs.com/docs/vscode/debugging#debug-in-vs-code): Select `Debug > Web` to launch a debuggable web browser (e.g., Chrome), and put VS Code into debugging mode.

- [Attach to Web View](https://capacitorjs.com/docs/vscode/debugging#attach-to-web-view): Select `Run > Android` to run real or emulated Android Device. For debugging you can then open `chrome://inspect` url in Chrome browser to see the running web views, open your target, and then Use Chrome's debugging tools.

- [Updating Capacitor](https://capacitorjs.com/docs/vscode/dependencies#updating-capacitor): Select `Packages > @Capacitor` to upgrade all Capacitor core dependencies at one time.  
  **Tip!** Though this functionality might not be required, because we upgrade our workspace (all dependencies including Capacitor) by the NX migration.

- [Native Settings](https://capacitorjs.com/docs/vscode/native-settings): Select `Configuration > Properties` to change native projects configs.  
  **Tip!** Though this functionality might not be required, because most of the native configs can be defined in pipelines, when the app is going to get client-specific (branded).

- [Splash-Screen & Icon](https://capacitorjs.com/docs/vscode/splash-icon): Select `Configuration > Splash Screen & Icon` to generate Splash-Screen & Icon files.  
  **Tip!** Splash-Screen should be a 2732x2732 pixel `.png` file. Icon should be a 1024x1024 pixel `.png` file.  
  **Tip!** Though this functionality might not be required, because Splash-Screen & Icon files will be generated in pipelines, when the app is going to get client-specific (branded).

[Click here](https://ionicframework.com/docs/intro/vscode-extension) to learn more about this extension.

[🔙](../../README.md#introduction)
