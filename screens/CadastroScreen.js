import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { crudOperations } from '../database/db';
import { Picker } from '@react-native-picker/picker';

export default function CadastroScreen({ route, navigation }) {
  const tipoCadastro = route.params?.tipo || 'aluno';
  const itemEdicao = route.params?.item;
  
  // Estados baseados no tipo de cadastro
  const [formData, setFormData] = useState(itemEdicao || {
    nome: '',
    ...(tipoCadastro === 'aluno' && {
      matricula: '',
      curso_id: '',
      email: '',
      telefone: ''
    }),
    ...(tipoCadastro === 'professor' && {
      departamento: '',
      email: '',
      disciplinas: ''
    }),
    ...(tipoCadastro === 'curso' && {
      duracao: '',
      coordenador_id: ''
    })
  });

  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);

  // Carrega dados auxiliares quando o tipo muda
  useEffect(() => {
    const carregarDadosAuxiliares = async () => {
      if (tipoCadastro === 'aluno') {
        const listaCursos = await crudOperations.cursos.buscarTodos();
        setCursos(listaCursos);
      }
      if (tipoCadastro === 'curso') {
        const listaProfessores = await crudOperations.professores.buscarTodos();
        setProfessores(listaProfessores);
      }
    };
    
    carregarDadosAuxiliares();
  }, [tipoCadastro]);

  const handleSalvar = async () => {
    try {
      // Validação básica
      if (!formData.nome) {
        throw new Error('Nome é obrigatório');
      }

      if (tipoCadastro === 'aluno' && !formData.matricula) {
        throw new Error('Matrícula é obrigatória');
      }

      // Decide se é criação ou atualização
      if (itemEdicao?.id) {
        if(tipoCadastro == 'professor'){
          await crudOperations[tipoCadastro + 'es'].atualizar(itemEdicao.id, formData);
        }else{
          console.log(formData);
          await crudOperations[tipoCadastro + 's'].atualizar(itemEdicao.id, formData);
        }
        Alert.alert('Sucesso', 'Registro atualizado com sucesso!');
      } else {
        if(tipoCadastro == 'professor'){
          await crudOperations[tipoCadastro + 'es'].criar(formData);
        }else{
          await crudOperations[tipoCadastro + 's'].criar(formData);
        }
        Alert.alert('Sucesso', 'Registro criado com sucesso!');
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {itemEdicao ? 'Editar' : 'Novo'} {tipoCadastro}
      </Text>

      {/* Campo comum a todos */}
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={formData.nome}
        onChangeText={text => setFormData({...formData, nome: text})}
      />

      {/* Campos específicos para alunos */}
      {tipoCadastro === 'aluno' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Matrícula"
            value={formData.matricula}
            onChangeText={text => setFormData({...formData, matricula: text})}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Curso:</Text>
          <Picker
            selectedValue={formData.curso_id}
            onValueChange={itemValue => setFormData({...formData, curso_id: itemValue})}
            style={styles.picker}>
            <Picker.Item label="Selecione um curso" value="" />
            {cursos.map(curso => (
              <Picker.Item key={curso.id} label={curso.nome} value={curso.id} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={formData.email}
            onChangeText={text => setFormData({...formData, email: text})}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={formData.telefone}
            onChangeText={text => setFormData({...formData, telefone: text})}
            keyboardType="phone-pad"
          />
        </>
      )}

      {/* Campos específicos para professores */}
      {tipoCadastro === 'professor' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Departamento"
            value={formData.departamento}
            onChangeText={text => setFormData({...formData, departamento: text})}
          />

          <TextInput
            style={styles.input}
            placeholder="E-mail institucional"
            value={formData.email}
            onChangeText={text => setFormData({...formData, email: text})}
            keyboardType="email-address"
          />

          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Disciplinas (separadas por vírgula)"
            value={formData.disciplinas}
            onChangeText={text => setFormData({...formData, disciplinas: text})}
            multiline
          />
        </>
      )}

      {/* Campos específicos para cursos */}
      {tipoCadastro === 'curso' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Duração (em semestres)"
            value={formData.duracao.toString()}
            onChangeText={text => setFormData({...formData, duracao: text})}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Coordenador:</Text>
          <Picker
            selectedValue={formData.coordenador_id}
            onValueChange={itemValue => setFormData({...formData, coordenador_id: itemValue})}
            style={styles.picker}>
            <Picker.Item label="Selecione um coordenador" value="" />
            {professores.map(prof => (
              <Picker.Item key={prof.id} label={prof.nome} value={prof.id} />
            ))}
          </Picker>
        </>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={itemEdicao ? "Atualizar" : "Cadastrar"}
          onPress={handleSalvar}
          color="#2e86de"
        />

        <View style={styles.spacer} />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          color="#e74c3c"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  picker: {
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#7f8c8d',
  },
  buttonContainer: {
    marginTop: 20,
  },
  spacer: {
    height: 10,
  },
});