import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import {crudOperations} from '../database/db';

export default function CursosScreen({route, navigation}) {
  const [cursos, setCursos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');

  const carregarDados = async () => {
    const dados = await crudOperations.cursos.buscarTodos();
    setCursos(dados);
  };

  useEffect(() => {
      const unsubscribe = navigation.addListener('focus', carregarDados);
      return unsubscribe;
    }, [navigation]);
  

  const filtrarDados = cursos.filter(item =>
    item.nome.toLowerCase().includes(pesquisa.toLowerCase())
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
            <Text>Nome: {item.nome}</Text>
            <Text>Duração: {item.duracao}</Text>
            
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                {/* Criar tela de edição */}
              <Button
                title="Editar"
                onPress={() => {navigation.navigate('Cadastro', { tipo: 'curso', item: item })}}
              />
              <Button
                title="Excluir"
                color="red"
                onPress={async () => {
                  await crudOperations.cursos.excluir(item.id);
                  carregarDados();
                }}
              />
            </View>
          </View>
        )}
      />
      
      <Button
        title="Novo Curso"
        onPress={() => {navigation.navigate('Cadastro', { tipo: 'curso' })}}
      />
    </View>
  );
}