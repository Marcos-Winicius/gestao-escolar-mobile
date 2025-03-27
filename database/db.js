import * as SQLite from 'expo-sqlite'

export const conexaoDB = async () => {
    try {
        const db = await SQLite.openDatabaseAsync('databaseProjeto');
        
        return db;
    } catch (error) {
        console.error('Erro ao abrir o banco de dados: ', error);
        throw error; // Rejeita o erro para ser tratado por quem chama a função
    }
}

export const tabelaAlunos = async () => {
    try {
        const db = await conexaoDB();
        // Criação da tabela alunos se não existir
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS alunos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                matricula TEXT UNIQUE NOT NULL,
                email TEXT,
                telefone TEXT,
                data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        return db;
    } catch (error) {
        console.error('Erro ao criar tabela alunos: ', error);
        throw error;
    }
}

// Funções adicionais para operações CRUD
export const inserirAluno = async ({matricula, nome, email, telefone}) => {
    try {
        const db = await tabelaAlunos();
        
        const result = await db.runAsync(
            `INSERT INTO alunos (nome, matricula, email, telefone) 
             VALUES (?, ?, ?, ?)`,
            [nome, matricula, email || null, telefone || null]
        );
        
        return result;
    } catch (error) {
        console.error('Erro ao inserir aluno:', error);
        throw error;
    }
}

export const buscarAlunos = async () => {
    try {
        const db = await tabelaAlunos();
        
        const result = await db.getAllAsync('SELECT * FROM alunos');
        return result;
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        throw error;
    }
}

export const atualizarAluno = async (id, {matricula, nome, email, telefone}) => {
    try {
        const db = await tabelaAlunos();
        
        // Construir a query dinamicamente com base nos campos fornecidos
        const updates = [];
        const values = [];
        
        if (matricula !== undefined) {
            updates.push('matricula = ?');
            values.push(matricula);
        }
        if (nome !== undefined) {
            updates.push('nome = ?');
            values.push(nome);
        }
        if (email !== undefined) {
            updates.push('email = ?');
            values.push(email);
        }
        if (telefone !== undefined) {
            updates.push('telefone = ?');
            values.push(telefone);
        }
        
        if (updates.length === 0) {
            throw new Error('Nenhum campo fornecido para atualização');
        }
        
        values.push(id);
        
        const query = `UPDATE alunos SET ${updates.join(', ')} WHERE id = ?`;
        
        const result = await db.runAsync(query, values);
        console.log('Aluno atualizado:', result.changes, 'registro(s) afetado(s)');
        return result;
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        throw error;
    }
}

export const deletarAluno = async (id) => {
    try {
        const db = await tabelaAlunos();
        
        const result = await db.runAsync('DELETE FROM alunos WHERE id = ?', [id]);
        console.log('Aluno deletado:', result.changes, 'registro(s) afetado(s)');
        return result;
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        throw error;
    }
}