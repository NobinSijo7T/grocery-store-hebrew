// ============================================================
// ProductFormModal — Add / Edit Product
// ============================================================

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';

import { supabase } from '@/lib/supabase';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { BorderRadius, Shadows, Spacing, Typography } from '@/constants/theme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import type { Category, Product } from '@/types/models';

// -------------------------
// Types
// -------------------------
interface ProductFormData {
  name_he: string;
  name_en: string;
  description_he: string;
  price: string;
  discount_price: string;
  unit: string;
  stock_qty: string;
  category_id: string;
  image_url: string;
  seasonal_tag: string;
  is_active: boolean;
  is_featured: boolean;
  is_offer: boolean;
  is_organic: boolean;
}

interface ProductFormModalProps {
  visible: boolean;
  product?: Product | null; // null = add mode, Product = edit mode
  onClose: () => void;
  onSaved: () => void;
}

const UNIT_OPTIONS = ['יחידה', 'ק"ג', 'חבילה', 'ליטר', 'תבנית', 'צרור', 'קופסה'];

const EMPTY_FORM: ProductFormData = {
  name_he: '',
  name_en: '',
  description_he: '',
  price: '',
  discount_price: '',
  unit: 'יחידה',
  stock_qty: '0',
  category_id: '',
  image_url: '',
  seasonal_tag: '',
  is_active: true,
  is_featured: false,
  is_offer: false,
  is_organic: false,
};

// -------------------------
// Helpers
// -------------------------
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .trim() + '-' + Date.now();
}

