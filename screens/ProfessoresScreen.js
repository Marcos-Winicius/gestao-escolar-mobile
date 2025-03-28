import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import {crudOperations, criarTabelas} from '../database/db';


export default function ProfessoresScreen({route, navigation}) {
  const [professores, setProfessores] = useState([]);
  const [pesquisa, setPesquisa] = useState('');

  const carregarDados = async () => {
    const dados = await crudOperations.professores.buscarTodos();
    setProfessores(dados);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarDados);
    return unsubscribe;
  }, [navigation]);

  const filtrarDados = professores.filter(item =>
    item.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    item.email.includes(pesquisa)
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Pesquisar..."
        value={pesquisa}
        onChangeText={setPesquisa}
        style={{ marginBottom: 10, padding: 8, borderWidth: 1 }}
      />
      
      <FlatList
        data={filtrarDados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.nome}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Departamento: {item.departamento}</Text>
            
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                {/* Criar tela de edição */}
              <Button
                title="Editar"
                onPress={() => {navigation.navigate('Cadastro', { tipo: 'professor', item: item })}}
              />
              <Button
                title="Excluir"
                color="red"
                onPress={async () => {
                  await crudOperations.professores.excluir(item.id);
                  carregarDados();
                }}
              />
            </View>
          </View>
        )}
      />
      
      <Button
        title="Novo Professor"
        onPress={() => {navigation.navigate('Cadastro', { tipo: 'professor' })}}
      />
    </View>
  );
}