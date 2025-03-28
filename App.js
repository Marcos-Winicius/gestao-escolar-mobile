// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import { StyleSheet, Text, View,FlatList } from 'react-native';

// export default function App() {
//   useEffect(()=>{
  //     // tabelaAlunos();
//     // inserirAluno({matricula: 1, nome: 'Roger', email: 'rogerguedes@gmail.com', telefone: '84940028922'});
//     buscarAlunos();
//   }, [])

//   const alunos = buscarAlunos();
//   return (
//     <View style={styles.container}>
//       <Text>Teste</Text>
//       {/* <FlatList
//                 data={alunos}
//                 keyExtractor={(aluno) => aluno.matricula}
//                 renderItem={({ aluno }) => {                    
  //                     return (
//                         <View style={styles.card}>
//                             <Text style={styles.nome}>Nome:{aluno.nome}</Text>
//                             <Text style={styles.nome}>Email:{aluno.email}</Text>
//                         </View>
//                     );
//                 }}
//             /> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import AlunosScreen from './screens/AlunosScreen';
import ProfessoresScreen from './screens/ProfessoresScreen';
import CursosScreen from './screens/CursosScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen}
    options={{ 
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="home" color={color} size={size} />
      ),
      headerShown: false
    }}
    />
    <Tab.Screen name="Alunos" component={AlunosScreen}
    options={{ 
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="people" color={color} size={size} />
      ),
      headerShown: false
    }}
    />
    <Tab.Screen name="Professores" component={ProfessoresScreen} 
    options={{
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="person" color={color} size={size} />
      ), headerShown: false
    }}
    />
    <Tab.Screen name="Cursos" component={CursosScreen} 
    options={{
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="book" color={color} size={size} />
      ), headerShown: false
    }}
    />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeTabs} />
    <Stack.Screen 
    name="Cadastro" 
    component={CadastroScreen} 
    options={({ route }) => ({ 
      title: route.params.id ? 'Editar' : 'Novo' 
    })}
    />
    </Stack.Navigator>
    </NavigationContainer>
  );
}