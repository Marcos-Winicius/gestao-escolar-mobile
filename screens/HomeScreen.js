import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { crudOperations } from '../database/db';

export default function HomeScreen({ navigation }) {
  const [counts, setCounts] = useState({
    alunos: 0,
    professores: 0,
    cursos: 0
  });

  const carregarDados = async () => {
    try {
      const [alunos, professores, cursos] = await Promise.all([
        crudOperations.alunos.buscarTodos(),
        crudOperations.professores.buscarTodos(),
        crudOperations.cursos.buscarTodos()
      ]);
      
      setCounts({
        alunos: alunos.length,
        professores: professores.length,
        cursos: cursos.length
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarDados);
    carregarDados();
    return unsubscribe;
  }, [navigation]);

  const Card = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: color }]} 
      onPress={onPress}
    >
      <Ionicons name={icon} size={40} color="#fff" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Bem-vindo ao SIGAP</Text>
      <Text style={styles.subheader}>Sistema Integrado de Gestão Acadêmica</Text>

      <View style={styles.statsContainer}>
        <Card
          title="Alunos"
          value={counts.alunos}
          icon="people"
          color="#3498db"
          onPress={() => navigation.navigate('Alunos')}
        />
        <Card
          title="Professores"
          value={counts.professores}
          icon="person"
          color="#e74c3c"
          onPress={() => navigation.navigate('Professores')}
        />
      </View>

      <View style={styles.statsContainer}>
        <Card
          title="Cursos"
          value={counts.cursos}
          icon="book"
          color="#2ecc71"
          onPress={() => navigation.navigate('Cursos')}
        />
        <Card
          title="Relatórios"
          value="+"
          icon="document-text"
          color="#f39c12"
          onPress={() => navigation.navigate('Relatorios')}
        />
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Cadastro', { tipo: 'aluno' })}
        >
          <Ionicons name="person-add" size={24} color="#3498db" />
          <Text style={styles.actionText}>Novo Aluno</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Cadastro', { tipo: 'professor' })}
        >
          <Ionicons name="person-add" size={24} color="#e74c3c" />
          <Text style={styles.actionText}>Novo Professor</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Cadastro', { tipo: 'curso' })}
        >
          <Ionicons name="book" size={24} color="#e74c3c" />
          <Text style={styles.actionText}>Novo Curso</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#2c3e50',
  },
  subheader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#7f8c8d',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  cardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  quickActions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    rowGap: 10,
    flexWrap: 'wrap'
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
  },
  actionText: {
    marginLeft: 10,
    fontWeight: '500',
  },
});