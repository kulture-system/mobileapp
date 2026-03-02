import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform, Linking, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialIcons name={open ? "expand-less" : "expand-more"} size={22} />
      </Pressable>

      {open ? <View style={styles.sectionBody}>{children}</View> : null}
    </View>
  );
}

function LinkText({ href, label }: { href: string; label: string }) {
  const canOpen = useMemo(() => typeof href === "string" && href.length > 0, [href]);

  return (
    <Pressable
      accessibilityRole="link"
      disabled={!canOpen}
      onPress={async () => {
        try {
          const supported = await Linking.canOpenURL(href);
          if (!supported) return;
          await Linking.openURL(href);
        } catch {
          // swallow: avoid crashing UI on restricted environments
        }
      }}
      style={styles.linkButton}
    >
      <Text style={styles.linkText}>{label}</Text>
      <MaterialIcons name="open-in-new" size={16} />
    </Pressable>
  );
}

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="code" size={96} style={styles.headerIcon} />
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>This screen documents the starter routing + platform tips.</Text>
      </View>

      <Section title="File-based routing">
        <Text style={styles.p}>
          This app uses Expo Router. Tabs live under <Text style={styles.bold}>app/(tabs)</Text>.
        </Text>
        <Text style={styles.p}>
          Home: <Text style={styles.mono}>app/(tabs)/index.tsx</Text>
        </Text>
        <Text style={styles.p}>
          Explore: <Text style={styles.mono}>app/(tabs)/explore.tsx</Text>
        </Text>
        <Text style={styles.p}>
          The tab navigator is defined in <Text style={styles.mono}>app/(tabs)/_layout.tsx</Text>.
        </Text>
        <LinkText href="https://docs.expo.dev/router/introduction/" label="Expo Router docs" />
      </Section>

      <Section title="Android, iOS, and web support">
        <Text style={styles.p}>
          You can run this project on Android, iOS, and web. For web, run{" "}
          <Text style={styles.mono}>npx expo start --web</Text>.
        </Text>
      </Section>

      <Section title="Images">
        <Text style={styles.p}>
          For static images, include <Text style={styles.bold}>@2x</Text> and <Text style={styles.bold}>@3x</Text>{" "}
          variants for different screen densities.
        </Text>
        <LinkText href="https://reactnative.dev/docs/images" label="React Native Images docs" />
      </Section>

      <Section title="Light and dark mode">
        <Text style={styles.p}>
          Use <Text style={styles.mono}>useColorScheme()</Text> to detect the user’s theme and adjust colors.
        </Text>
        <LinkText
          href="https://docs.expo.dev/develop/user-interface/color-themes/"
          label="Expo color themes guide"
        />
      </Section>

      <Section title="Animations">
        <Text style={styles.p}>
          For high-performance animations, use <Text style={styles.bold}>react-native-reanimated</Text>.
        </Text>
        {Platform.OS === "ios" ? (
          <Text style={styles.p}>
            iOS often benefits from native-feeling transitions; keep animations subtle and avoid blocking JS.
          </Text>
        ) : null}
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    marginBottom: 16
  },
  headerIcon: {
    alignSelf: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8
  },
  subtitle: {
    textAlign: "center",
    marginTop: 6,
    opacity: 0.8
  },
  section: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 12,
    marginTop: 12
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700"
  },
  sectionBody: {
    marginTop: 10
  },
  p: {
    marginBottom: 8,
    lineHeight: 20
  },
  bold: {
    fontWeight: "700"
  },
  mono: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
    fontSize: 13
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6
  },
  linkText: {
    fontWeight: "700",
    textDecorationLine: "underline"
  }
});