// ============================================================
// BottomSheet Component
// ============================================================

import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius } from '@/constants/theme';

interface BottomSheetProps {
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  onDismiss?: () => void;
  scrollable?: boolean;
  children: React.ReactNode;
}

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  (
    {
      snapPoints = ['50%'],
      enablePanDownToClose = true,
      onDismiss,
      scrollable = true,
      children,
    },
    ref
  ) => {
    const theme = useThemeColor();
    const defaultSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.5}
      />
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={defaultSnapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.surface,
          borderRadius: BorderRadius['2xl'],
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.border,
          width: 40,
        }}
      >
        {scrollable ? (
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView style={styles.contentContainer}>
            {children}
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    padding: 24,
  },
});
