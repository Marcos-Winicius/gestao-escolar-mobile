// import * as SQLite from 'expo-sqlite'

// export const conexaoDB = async () => {
  //     try {
//         const db = await SQLite.openDatabaseAsync('databaseProjeto');

//         return db;
//     } catch (error) {
//         console.error('Erro ao abrir o banco de dados: ', error);
//         throw error; // Rejeita o erro para ser tratado por quem chama a função
//     }
// }

// export const tabelaAlunos = async () => {
  //     try {
//         const db = await conexaoDB();
//         // Criação da tabela alunos se não existir
//         await db.execAsync(`
//             CREATE TABLE IF NOT EXISTS alunos (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 nome TEXT NOT NULL,
//                 matricula TEXT UNIQUE NOT NULL,
//                 email TEXT,
//                 telefone TEXT,
//                 data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
//             );
//         `);

//         return db;
//     } catch (error) {
//         console.error('Erro ao criar tabela alunos: ', error);
//         throw error;
//     }
// }

// // Funções adicionais para operações CRUD
// export const inserirAluno = async ({matricula, nome, email, telefone}) => {
  //     try {
//         const db = await tabelaAlunos();

//         const result = await db.runAsync(
//             `INSERT INTO alunos (nome, matricula, email, telefone) 
//              VALUES (?, ?, ?, ?)`,
//             [nome, matricula, email || null, telefone || null]
//         );

//         return result;
//     } catch (error) {
//         console.error('Erro ao inserir aluno:', error);
//         throw error;
//     }
// }

// export const buscarAlunos = async () => {
  //     try {
//         const db = await tabelaAlunos();

//         const result = await db.getAllAsync('SELECT * FROM alunos');
//         return result;
//     } catch (error) {
//         console.error('Erro ao buscar alunos:', error);
//         throw error;
//     }
// }

// export const atualizarAluno = async (id, {matricula, nome, email, telefone}) => {
  //     try {
//         const db = await tabelaAlunos();

//         // Construir a query dinamicamente com base nos campos fornecidos
//         const updates = [];
//         const values = [];

//         if (matricula !== undefined) {
//             updates.push('matricula = ?');
//             values.push(matricula);
//         }
//         if (nome !== undefined) {
//             updates.push('nome = ?');
//             values.push(nome);
//         }
//         if (email !== undefined) {
//             updates.push('email = ?');
//             values.push(email);
//         }
//         if (telefone !== undefined) {
//             updates.push('telefone = ?');
//             values.push(telefone);
//         }

//         if (updates.length === 0) {
//             throw new Error('Nenhum campo fornecido para atualização');
//         }

//         values.push(id);

//         const query = `UPDATE alunos SET ${updates.join(', ')} WHERE id = ?`;

//         const result = await db.runAsync(query, values);
//         console.log('Aluno atualizado:', result.changes, 'registro(s) afetado(s)');
//         return result;
//     } catch (error) {
//         console.error('Erro ao atualizar aluno:', error);
//         throw error;
//     }
// }

// export const deletarAluno = async (id) => {
  //     try {
//         const db = await tabelaAlunos();

//         const result = await db.runAsync('DELETE FROM alunos WHERE id = ?', [id]);
//         console.log('Aluno deletado:', result.changes, 'registro(s) afetado(s)');
//         return result;
//     } catch (error) {
//         console.error('Erro ao deletar aluno:', error);
//         throw error;
//     }
// }

import * as SQLite from 'expo-sqlite';

// Conexão com o banco
export const conexaoDB = SQLite.openDatabaseAsync('sigap.db');

