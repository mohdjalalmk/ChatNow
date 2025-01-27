# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Features

### Core Functionality

- **Stream Chat**: Integrated chat functionality using Stream's SDKs.
- **Supabase Backend**: Used for managing user data and authentication.
- **Push Notifications**: Integrated push notifications for real-time updates.

### Advanced Features

- **Audio & Video Calling**: Powered by Stream's Calling SDKs.
  - Includes prebuilt Stream UI components for audio and video calls.
  - Backend integration for call management and signaling.
- **Push and Call Notifications**:
  - Push notifications for incoming calls.
  - Customizable notifications for call events.
- **Avatar Handling**: User avatars retrieved and displayed using Supabase storage.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your system.
- [Stream Account](https://getstream.io/) with API keys for chat and calling.
- [Supabase Account](https://supabase.com/) for backend services.
- Firebase setup for handling push notifications.

### Installation Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:

     ```env
     EXPO_PUBLIC_STREAM_API_KEY=<your-stream-api-key>
     EXPO_PUBLIC_SUPABASE_URL=<your-supabase-url>
     EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
     ```

4. Configure Firebase:
   - Follow [Expo's guide](https://docs.expo.dev/push-notifications/using-fcm/) to set up Firebase for push notifications.
   - Add the `google-services.json` and `GoogleService-Info.plist` files to your project.

5. Run the app:

   ```bash
   npx expo start
   ```

## Usage

### Starting Chats

- Use the Stream Chat SDK to initialize and manage chat channels.
- Includes user-to-user messaging and group chat functionality.

### Making Audio and Video Calls

1. **Frontend Integration**:
   - Use Stream's prebuilt UI components for audio and video calls.
   - Example:
     ```tsx
     import {
  RingingCallContent,
  StreamCall,
  useCalls,
} from "@stream-io/video-react-native-sdk";

      <StreamCall call={call}>
        <RingingCallContent />
      </StreamCall>
     ```

2. **Backend Setup**:
   - Use Stream's backend APIs for call signaling and management.

### Push Notifications

- Handle push notifications for incoming messages and calls using Firebase Cloud Messaging (FCM).
- Customize call notifications for both iOS and Android.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Stream SDK documentation](https://getstream.io/docs/): Learn about Stream's Chat and Calling SDKs.
- [Supabase documentation](https://supabase.com/docs): Explore Supabase features and APIs.
- [Firebase documentation](https://firebase.google.com/docs): Set up push notifications and real-time updates.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open-source platform and contribute.
- [Stream on GitHub](https://github.com/GetStream): Explore Stream's SDKs and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

