# canIParkHereApp

Can I Park is an open source iOS app that helps drivers to understand whether street side parking is allowed or not.

The app is written in React Native using Mapbox and Redux. The backend is an Express server fetching the external data, transforming it to my data model and passes it to the frontend. It can be extended to multiple cities with little effort.

# Setup instructions (iOS)

1. Clone the project: git clone git@github.com:tehvicke/can-i-park-app.git

2. Create .env in the root directory containing the Mapbox API key that's required (it can be created for free on https://account.mapbox.com/access-tokens/, the 'Default public token' is sufficient)
   "MAPBOX_API_KEY": "SECRET API KEY"

3. Install node packages: npm i

4. Install pods: cd ios && pod install && cd ..

5. Start the simulator with npx react-native run-ios --simulator
