import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);

  // === ADD / UPDATE NOTE ===
  const addNote = () => {
    if (inputText.trim() === '') {
      alert('Tulis dulu ya!');
      return;
    }

    if (editingId) {
      // UPDATE
      setNotes(prev =>
        prev.map(note =>
          note.id === editingId ? { ...note, text: inputText } : note
        )
      );
      setEditingId(null);
    } else {
      // ADD
      const newNote = {
        id: Date.now(),
        text: inputText,
        done: false,
        time: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setNotes(prev => [newNote, ...prev]);
    }

    setInputText('');
  };

  // === DELETE ===
  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // === DONE ===
  const toggleDone = (id) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, done: !n.done } : n
      )
    );
  };

  // === EDIT ===
  const editNote = (item) => {
    setInputText(item.text);
    setEditingId(item.id);
  };

  // === FILTER ===
  const filteredNotes = notes.filter(n => {
    if (filter === 'active') return !n.done;
    if (filter === 'done') return n.done;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📝 Notes App</Text>
          <Text style={styles.headerSubtitle}>
            {notes.filter(n => n.done).length} selesai dari {notes.length}
          </Text>
        </View>

        {/* FILTER */}
        <View style={styles.filterRow}>
          {['all', 'active', 'done'].map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                filter === f && styles.filterActive
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={styles.filterText}>
                {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Selesai'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isInputFocused && { borderColor: '#61dafb' }
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tulis catatan..."
            placeholderTextColor="#555"
            maxLength={200}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />

          <TouchableOpacity style={styles.addButton} onPress={addNote}>
            <Text style={styles.addButtonText}>
              {editingId ? 'Update' : 'Tambah'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* COUNTER */}
        {inputText.length > 0 && (
          <Text style={styles.counter}>
            {inputText.length}/200
          </Text>
        )}

        {/* LIST */}
        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => toggleDone(item.id)}
              >
                <Text style={[
                  styles.noteText,
                  item.done && { textDecorationLine: 'line-through', color: '#555' }
                ]}>
                  {item.text}
                </Text>

                <Text style={styles.noteTime}>
                  {item.time} {item.done ? '✅' : ''}
                </Text>
              </TouchableOpacity>

              {/* EDIT */}
              <TouchableOpacity onPress={() => editNote(item)}>
                <Text style={{ color: '#61dafb' }}>✏️</Text>
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity onPress={() => deleteNote(item.id)}>
                <Text style={{ color: '#ff5555' }}>🗑</Text>
              </TouchableOpacity>

            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Belum ada catatan</Text>
          }
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d1117' },
  container: { flex: 1 },

  header: { padding: 20 },
  headerTitle: { color: '#61dafb', fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { color: '#8b949e' },

  filterRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  filterBtn: { padding: 8, backgroundColor: '#161b22', borderRadius: 8 },
  filterActive: { backgroundColor: '#238636' },
  filterText: { color: '#fff' },

  inputContainer: { flexDirection: 'row', padding: 16, gap: 10 },
  input: {
    flex: 1,
    backgroundColor: '#161b22',
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#30363d'
  },

  addButton: {
    backgroundColor: '#238636',
    padding: 12,
    borderRadius: 10
  },
  addButtonText: { color: '#fff' },

  counter: { textAlign: 'right', marginRight: 16, color: '#888' },

  listContent: { padding: 16 },

  noteCard: {
    backgroundColor: '#161b22',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10
  },

  noteText: { color: '#fff' },
  noteTime: { color: '#8b949e', fontSize: 12 },

  empty: { textAlign: 'center', marginTop: 40, color: '#888' }
});