// Criação das tabelas
export const criarTabelas = async () => {
  const db = await conexaoDB;
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      matricula TEXT UNIQUE NOT NULL,
      curso_id INTEGER,
      email TEXT,
      telefone TEXT,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(curso_id) REFERENCES cursos(id)
    );
    
    CREATE TABLE IF NOT EXISTS professores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      departamento TEXT NOT NULL,
      email TEXT UNIQUE,
      disciplinas TEXT
    );
    
    CREATE TABLE IF NOT EXISTS cursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE NOT NULL,
      duracao INTEGER,
      coordenador_id INTEGER,
      FOREIGN KEY(coordenador_id) REFERENCES professores(id)
    );
  `);
  };
  
  // Operações CRUD para todas as entidades
  export const crudOperations = {
    alunos: {
      criar: async (data) => {
        const db = await conexaoDB;
        return db.runAsync(
          `INSERT INTO alunos (nome, matricula, curso_id, email, telefone) 
         VALUES (?, ?, ?, ?, ?)`,
          [data.nome, data.matricula, data.curso_id, data.email, data.telefone]
        );
      },
      buscarTodos: async () => {
        const db = await conexaoDB;
        return db.getAllAsync('SELECT * FROM alunos');
      },
      excluir: async(id) => {
        const db = await conexaoDB;
        return db.runAsync('DELETE FROM usuario WHERE id = ?', [id])
      },
      atualizar: async(id, dados)=>{
        try {
          const db = await conexaoDB;        
          const updates = Object.entries(dados)
          .filter(([chave, valor]) => valor !== undefined)
          .map(([chave, valor]) => ({ chave, valor }));
          
          if (updates.length === 0) {
            throw new Error('Nenhum campo fornecido para atualização');
          }
          
          const query = `UPDATE alunos SET ${updates.map(({ chave }) => `${chave} = ?`).join(', ')} WHERE id = ?`;
          const values = updates.map(({ valor }) => valor);
          values.push(id);
          
          const result = await db.runAsync(query, values);
          console.log('Aluno atualizado:', result.changes, 'registro(s) afetado(s)');
          return result;
        } catch (error) {
          console.error('Erro ao atualizar aluno:', error);
          throw error;
        }
      }
      
    },
    professores: {
      criar: async (data) => {
        const db = await conexaoDB;
        return db.runAsync(
          `INSERT INTO professores (nome, departamento, email, disciplinas) 
         VALUES (?, ?, ?, ?)`,
          [data.nome, data.departamento, data.email, data.disciplinas]
        );
      },
      buscarTodos: async()=>{
        const db = await conexaoDB;
        return db.getAllAsync('SELECT * from professores')
      },
      excluir: async(id) => {
        const db = await conexaoDB;
        return db.runAsync('DELETE FROM professores WHERE id = ?', [id])
      },
      atualizar: async(id, dados)=>{
        try {
          const db = await conexaoDB;        
          const updates = Object.entries(dados)
          .filter(([chave, valor]) => valor !== undefined)
          .map(([chave, valor]) => ({ chave, valor }));
          
          if (updates.length === 0) {
            throw new Error('Nenhum campo fornecido para atualização');
          }
          
          const query = `UPDATE professores SET ${updates.map(({ chave }) => `${chave} = ?`).join(', ')} WHERE id = ?`;
          const values = updates.map(({ valor }) => valor);
          values.push(id);
          
          const result = await db.runAsync(query, values);
          console.log('Professor atualizado:', result.changes, 'registro(s) afetado(s)');
          return result;
        } catch (error) {
          console.error('Erro ao atualizar aluno:', error);
          throw error;
        }
      }
      // ... outras operações
    },
    cursos: {
      criar: async (data) => {
        const db = await conexaoDB;
        return db.runAsync(
          `INSERT INTO cursos (nome, duracao, coordenador_id) 
         VALUES (?, ?, ?)`,
          [data.nome, data.duracao, data.coordenador_id]
        );
      },
      buscarTodos: async()=>{
        const db = await conexaoDB;
        return db.getAllAsync('SELECT * from cursos')
      },
      excluir: async(id) => {
        const db = await conexaoDB;
        return db.runAsync('DELETE FROM cursos WHERE id = ?', [id])
      },
      atualizar: async(id, dados)=>{
        try {
          const db = await conexaoDB;        
          const updates = Object.entries(dados)
          .filter(([chave, valor]) => valor !== undefined)
          .map(([chave, valor]) => ({ chave, valor }));
          
          if (updates.length === 0) {
            throw new Error('Nenhum campo fornecido para atualização');
          }
          
          const query = `UPDATE cursos SET ${updates.map(({ chave }) => `${chave} = ?`).join(', ')} WHERE id = ?`;
          const values = updates.map(({ valor }) => valor);
          values.push(id);
          
          const result = await db.runAsync(query, values);
          console.log('Curso atualizado:', result.changes, 'registro(s) afetado(s)');
          return result;
        } catch (error) {
          console.error('Erro ao atualizar aluno:', error);
          throw error;
        }
      }
      // ... outras operações
    }
  };