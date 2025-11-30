const theme = {
colors: {
background: '#ffffff', // Clean white background for light, airy feel
primary: '#4a90e2', // Bold blue for main buttons and highlights
secondary: '#d3d3d3', // Light gray backgrounds & containers
textPrimary: '#222222', // Dark gray for main text
textSecondary: '#555555', // Medium gray for subtitles & descriptions
accent: '#f05a28', // Warm, confident orange accent for calls to action or highlights
inputBackground: '#fafafa', // Slightly off-white for inputs, gentle on eyes
border: '#b0b0b0', // Soft borders around inputs and cards
},
fontSizes: {
title: 32,
subtitle: 18,
sectionTitle: 20,
userLabel: 20,
normal: 16,
small: 14,
},
spacing: {
small: 8,
medium: 12,
large: 20,
xLarge: 32,
},
borderRadius: 6,
};

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
buttonPrimary: {
  backgroundColor: theme.colors.primary,
  paddingVertical: theme.spacing.medium,
  paddingHorizontal: theme.spacing.large,  // Added horizontal padding for width
  borderRadius: theme.borderRadius,
  alignItems: 'center',
  marginVertical: theme.spacing.small,
  minWidth: 150,  // Minimum width so button never shrinks too small
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

buttonDanger: {
  backgroundColor: '#d9534f',
  paddingVertical: theme.spacing.medium,
  paddingHorizontal: theme.spacing.large,  // Same here
  borderRadius: theme.borderRadius,
  alignItems: 'center',
  marginVertical: theme.spacing.small,
  minWidth: 150,  // Consistent minimum width
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

// Text inside the primary button
buttonPrimaryText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: theme.fontSizes.normal,
},

buttonDangerText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: theme.fontSizes.normal,
},

// DropDownPicker styles using theme colors
dropDownContainer: {
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.border,
  borderRadius: theme.borderRadius,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

dropDownStyle: {
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.border,
  borderRadius: theme.borderRadius,
},

dropDownText: {
  color: theme.colors.textPrimary,
  fontWeight: '500',
  fontSize: theme.fontSizes.normal,
},



container: {
flex: 1,
backgroundColor: theme.colors.background,
paddingHorizontal: theme.spacing.medium,
paddingTop: theme.spacing.large,
},
center: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
title: {
fontSize: theme.fontSizes.title,
fontWeight: 'bold',
marginBottom: theme.spacing.medium,
color: theme.colors.textPrimary,
textAlign: 'center',
},
subtitle: {
fontSize: theme.fontSizes.subtitle,
color: theme.colors.textSecondary,
textAlign: 'center',
},
welcome: {
marginTop: theme.spacing.large,
fontSize: theme.fontSizes.userLabel,
fontWeight: 'bold',
textAlign: 'center',
color: theme.colors.textPrimary,
},
dayText: {
fontSize: theme.fontSizes.sectionTitle,
fontWeight: 'bold',
marginBottom: theme.spacing.medium,
textAlign: 'center',
color: theme.colors.textPrimary,
},
userGroup: {
marginBottom: theme.spacing.large,
},
userLabel: {
fontWeight: '700',
fontSize: theme.fontSizes.userLabel,
textAlign: 'center',
marginBottom: theme.spacing.small,
color: theme.colors.textPrimary,
},
noWorkouts: {
fontStyle: 'italic',
color: theme.colors.textSecondary,
textAlign: 'center',
},
workoutItem: {
backgroundColor: theme.colors.inputBackground,
padding: theme.spacing.medium,
marginBottom: theme.spacing.small,
borderRadius: theme.borderRadius,
borderWidth: 1,
borderColor: theme.colors.border,
},
workoutName: {
fontWeight: 'bold',
fontSize: theme.fontSizes.normal,
marginBottom: theme.spacing.small / 2,
color: theme.colors.textPrimary,
},
sectionTitle: {
fontWeight: 'bold',
fontSize: theme.fontSizes.sectionTitle,
marginBottom: theme.spacing.medium,
color: theme.colors.textPrimary,
},
duoLabel: {
fontWeight: '700',
fontSize: 18,
textAlign: 'center',
marginBottom: theme.spacing.small,
color: theme.colors.textPrimary,
},
rowLabel: {
fontWeight: '600',
fontSize: theme.fontSizes.normal,
marginBottom: theme.spacing.small / 2,
color: theme.colors.textPrimary,
},
row: {
flexDirection: 'row',
justifyContent: 'space-between',
marginBottom: theme.spacing.medium,
},
inputSmall: {
flex: 1,
marginHorizontal: 4,
backgroundColor: theme.colors.background,
borderRadius: theme.borderRadius,
borderWidth: 1,
borderColor: theme.colors.border,
padding: 8,
fontSize: theme.fontSizes.normal,
textAlign: 'center',
maxWidth: 80,
color: theme.colors.textPrimary,
},
input: {
backgroundColor: theme.colors.background,
marginBottom: theme.spacing.medium,
borderRadius: theme.borderRadius,
borderColor: theme.colors.border,
borderWidth: 1,
paddingHorizontal: 12,
paddingVertical: 8,
fontSize: theme.fontSizes.normal,
color: theme.colors.textPrimary,
},
loggedInText: {
textAlign: 'center',
marginVertical: theme.spacing.medium / 1.5,
fontSize: 16,
fontWeight: '600',
color: theme.colors.textPrimary,
},
centeredContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.colors.background,
  paddingHorizontal: theme.spacing.medium,
  paddingTop: 0, // no top padding to keep text vertically centered
},
});

export { styles, theme };