// -------------------------
// Sub-components
// -------------------------
function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  isRTL = false,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
  isRTL?: boolean;
}) {
  const theme = useThemeColor();
  const [focused, setFocused] = useState(false);

  return (
    <View style={fieldStyles.wrapper}>
      <Text variant="sm" weight="medium" style={[fieldStyles.label, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <TextInput
        style={[
          fieldStyles.input,
          multiline && fieldStyles.multilineInput,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: focused ? theme.primary : theme.border,
            color: theme.text,
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
  tint,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  tint?: string;
}) {
  const theme = useThemeColor();
  return (
    <View style={[fieldStyles.toggleRow, { borderBottomColor: theme.borderLight }]}>
      <Text variant="md">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: tint ?? theme.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

// -------------------------
// Main Component
// -------------------------
export function ProductFormModal({ visible, product, onClose, onSaved }: ProductFormModalProps) {
  const theme = useThemeColor();
  const { language } = useTranslation();
  const isRTL = language === 'he';

  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const isEditMode = !!product;

  // Load categories
  useEffect(() => {
    if (!visible) return;
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
      });
  }, [visible]);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setForm({
        name_he: product.name_he ?? '',
        name_en: product.name_en ?? '',
        description_he: product.description_he ?? '',
        price: String(product.price ?? ''),
        discount_price: product.discount_price != null ? String(product.discount_price) : '',
        unit: product.unit ?? 'יחידה',
        stock_qty: String(product.stock_qty ?? 0),
        category_id: product.category_id ?? '',
        image_url: product.image_url ?? '',
        seasonal_tag: product.seasonal_tag ?? '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        is_offer: product.is_offer ?? false,
        is_organic: product.is_organic ?? false,
      });
      setLocalImageUri(null);
    } else {
      setForm(EMPTY_FORM);
      setLocalImageUri(null);
    }
  }, [product, visible]);

  const setField = useCallback(<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  // ---- Image Picker ----
  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        isRTL ? 'נדרשת הרשאה' : 'Permission Required',
        isRTL ? 'אנא אפשר גישה לגלריה בהגדרות.' : 'Please allow photo library access in settings.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLocalImageUri(result.assets[0].uri);
      setField('image_url', result.assets[0].uri); // temporary, replaced on save
    }
  };

  // ---- Upload image to Supabase Storage ----
  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const ext = uri.split('.').pop() ?? 'jpg';
      const fileName = `product-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, blob, { contentType: `image/${ext}`, upsert: true });

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return publicUrl.publicUrl;
    } catch (err: any) {
      Alert.alert(
        isRTL ? 'שגיאה בהעלאת תמונה' : 'Image Upload Error',
        err.message
      );
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // ---- Validation ----
  const validate = (): string | null => {
    if (!form.name_he.trim()) return isRTL ? 'שם המוצר (עברית) הוא שדה חובה' : 'Hebrew product name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) return isRTL ? 'מחיר לא תקין' : 'Invalid price';
    if (!form.category_id) return isRTL ? 'נא לבחור קטגוריה' : 'Please select a category';
    if (form.discount_price && (isNaN(Number(form.discount_price)) || Number(form.discount_price) < 0)) return isRTL ? 'מחיר מבצע לא תקין' : 'Invalid discount price';
    return null;
  };

  // ---- Save ----
  const handleSave = async () => {
    const err = validate();
    if (err) {
      Alert.alert(isRTL ? 'שגיאה' : 'Error', err);
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = form.image_url;

      // Upload new image if a local URI was picked
      if (localImageUri) {
        const uploaded = await uploadImage(localImageUri);
        if (uploaded) finalImageUrl = uploaded;
      }

      const payload: any = {
        name_he: form.name_he.trim(),
        name_en: form.name_en.trim() || null,
        description_he: form.description_he.trim() || null,
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        unit: form.unit,
        stock_qty: parseInt(form.stock_qty, 10) || 0,
        category_id: form.category_id,
        image_url: finalImageUrl || null,
        seasonal_tag: form.seasonal_tag.trim() || null,
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_offer: form.is_offer,
        is_organic: form.is_organic,
      };

      if (isEditMode) {
        payload.updated_at = new Date().toISOString();
        const { error } = await supabase.from('products').update(payload).eq('id', product!.id);
        if (error) throw error;
      } else {
        payload.slug = slugify(form.name_he);
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }

      onSaved();
      onClose();
    } catch (e: any) {
      Alert.alert(isRTL ? 'שגיאה בשמירה' : 'Save Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete ----
  const handleDelete = () => {
    Alert.alert(
      isRTL ? 'מחיקת מוצר' : 'Delete Product',
      isRTL ? `האם אתה בטוח שברצונך למחוק את "${form.name_he}"?` : `Delete "${form.name_he}"? This cannot be undone.`,
      [
        { text: isRTL ? 'ביטול' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'מחק' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            const { error } = await supabase.from('products').delete().eq('id', product!.id);
            setDeleting(false);
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              onSaved();
              onClose();
            }
          },
        },
      ]
    );
  };

  const selectedCategory = categories.find(c => c.id === form.category_id);
  const displayImage = localImageUri ?? (form.image_url || null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <Pressable onPress={onClose} style={styles.headerBtn} hitSlop={8}>
            <MaterialIcons name="close" size={24} color={theme.text} />
          </Pressable>
          <Text variant="lg" weight="bold">
            {isEditMode
              ? (isRTL ? 'עריכת מוצר' : 'Edit Product')
              : (isRTL ? 'הוספת מוצר' : 'Add Product')
            }
          </Text>
          <Pressable
            onPress={handleSave}
            disabled={saving || uploadingImage}
            style={[styles.headerBtn, styles.saveBtn, { backgroundColor: theme.primary }]}
            hitSlop={8}
          >
            {saving || uploadingImage ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text variant="sm" weight="bold" color="#fff">
                {isRTL ? 'שמור' : 'Save'}
              </Text>
            )}
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled={Platform.OS === 'ios'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            {/* Image Picker */}
            <Animated.View entering={FadeIn.duration(300)} style={styles.imageSection}>
              <TouchableOpacity
                style={[styles.imagePicker, { borderColor: theme.border, backgroundColor: theme.surface }]}
                onPress={handlePickImage}
                activeOpacity={0.8}
              >
                {displayImage ? (
                  <>
                    <Image
                      source={{ uri: displayImage }}
                      style={styles.imagePreview}
                      contentFit="cover"
                    />
                    <View style={styles.imageOverlay}>
                      <MaterialIcons name="edit" size={22} color="#fff" />
                    </View>
                  </>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <MaterialIcons name="add-photo-alternate" size={40} color={theme.textTertiary} />
                    <Text variant="sm" color={theme.textTertiary} style={{ marginTop: Spacing.sm }}>
                      {isRTL ? 'הוסף תמונה' : 'Add Image'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Section: Basic Info */}
            <Animated.View entering={FadeInDown.delay(60).duration(300)} style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.borderLight }]}>
              <Text variant="sm" weight="semiBold" color={theme.textTertiary} style={styles.sectionTitle}>
                {isRTL ? 'פרטי מוצר' : 'PRODUCT DETAILS'}
              </Text>

              <FormField
                label={isRTL ? 'שם המוצר (עברית) *' : 'Product Name (Hebrew) *'}
                value={form.name_he}
                onChangeText={v => setField('name_he', v)}
                placeholder={isRTL ? 'לדוג׳: גבינה צהובה' : 'e.g. גבינה צהובה'}
                isRTL={isRTL}
              />
              <FormField
                label={isRTL ? 'שם המוצר (אנגלית)' : 'Product Name (English)'}
                value={form.name_en}
                onChangeText={v => setField('name_en', v)}
                placeholder="e.g. Yellow Cheese"
              />
              <FormField
                label={isRTL ? 'תיאור' : 'Description'}
                value={form.description_he}
                onChangeText={v => setField('description_he', v)}
                placeholder={isRTL ? 'תיאור קצר של המוצר...' : 'Short description...'}
                multiline
                isRTL={isRTL}
              />
            </Animated.View>

            {/* Section: Pricing */}
            <Animated.View entering={FadeInDown.delay(120).duration(300)} style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.borderLight }]}>
              <Text variant="sm" weight="semiBold" color={theme.textTertiary} style={styles.sectionTitle}>
                {isRTL ? 'מחירים' : 'PRICING'}
              </Text>

              <View style={styles.row}>
                <View style={{ flex: 1, marginEnd: Spacing.sm }}>
                  <FormField
                    label={isRTL ? 'מחיר (₪) *' : 'Price (₪) *'}
                    value={form.price}
                    onChangeText={v => setField('price', v)}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormField
                    label={isRTL ? 'מחיר מבצע (₪)' : 'Discount Price (₪)'}
                    value={form.discount_price}
                    onChangeText={v => setField('discount_price', v)}
                    placeholder={isRTL ? 'ריק = ללא מבצע' : 'Empty = no sale'}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </Animated.View>

            {/* Section: Inventory */}
            <Animated.View entering={FadeInDown.delay(180).duration(300)} style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.borderLight }]}>
              <Text variant="sm" weight="semiBold" color={theme.textTertiary} style={styles.sectionTitle}>
                {isRTL ? 'מלאי ויחידה' : 'INVENTORY & UNIT'}
              </Text>

              <View style={styles.row}>
                <View style={{ flex: 1, marginEnd: Spacing.sm }}>
                  <FormField
                    label={isRTL ? 'כמות במלאי' : 'Stock Qty'}
                    value={form.stock_qty}
                    onChangeText={v => setField('stock_qty', v)}
                    placeholder="0"
                    keyboardType="number-pad"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  {/* Unit Picker trigger */}
                  <View style={fieldStyles.wrapper}>
                    <Text variant="sm" weight="medium" style={[fieldStyles.label, { color: theme.textSecondary }]}>
                      {isRTL ? 'יחידה' : 'Unit'}
                    </Text>
                    <TouchableOpacity
                      style={[fieldStyles.pickerBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
                      onPress={() => setShowUnitPicker(true)}
                    >
                      <Text variant="md">{form.unit}</Text>
                      <MaterialIcons name="arrow-drop-down" size={20} color={theme.textTertiary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Category Picker trigger */}
              <View style={fieldStyles.wrapper}>
                <Text variant="sm" weight="medium" style={[fieldStyles.label, { color: theme.textSecondary }]}>
                  {isRTL ? 'קטגוריה *' : 'Category *'}
                </Text>
                <TouchableOpacity
                  style={[fieldStyles.pickerBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
                  onPress={() => setShowCategoryPicker(true)}
                >
                  <Text variant="md" color={selectedCategory ? theme.text : theme.textTertiary}>
                    {selectedCategory?.name_he ?? (isRTL ? 'בחר קטגוריה...' : 'Select category...')}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={theme.textTertiary} />
                </TouchableOpacity>
              </View>

              <FormField
                label={isRTL ? 'תגית עונתית' : 'Seasonal Tag'}
                value={form.seasonal_tag}
                onChangeText={v => setField('seasonal_tag', v)}
                placeholder={isRTL ? 'לדוג׳: קיץ' : 'e.g. Summer'}
                isRTL={isRTL}
              />
            </Animated.View>

            {/* Section: Flags */}
            <Animated.View entering={FadeInDown.delay(240).duration(300)} style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.borderLight }]}>
              <Text variant="sm" weight="semiBold" color={theme.textTertiary} style={styles.sectionTitle}>
                {isRTL ? 'הגדרות' : 'SETTINGS'}
              </Text>
              <ToggleRow label={isRTL ? 'פעיל' : 'Active'} value={form.is_active} onValueChange={v => setField('is_active', v)} />
              <ToggleRow label={isRTL ? 'מומלץ (Featured)' : 'Featured'} value={form.is_featured} onValueChange={v => setField('is_featured', v)} tint={theme.secondary} />
              <ToggleRow label={isRTL ? 'מבצע (Offer)' : 'On Offer'} value={form.is_offer} onValueChange={v => setField('is_offer', v)} tint={theme.secondary} />
              <ToggleRow label={isRTL ? 'אורגני' : 'Organic'} value={form.is_organic} onValueChange={v => setField('is_organic', v)} tint={theme.success} />
            </Animated.View>

            {/* Delete button (edit mode only) */}
            {isEditMode && (
              <Animated.View entering={FadeInDown.delay(300).duration(300)} style={{ marginBottom: Spacing['3xl'] }}>
                <Button
                  title={deleting ? (isRTL ? 'מוחק...' : 'Deleting...') : (isRTL ? 'מחק מוצר' : 'Delete Product')}
                  variant="danger"
                  icon="delete-outline"
                  fullWidth
                  loading={deleting}
                  onPress={handleDelete}
                />
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Unit Picker Modal */}
      <Modal
        visible={showUnitPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <Pressable style={styles.pickerOverlay} onPress={() => setShowUnitPicker(false)}>
          <Animated.View entering={SlideInDown.duration(200)} style={[styles.pickerSheet, { backgroundColor: theme.surface }]}>
            <Text variant="lg" weight="bold" style={{ marginBottom: Spacing.md }}>
              {isRTL ? 'בחר יחידה' : 'Select Unit'}
            </Text>
            {UNIT_OPTIONS.map(u => (
              <TouchableOpacity
                key={u}
                style={[styles.pickerOption, { borderBottomColor: theme.borderLight }]}
                onPress={() => { setField('unit', u); setShowUnitPicker(false); }}
              >
                <Text variant="md" weight={form.unit === u ? 'bold' : 'regular'} color={form.unit === u ? theme.primary : theme.text}>
                  {u}
                </Text>
                {form.unit === u && <MaterialIcons name="check" size={18} color={theme.primary} />}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <Pressable style={styles.pickerOverlay} onPress={() => setShowCategoryPicker(false)}>
          <Animated.View entering={SlideInDown.duration(200)} style={[styles.pickerSheet, { backgroundColor: theme.surface }]}>
            <Text variant="lg" weight="bold" style={{ marginBottom: Spacing.md }}>
              {isRTL ? 'בחר קטגוריה' : 'Select Category'}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.pickerOption, { borderBottomColor: theme.borderLight }]}
                  onPress={() => { setField('category_id', cat.id); setShowCategoryPicker(false); }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                    {cat.icon && <Text variant="lg">{cat.icon}</Text>}
                    <Text variant="md" weight={form.category_id === cat.id ? 'bold' : 'regular'} color={form.category_id === cat.id ? theme.primary : theme.text}>
                      {cat.name_he}
                    </Text>
                  </View>
                  {form.category_id === cat.id && <MaterialIcons name="check" size={18} color={theme.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>
    </Modal>
  );
}

// -------------------------
// Styles
// -------------------------
const fieldStyles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label: { marginBottom: Spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: 15,
    fontFamily: Typography.fontFamily.regular,
    minHeight: 46,
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: Spacing.sm,
    textAlignVertical: 'top',
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 12 : Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    ...Shadows.sm,
  },
  headerBtn: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  saveBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minWidth: 64,
    alignItems: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 80,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  imagePicker: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    maxHeight: '70%',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
});
