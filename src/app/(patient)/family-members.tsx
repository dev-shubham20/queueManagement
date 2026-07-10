import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Polyline, Line, Rect } from 'react-native-svg';
import { Image } from 'expo-image';

// Icons
const ArrowLeftIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const CheckBadgeIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#0052FF" />
    <Path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PencilIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </Svg>
);

const TrashIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Line x1="10" y1="11" x2="10" y2="17" />
    <Line x1="14" y1="11" x2="14" y2="17" />
  </Svg>
);

const UserPlusIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="8.5" cy="7" r="4" />
    <Line x1="20" y1="8" x2="20" y2="14" />
    <Line x1="23" y1="11" x2="17" y2="11" />
  </Svg>
);

const DefaultAvatarIcon = () => (
  <Svg width={60} height={60} viewBox="0 0 60 60" fill="none">
    <Circle cx="30" cy="30" r="30" fill="#DCFCE7" />
    <Circle cx="30" cy="24" r="8" fill="#16A34A" />
    <Path d="M14 48c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#16A34A" strokeWidth={4} strokeLinecap="round" />
  </Svg>
);

export default function FamilyMembersScreen() {
  const router = useRouter();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formRelation, setFormRelation] = useState('');

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState('');

  const openAddModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormAge('');
    setFormRelation('');
    setModalVisible(true);
  };

  const openEditModal = (name: string, age: string, relation: string) => {
    setEditingMember({ name, age, relation });
    setFormName(name);
    setFormAge(age);
    setFormRelation(relation);
    setModalVisible(true);
  };

  const openDeleteModal = (name: string) => {
    setMemberToDelete(name);
    setDeleteModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top', 'bottom']}>
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Family Members</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.description}>
          Manage profiles for your loved ones to book appointments on their behalf.
        </Text>

        {/* Primary Member */}
        <View style={[styles.card, styles.primaryCard]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.checkBadge}>
              <CheckBadgeIcon />
            </View>
          </View>
          
          <View style={styles.cardInfo}>
            <Text style={styles.nameText}>Michael Stevens (You)</Text>
            <View style={styles.metaRow}>
              <View style={styles.pillPrimary}>
                <Text style={styles.pillPrimaryText}>Primary</Text>
              </View>
              <Text style={styles.metaText}>Age: 32 • Relation: Self</Text>
            </View>
          </View>
          
          <View style={styles.actionIcons}>
            <Pressable style={styles.iconButton} onPress={() => openEditModal('Michael Stevens', '32', 'Self')}>
              <PencilIcon />
            </Pressable>
          </View>
        </View>

        {/* Family Member 1 */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' }}
              style={styles.avatar}
            />
          </View>
          
          <View style={styles.cardInfo}>
            <Text style={styles.nameText}>Sarah Stevens</Text>
            <Text style={styles.metaTextNoPill}>Age: 28 • Relation: Spouse</Text>
          </View>
          
          <View style={styles.actionIcons}>
            <Pressable style={styles.iconButton} onPress={() => openEditModal('Sarah Stevens', '28', 'Spouse')}>
              <PencilIcon />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => openDeleteModal('Sarah Stevens')}>
              <TrashIcon />
            </Pressable>
          </View>
        </View>

        {/* Family Member 2 */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <DefaultAvatarIcon />
          </View>
          
          <View style={styles.cardInfo}>
            <Text style={styles.nameText}>James Stevens</Text>
            <Text style={styles.metaTextNoPill}>Age: 5 • Relation: Son</Text>
          </View>
          
          <View style={styles.actionIcons}>
            <Pressable style={styles.iconButton} onPress={() => openEditModal('James Stevens', '5', 'Son')}>
              <PencilIcon />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => openDeleteModal('James Stevens')}>
              <TrashIcon />
            </Pressable>
          </View>
        </View>

        {/* Family Member 3 */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1581579205556-3a13783c1ce7?auto=format&fit=crop&w=150&q=80' }}
              style={styles.avatar}
            />
          </View>
          
          <View style={styles.cardInfo}>
            <Text style={styles.nameText}>Linda Stevens</Text>
            <Text style={styles.metaTextNoPill}>Age: 60 • Relation: Mother</Text>
          </View>
          
          <View style={styles.actionIcons}>
            <Pressable style={styles.iconButton} onPress={() => openEditModal('Linda Stevens', '60', 'Mother')}>
              <PencilIcon />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => openDeleteModal('Linda Stevens')}>
              <TrashIcon />
            </Pressable>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.addButton} onPress={openAddModal}>
          <UserPlusIcon />
          <Text style={styles.addButtonText}>Add Family Member</Text>
        </Pressable>
      </View>

      {/* Edit/Add Modal Popup */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingMember ? 'Edit Family Member' : 'Add Family Member'}
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput 
                style={styles.inputField} 
                placeholder="E.g., Jane Doe"
                placeholderTextColor="#94A3B8"
                value={formName}
                onChangeText={setFormName}
              />
            </View>

            <View style={styles.inputGroupRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput 
                  style={styles.inputField} 
                  placeholder="E.g., 25"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={formAge}
                  onChangeText={setFormAge}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Relation</Text>
                <TextInput 
                  style={styles.inputField} 
                  placeholder="E.g., Spouse"
                  placeholderTextColor="#94A3B8"
                  value={formRelation}
                  onChangeText={setFormRelation}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSaveButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Remove Family Member?</Text>
            <Text style={styles.deleteModalText}>
              Are you sure you want to remove {memberToDelete} from your family members? This action cannot be undone.
            </Text>
            
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelButton} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalDeleteButton} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.modalSaveText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Outfit_600SemiBold',
    color: '#0052FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for footer
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  primaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#0052FF',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 2,
  },
  cardInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#1E293B',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  metaTextNoPill: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    marginTop: 2,
  },
  pillPrimary: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillPrimaryText: {
    color: '#3730A3',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0052FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#0052FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1E293B',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#1E293B',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#475569',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0052FF',
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  deleteModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  deleteModalTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteModalText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
});
