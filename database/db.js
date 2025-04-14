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
      senha TEXT NOT NULL,
      telefone TEXT,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(curso_id) REFERENCES cursos(id)
    );
    
    CREATE TABLE IF NOT EXISTS professores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      departamento TEXT NOT NULL,
      email TEXT UNIQUE,
      senha TEXT NOT NULL,
      disciplinas TEXT
    );

    INSERT INTO professores(id, nome, departamento, email, senha, disciplinas) VALUES(1, "carlos", "TI", "marcoswini@gmail.com", "1234", "matemática");
    
    CREATE TABLE IF NOT EXISTS cursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE NOT NULL,
      duracao INTEGER,
      coordenador_id INTEGER,
      FOREIGN KEY(coordenador_id) REFERENCES professores(id)
    );
  `);
  console.log('Tabelas criadas ou verificadas com sucesso!');
  };

  export const deleteTabelas = async()=>{
    const db = await conexaoDB;
  
  await db.execAsync(`
    DROP TABLE professores;
    DROP TABLE cursos;
    DROP TABLE alunos;
  `);
  console.log('Tabelas deletadas ou verificadas com sucesso!');
  }
  
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
        return db.runAsync('DELETE FROM alunos WHERE id = ?', [id])
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
      },
      autenticar: async (email, senha) => {
        const db = await conexaoDB;
        return db.getFirstAsync(
          `SELECT * FROM alunos WHERE email = ? AND senha = ?`,
          [email, senha]
        );
      }
      
    },
    professores: {
      criar: async (data) => {        
        const db = await conexaoDB;
        return db.runAsync(
          `INSERT INTO professores (nome, departamento, email, senha, disciplinas) 
         VALUES (?, ?, ?, ?, ?)`,
          [data.nome, data.departamento, data.email, data.senha, data.disciplinas]
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
      },
      autenticar: async (email, senha) => {
        const db = await conexaoDB;
        return db.getFirstAsync(
          `SELECT * FROM professores WHERE email = ? AND senha = ?`,
          [email, senha]
        );
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
      },
    },
  };
  