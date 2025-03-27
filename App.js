import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View,FlatList } from 'react-native';
import { conexaoDB, tabelaAlunos, buscarAlunos, inserirAluno } from './database/db';

export default function App() {
  useEffect(()=>{
    // tabelaAlunos();
    // inserirAluno({matricula: 1, nome: 'Roger', email: 'rogerguedes@gmail.com', telefone: '84940028922'});
    buscarAlunos();
  }, [])

  const alunos = buscarAlunos();
  return (
    <View style={styles.container}>
      <Text>Teste</Text>
      {/* <FlatList
                data={alunos}
                keyExtractor={(aluno) => aluno.matricula}
                renderItem={({ aluno }) => {                    
                    return (
                        <View style={styles.card}>
                            <Text style={styles.nome}>Nome:{aluno.nome}</Text>
                            <Text style={styles.nome}>Email:{aluno.email}</Text>
                        </View>
                    );
                }}
            /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
