import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import ApiService from './services/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    checkApiHealth();
    loadUsers();
  }, []);

  const checkApiHealth = async () => {
    try {
      const healthData = await ApiService.checkHealth();
      setHealth(healthData);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await ApiService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const createTestUser = async () => {
    try {
      await ApiService.createUser({
        name: 'Test User',
        email: `test${Date.now()}@example.com`
      });
      loadUsers();
      Alert.alert('Succès', 'Utilisateur créé!');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer l\'utilisateur');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Boilerplate</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status API:</Text>
        <Text style={styles.status}>
          {health ? `✅ ${health.status}` : '❌ Déconnecté'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilisateurs ({users.length}):</Text>
        {users.map(user => (
          <Text key={user.id} style={styles.userItem}>
            • {user.name} ({user.email})
          </Text>
        ))}
      </View>

      <Button 
        title="Créer un utilisateur test" 
        onPress={createTestUser}
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  section: {
    marginVertical: 15,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#666',
  },
  userItem: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
});
